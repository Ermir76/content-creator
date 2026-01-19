"""
IMPROVER.PY - Takes v1 + v2 + config, synthesizes v3.

Single responsibility: Combine the best of v1 and v2 into a final improved version.
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


async def improve(
    v1: str, v2: str, platform: str, config: Dict[str, Any]
) -> ProviderResponse:
    """
    Synthesize v1 and v2 into improved v3.

    Args:
        v1: The initial draft from generator
        v2: The revised draft from critic
        platform: Target platform (linkedin, twitter, etc.)
        config: Configuration dict (loaded by orchestrate.py)

    Returns:
        ProviderResponse: The synthesized draft (v3) and metrics
    """
    style_instructions = build_prompt_instructions(config)

    prompt = f"""You are a Content Synthesizer for {platform}.

DRAFT A:
{v1}

DRAFT B:
{v2}

STYLE REQUIREMENTS:
{style_instructions}

You have two versions of the same content. Create the best possible final version by:
- Taking what works from each
- Removing what doesn't
- Matching the criteria exactly

If one version is clearly better, use it. Don't blend for the sake of blending.

Output ONLY the final post. No commentary."""

    # Get user's model choice for improver stage
    model_id = _get_pipeline_model(config, "improver")
    provider_name, specific_model = resolve_model(model_id)

    # Set up fallback provider
    fallback_name = "openai" if provider_name == "gemini" else "gemini"

    primary = create_provider(provider_name)
    fallback = create_provider(fallback_name)
    providers = (primary, fallback)

    return await generate_with_resilience(providers, prompt, specific_model)
