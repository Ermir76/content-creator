"""
Resilience utilities: Retry logic and Circuit Breaker pattern.
"""

import time
from typing import Any, Dict, Tuple
from app.core.exceptions import AIProviderError


class RetryHandler:
    """Determines retry behavior for different error types."""

    @staticmethod
    def should_retry(error: Exception) -> Tuple[bool, int]:
        """
        Determine if an error should be retried and how long to wait.

        Args:
            error: Exception that occurred

        Returns:
            Tuple of (should_retry: bool, wait_seconds: int)
        """
        error_str = str(error).lower()

        # Rate limit errors - retry after waiting
        if "rate limit" in error_str or "429" in error_str or "quota" in error_str:
            return True, 60  # Wait 60 seconds

        # Timeout errors - retry with shorter wait
        if "timeout" in error_str or "timed out" in error_str:
            return True, 5  # Wait 5 seconds

        # Network errors - retry quickly
        if any(
            keyword in error_str
            for keyword in ["network", "connection", "unreachable", "503", "502"]
        ):
            return True, 3  # Wait 3 seconds

        # Authentication errors - don't retry (won't fix itself)
        if any(
            keyword in error_str
            for keyword in ["api key", "authentication", "unauthorized", "401", "403"]
        ):
            return False, 0  # Don't retry

        # Server errors - retry with moderate wait
        if "500" in error_str or "internal server error" in error_str:
            return True, 10  # Wait 10 seconds

        # Default: retry with short wait for unknown errors
        return True, 2  # Wait 2 seconds


class CircuitBreaker:
    """
    Circuit breaker to prevent repeated calls to failing AI models.

    When a model fails multiple times (default: 3), the circuit "opens"
    and the model is temporarily disabled. After a timeout period (default: 5 minutes),
    the circuit automatically closes and the model is tried again.
    """

    def __init__(self, failure_threshold: int = 3, timeout: int = 300):
        """
        Initialize circuit breaker.

        Args:
            failure_threshold: Number of failures before opening circuit (default: 3)
            timeout: Seconds before auto-recovery (default: 300 = 5 minutes)
        """
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failures: Dict[str, int] = {}  # model_name -> failure_count
        self.opened_at: Dict[str, float] = {}  # model_name -> timestamp when opened

    def is_available(self, model_name: str) -> bool:
        """
        Check if a model is available (circuit closed).

        Args:
            model_name: Name of the AI model

        Returns:
            True if model is available, False if circuit is open
        """
        # Check if circuit is open
        if model_name in self.opened_at:
            # Check if timeout has expired (auto-recovery)
            time_since_opened = time.time() - self.opened_at[model_name]
            if time_since_opened > self.timeout:
                # Auto-recover: close the circuit
                self.reset(model_name)
                return True
            # Circuit still open
            return False

        # Circuit is closed
        return True

    def record_failure(self, model_name: str):
        """
        Record a failure for a model. Opens circuit if threshold reached.

        Args:
            model_name: Name of the AI model that failed
        """
        # Increment failure count
        self.failures[model_name] = self.failures.get(model_name, 0) + 1

        # Check if threshold reached
        if self.failures[model_name] >= self.failure_threshold:
            # Open the circuit
            self.opened_at[model_name] = time.time()

    def record_success(self, model_name: str):
        """
        Record a successful call. Resets failure count.

        Args:
            model_name: Name of the AI model that succeeded
        """
        # Reset failure count
        self.failures[model_name] = 0

        # Close circuit if it was open
        if model_name in self.opened_at:
            del self.opened_at[model_name]

    def reset(self, model_name: str):
        """
        Manually reset circuit breaker for a model.

        Args:
            model_name: Name of the AI model to reset
        """
        # Clear failure count
        if model_name in self.failures:
            self.failures[model_name] = 0

        # Close circuit
        if model_name in self.opened_at:
            del self.opened_at[model_name]

    def get_status(self, model_name: str) -> Dict[str, Any]:
        """
        Get current status of a model's circuit.

        Args:
            model_name: Name of the AI model

        Returns:
            Dictionary with status information
        """
        is_open = model_name in self.opened_at
        failure_count = self.failures.get(model_name, 0)

        status = {
            "model": model_name,
            "circuit_open": is_open,
            "failure_count": failure_count,
            "available": self.is_available(model_name),
        }

        if is_open:
            time_remaining = self.timeout - (time.time() - self.opened_at[model_name])
            status["time_until_recovery"] = max(0, int(time_remaining))

        return status


# Global Circuit Breaker Instance
# Used across the application to track provider health
CIRCUIT_BREAKER = CircuitBreaker()


async def generate_with_resilience(
    providers: Tuple[object, ...], prompt: str
) -> object:
    """
    Execute generation with automatic fallback and circuit breaker updates.

    Args:
        providers: Tuple of (primary, fallback) providers (AIProvider objects)
        prompt: The prompt to send

    Returns:
        ProviderResponse: The result

    Raises:
        AIProviderError: If all providers fail
    """
    last_exception = None

    for provider in providers:
        if not provider:
            continue

        try:
            # Check circuit (redundant if Router checked, but good for race conditions)
            if not CIRCUIT_BREAKER.is_available(provider.get_name()):
                continue

            # Generate
            response = await provider.generate(prompt)

            # Record Success
            CIRCUIT_BREAKER.record_success(provider.get_name())
            return response

        except Exception as e:
            # Record Failure
            CIRCUIT_BREAKER.record_failure(provider.get_name())
            last_exception = e

    # If we get here, all failed
    raise AIProviderError(f"Generation failed: {str(last_exception)}")
