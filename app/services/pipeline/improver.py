"""
IMPROVER.PY - Takes v1 + v2 + config, synthesizes v3.

Single responsibility: Combine the best of v1 and v2 into a final improved version.
Does NOT load config - receives it from orchestrate.py.
"""

from typing import Dict, Any
from app.core.policy import build_prompt_instructions
from app.services.model_router import ModelRouter
from app.utils.resilience import generate_with_resilience
from app.models.provider import ProviderResponse


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
    # Build style instructions from config
    style_instructions = build_prompt_instructions(config)

    # Build the improver prompt
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

    # Resilience & Routing
    providers = ModelRouter.select_model(platform, overrides=config)
    return await generate_with_resilience(providers, prompt)
