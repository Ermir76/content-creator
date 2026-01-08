"""
Main content generation orchestration service.

This module coordinates all AI providers, implements retry logic,
error handling, and validation for generating social media content.
"""

import time
from typing import Tuple

from app.models.response_models import PlatformResult, GenerationResponse
from app.services.ai_provider import AIProvider
from app.services.circuit_breaker import CircuitBreaker
from app.services.model_router import ModelRouter
from app.services.output_validator import OutputValidator
from app.services.prompt_adapter import PromptAdapter
from app.services.retry_handler import RetryHandler


# Error codes for classification
class ErrorCode:
    """Standard error codes for content generation failures."""

    RATE_LIMIT = "RATE_LIMIT"
    TIMEOUT = "TIMEOUT"
    NETWORK_ERROR = "NETWORK_ERROR"
    INVALID_API_KEY = "INVALID_API_KEY"
    VALIDATION_FAILED = "VALIDATION_FAILED"
    PROVIDER_ERROR = "PROVIDER_ERROR"
    ALL_MODELS_FAILED = "ALL_MODELS_FAILED"
    CIRCUIT_OPEN = "CIRCUIT_OPEN"
    UNKNOWN = "UNKNOWN"


def classify_error(error: Exception) -> str:
    """
    Classify an error into a standard error code.

    Args:
        error: Exception that occurred during generation

    Returns:
        Error code string for client handling
    """
    error_str = str(error).lower()

    # Rate limit errors
    if any(
        keyword in error_str
        for keyword in ["rate limit", "429", "quota", "too many requests"]
    ):
        return ErrorCode.RATE_LIMIT

    # Timeout errors
    if any(keyword in error_str for keyword in ["timeout", "timed out", "deadline"]):
        return ErrorCode.TIMEOUT

    # Network/connection errors
    if any(
        keyword in error_str
        for keyword in ["network", "connection", "unreachable", "503", "502", "dns"]
    ):
        return ErrorCode.NETWORK_ERROR

    # Authentication errors
    if any(
        keyword in error_str
        for keyword in [
            "api key",
            "api_key",
            "authentication",
            "unauthorized",
            "401",
            "403",
            "invalid key",
        ]
    ):
        return ErrorCode.INVALID_API_KEY

    # Provider-specific errors
    if any(
        keyword in error_str
        for keyword in ["500", "internal server error", "service unavailable"]
    ):
        return ErrorCode.PROVIDER_ERROR

    return ErrorCode.UNKNOWN


class GenerationError(Exception):
    """Exception raised when all generation attempts fail."""

    def __init__(self, message: str, error_code: str, model_used: str = None):
        super().__init__(message)
        self.error_code = error_code
        self.model_used = model_used


def try_generate_with_retry(
    idea: str,
    platform: str,
    primary: AIProvider,
    fallback: AIProvider,
    circuit_breaker: CircuitBreaker,
    voice_profile: str = None,
    max_attempts_per_model: int = 2,
) -> Tuple[str, str, int]:
    """
    Attempt content generation with retry logic and fallback.

    Tries the primary model first, with retries. If all attempts fail,
    falls back to the secondary model with its own retry attempts.

    Args:
        idea: Content idea/prompt
        platform: Target platform (e.g., 'linkedin')
        primary: Primary AI provider
        fallback: Fallback AI provider
        circuit_breaker: Circuit breaker for tracking failures
        voice_profile: Optional voice/style profile
        max_attempts_per_model: Max retry attempts per model

    Returns:
        Tuple of (generated_content, model_used, regeneration_count)

    Raises:
        GenerationError: If all attempts with all models fail
    """
    models = [primary, fallback]
    last_error = None
    total_attempts = 0

    for provider in models:
        model_name = provider.get_name()

        # Check circuit breaker
        if not circuit_breaker.is_available(model_name):
            continue  # Skip this model, circuit is open

        for attempt in range(max_attempts_per_model):
            total_attempts += 1

            try:
                # Adapt prompt for this model
                prompt = PromptAdapter.adapt_prompt(
                    idea=idea,
                    platform=platform,
                    model_name=model_name,
                    voice_profile=voice_profile,
                )

                # Generate content
                content = provider.generate(prompt)

                # Validate output
                validation = OutputValidator.validate(content, platform)
                if not validation.passed:
                    last_error = Exception(f"Validation failed: {validation.reason}")
                    continue  # Try again or fallback

                # Success! Record it and return
                circuit_breaker.record_success(model_name)
                regeneration_count = (
                    total_attempts - 1
                )  # First attempt doesn't count as regeneration
                return content, model_name, regeneration_count

            except Exception as e:
                last_error = e
                error_code = classify_error(e)

                # Check if we should retry
                should_retry, wait_seconds = RetryHandler.should_retry(e)

                if not should_retry:
                    # Fatal error (e.g., invalid API key) - record failure and try next model
                    circuit_breaker.record_failure(model_name)
                    break  # Don't retry, move to fallback

                # Wait before retrying (only if we have more attempts)
                if attempt < max_attempts_per_model - 1:
                    time.sleep(min(wait_seconds, 5))  # Cap wait at 5 seconds for UX

                # Record the failure
                circuit_breaker.record_failure(model_name)

    # All models failed
    error_msg = str(last_error) if last_error else "All generation attempts failed"
    error_code = (
        classify_error(last_error) if last_error else ErrorCode.ALL_MODELS_FAILED
    )

    raise GenerationError(
        message=error_msg,
        error_code=error_code,
        model_used=models[-1].get_name() if models else None,
    )


# Global circuit breaker instance (shared across all generations)
_circuit_breaker = CircuitBreaker(failure_threshold=3, timeout=300)


def generate_for_platform(
    idea: str,
    platform: str,
    voice_profile: str = None,
    circuit_breaker: CircuitBreaker = None,
) -> PlatformResult:
    """
    Generate content for a single platform.

    Args:
        idea: Content idea/prompt
        platform: Target platform (e.g., 'linkedin', 'twitter')
        voice_profile: Optional voice/style profile
        circuit_breaker: Optional circuit breaker instance (uses global if not provided)

    Returns:
        PlatformResult with success/failure status and content or error
    """
    cb = circuit_breaker or _circuit_breaker

    try:
        # Get models for this platform via router
        primary, fallback = ModelRouter.select_model(platform)

        # Check if both models have open circuits
        if not cb.is_available(primary.get_name()) and not cb.is_available(
            fallback.get_name()
        ):
            return PlatformResult(
                platform=platform,
                success=False,
                content=None,
                model_used=None,
                error="All AI models temporarily unavailable",
                error_code=ErrorCode.CIRCUIT_OPEN,
                char_count=None,
            )

        # Try to generate with retry/fallback logic
        content, model_used, regeneration_count = try_generate_with_retry(
            idea=idea,
            platform=platform,
            primary=primary,
            fallback=fallback,
            circuit_breaker=cb,
            voice_profile=voice_profile,
        )

        # Success!
        return PlatformResult(
            platform=platform,
            success=True,
            content=content,
            model_used=model_used,
            error=None,
            error_code=None,
            char_count=len(content),
        )

    except GenerationError as e:
        # All generation attempts failed
        return PlatformResult(
            platform=platform,
            success=False,
            content=None,
            model_used=e.model_used,
            error=str(e),
            error_code=e.error_code,
            char_count=None,
        )

    except Exception as e:
        # Unexpected error
        error_code = classify_error(e)
        return PlatformResult(
            platform=platform,
            success=False,
            content=None,
            model_used=None,
            error=str(e),
            error_code=error_code,
            char_count=None,
        )


def generate_content(
    idea: str, platforms: list[str], voice_profile: str = None
) -> GenerationResponse:
    """
    Generate content for multiple platforms.

    This is the main entry point for content generation. It coordinates
    generation across all requested platforms, collecting results and
    tracking success/failure counts.

    Args:
        idea: Content idea/prompt to generate from
        platforms: List of platform names (e.g., ['linkedin', 'twitter', 'instagram'])
        voice_profile: Optional voice/style profile

    Returns:
        GenerationResponse with all results and summary counts
    """
    results: list[PlatformResult] = []
    success_count = 0
    failure_count = 0

    # Use global circuit breaker for consistency across platforms
    cb = _circuit_breaker

    for platform in platforms:
        # Generate for each platform
        result = generate_for_platform(
            idea=idea,
            platform=platform,
            voice_profile=voice_profile,
            circuit_breaker=cb,
        )

        results.append(result)

        if result.success:
            success_count += 1
        else:
            failure_count += 1

    return GenerationResponse(
        results=results,
        success_count=success_count,
        failure_count=failure_count,
        total_platforms=len(platforms),
    )


def get_circuit_breaker_status() -> dict:
    """
    Get the current status of all model circuit breakers.

    Returns:
        Dictionary with status for each known model
    """
    models = ["gemini", "openai", "anthropic", "xai"]
    return {model: _circuit_breaker.get_status(model) for model in models}


def reset_circuit_breaker(model_name: str = None) -> None:
    """
    Reset circuit breaker for a specific model or all models.

    Args:
        model_name: Optional model name to reset. If None, resets all.
    """
    if model_name:
        _circuit_breaker.reset(model_name)
    else:
        for model in ["gemini", "openai", "anthropic", "xai"]:
            _circuit_breaker.reset(model)
