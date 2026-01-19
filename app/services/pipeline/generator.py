"""
GENERATOR.PY - Creates the initial draft (v1) from idea + config.

Single responsibility: Generate one content draft using config weights.
Does NOT load config - receives it from orchestrate.py.
"""

from typing import Dict, Any
from app.core.policy import build_prompt_instructions
from app.providers.ai_provider import create_provider, resolve_model
from app.models.provider import ProviderResponse


def _get_pipeline_model(config: Dict[str, Any], stage: str) -> str:
    """Get user's model choice for a pipeline stage, with fallback to default."""
    models = config.get("models", {})
    pipeline = models.get("pipeline", {})
    
    # User's choice for this stage
    stage_model = pipeline.get(stage)
    if stage_model:
        return stage_model
    
    # Fallback to default model
    return models.get("default", "gemini")


async def generate(
    user_input: str, platform: str, config: Dict[str, Any]
) -> ProviderResponse:
    """
    Generate initial draft (v1) from idea and config.

    Args:
        user_input: Content/topic/brief from user
        platform: Target platform (linkedin, twitter, etc.)
        config: Configuration dict (loaded by orchestrate.py)

    Returns:
        ProviderResponse: The generated content and metrics
    """
    # Build prompt instructions from config weights
    style_instructions = build_prompt_instructions(config)

    # Build the full prompt
    prompt = f"""You are a content creator for {platform}.

INPUT:
{user_input}

STYLE REQUIREMENTS:
{style_instructions}

Write ONLY the post content. No meta-commentary, no explanations, no "Here's the post" preamble.
Just the actual post text, ready to publish.

Generate the post now:"""

    # Get user's model choice for generator stage
    model_id = _get_pipeline_model(config, "generator")
    provider_name, specific_model = resolve_model(model_id)

    # Set up fallback provider
    fallback_name = "openai" if provider_name == "gemini" else "gemini"

    primary = create_provider(provider_name)
    fallback = create_provider(fallback_name)
    providers = (primary, fallback)

    # Execute with resilience
    from app.utils.resilience import generate_with_resilience

    return await generate_with_resilience(providers, prompt, specific_model)
