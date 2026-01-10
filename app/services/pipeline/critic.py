"""
CRITIC.PY - Takes v1 + config, challenges it, creates v2.

Single responsibility: Critique the initial draft and create an improved version.
Does NOT load config - receives it from orchestrate.py.
"""

from typing import Dict, Any
from app.providers.ai_provider import create_provider
from app.core.policy import build_prompt_instructions


def critique(v1: str, platform: str, config: Dict[str, Any]) -> str:
    """
    Critique v1 and create improved v2.

    Args:
        v1: The initial draft from generator
        platform: Target platform (linkedin, twitter, etc.)
        config: Configuration dict (loaded by orchestrate.py)

    Returns:
        The improved draft (v2)
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

    # Create provider and generate
    provider = create_provider("gemini")
    return provider.generate(prompt)
