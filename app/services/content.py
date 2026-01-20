"""
Main content generation orchestration service.

This module coordinates content generation using the new pipeline.
"""

import asyncio
from typing import Optional, Dict, Any
from app.models.response_models import GenerationResponse, PlatformResult, Draft
from app.services.orchestrate import run_pipeline


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
    UNKNOWN = "UNKNOWN"


def classify_error(error: Exception) -> str:
    """Classify an error into a standard error code."""
    error_str = str(error).lower()

    if any(kw in error_str for kw in ["rate limit", "429", "quota"]):
        return ErrorCode.RATE_LIMIT
    if any(kw in error_str for kw in ["timeout", "timed out"]):
        return ErrorCode.TIMEOUT
    if any(kw in error_str for kw in ["network", "connection", "503", "502"]):
        return ErrorCode.NETWORK_ERROR
    if any(kw in error_str for kw in ["api key", "401", "403", "unauthorized"]):
        return ErrorCode.INVALID_API_KEY
    if any(kw in error_str for kw in ["500", "internal server error"]):
        return ErrorCode.PROVIDER_ERROR

    return ErrorCode.UNKNOWN


async def generate_for_platform(
    idea: str, platform: str, overrides: Optional[Dict[str, Any]] = None
) -> PlatformResult:
    """
    Generate content for a single platform using the new pipeline.

    Args:
        idea: Content idea/prompt
        platform: Target platform (e.g., 'linkedin', 'x')

    Returns:
        PlatformResult with success/failure status and content
    """
    try:
        pipeline_result = await run_pipeline(
            user_input=idea, platform=platform, overrides=overrides
        )

        # Get winning version from judge ranking
        winner_label = (
            pipeline_result.judge_result.ranking[0]
            if pipeline_result.judge_result.ranking
            else "A"
        )
        versions = {
            "v1": pipeline_result.v1,
            "v2": pipeline_result.v2,
            "v3": pipeline_result.v3,
        }
        winner_version = pipeline_result.shuffle_map.get(winner_label, "v1")
        content = versions.get(winner_version, pipeline_result.v1)

        # Format judge results with mapping
        judge_output_lines = []
        judge_output_lines.append("SCORES:")
        for label in ["A", "B", "C"]:
            score = pipeline_result.judge_result.scores.get(label, 0)
            version = pipeline_result.shuffle_map.get(label, "unknown")
            judge_output_lines.append(f"{label}: {version} - Score: {score}")

        judge_output_lines.append(f"\nWINNER: {winner_label} ({winner_version})")
        judge_content = "\n".join(judge_output_lines)

        return PlatformResult(
            platform=platform,
            success=True,
            content=content,
            model_used="Pipeline (Generator + Critic + Improver + Blind Judge)",
            error=None,
            error_code=None,
            char_count=len(content),
            drafts=[
                Draft(
                    step="Generator (v1)",
                    content=pipeline_result.v1,
                    model=pipeline_result.v1_model,
                ),
                Draft(
                    step="Critic (v2)",
                    content=pipeline_result.v2,
                    model=pipeline_result.v2_model,
                ),
                Draft(
                    step="Improver (v3)",
                    content=pipeline_result.v3,
                    model=pipeline_result.v3_model,
                ),
                Draft(
                    step="Judge",
                    content=judge_content,
                    model=pipeline_result.judge_result.model_name,
                ),
            ],
        )

    except Exception as e:
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


async def generate_content(
    idea: str,
    platforms: list[str],
    platform_policies: Optional[Dict[str, Any]] = None,
) -> GenerationResponse:
    """
    Generate content for multiple platforms (in parallel).

    Args:
        idea: Content idea/prompt
        platforms: List of platform names

    Returns:
        GenerationResponse with all results
    """
    # Run all platforms in parallel
    tasks = []
    for platform in platforms:
        # Extract override for this specific platform if it exists
        overrides = (platform_policies or {}).get(platform)
        tasks.append(
            generate_for_platform(idea=idea, platform=platform, overrides=overrides)
        )
    results = await asyncio.gather(*tasks)

    success_count = sum(1 for r in results if r.success)
    failure_count = len(results) - success_count

    return GenerationResponse(
        results=results,
        success_count=success_count,
        failure_count=failure_count,
        total_platforms=len(platforms),
    )
