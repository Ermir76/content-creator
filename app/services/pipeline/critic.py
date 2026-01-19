"""
CRITIC.PY - Takes v1 + config, challenges it, creates v2.

Single responsibility: Critique the initial draft and create an improved version.
Does NOT load config - receives it from orchestrate.py.
"""

from typing import Dict, Any
from app.core.policy import build_prompt_instructions
from app.providers.ai_provider import create_provider, resolve_model
from app.utils.resilience import generate_with_resilience
from app.models.provider import ProviderResponse


def _get_pipeline_model(config: Dict[str, Any], stage: str) -> str:
    """Get user's model choice for a pipeline stage, with fallback to default."""
    models = config.get("models", {})
    pipeline = models.get("pipeline", {})
    stage_model = pipeline.get(stage)
    if stage_model:
        return stage_model
    return models.get("default", "gemini")


async def critique(v1: str, platform: str, config: Dict[str, Any]) -> ProviderResponse:
    """
    Critique v1 and create improved v2.

    Args:
        v1: The initial draft from generator
        platform: Target platform (linkedin, twitter, etc.)
        config: Configuration dict (loaded by orchestrate.py)

    Returns:
        ProviderResponse: The improved draft (v2) and metrics
    """
    style_instructions = build_prompt_instructions(config)

    prompt = f"""You are a Critical Reviewer for {platform}.

CURRENT DRAFT:
{v1}

EVALUATION CRITERIA:
{style_instructions}

Evaluate the draft against these criteria. If there are weaknesses, rewrite to fix them. If the draft is already strong, return it unchanged.

Output ONLY the final post. No commentary."""

    # Get user's model choice for critic stage
    model_id = _get_pipeline_model(config, "critic")
    provider_name, specific_model = resolve_model(model_id)

    # Set up fallback provider
    fallback_name = "openai" if provider_name == "gemini" else "gemini"

    primary = create_provider(provider_name)
    fallback = create_provider(fallback_name)
    providers = (primary, fallback)

    return await generate_with_resilience(providers, prompt, specific_model)
