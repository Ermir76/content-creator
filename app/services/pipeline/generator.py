"""
GENERATOR.PY - Creates the initial draft (v1) from idea + config.

Single responsibility: Generate one content draft using config weights.
Does NOT load config - receives it from orchestrate.py.
"""

from typing import Dict, Any
from app.core.policy import build_prompt_instructions
from app.services.model_router import ModelRouter
from app.models.provider import ProviderResponse


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

    # Routing & Resilience Logic
    # Get Primary + Fallback providers from Router (with overrides)
    providers = ModelRouter.select_model(platform, overrides=config)

    # Execute with resilience (Handles loops, retries, and circuit breaker)
    from app.utils.resilience import generate_with_resilience

    return await generate_with_resilience(providers, prompt)
