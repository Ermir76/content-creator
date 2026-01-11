"""
CRITIC.PY - Takes v1 + config, challenges it, creates v2.

Single responsibility: Critique the initial draft and create an improved version.
Does NOT load config - receives it from orchestrate.py.
"""

from typing import Dict, Any
from app.core.policy import build_prompt_instructions
from app.services.model_router import ModelRouter
from app.utils.resilience import generate_with_resilience
from app.models.provider import ProviderResponse


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
    # Build style instructions from config
    style_instructions = build_prompt_instructions(config)

    # Build the critic prompt
    prompt = f"""You are a Critical Reviewer for {platform}.

CURRENT DRAFT:
{v1}

EVALUATION CRITERIA:
{style_instructions}

Evaluate the draft against these criteria. If there are weaknesses, rewrite to fix them. If the draft is already strong, return it unchanged.

Output ONLY the final post. No commentary."""

    # Resilience & Routing
    providers = ModelRouter.select_model(platform)
    return await generate_with_resilience(providers, prompt)
