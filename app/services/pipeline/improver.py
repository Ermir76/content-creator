"""
IMPROVER.PY - Takes v1 + v2 + config, synthesizes v3.

Single responsibility: Combine the best of v1 and v2 into a final improved version.
Does NOT load config - receives it from orchestrate.py.
"""

from typing import Dict, Any
from app.providers.ai_provider import create_provider
from app.core.policy import build_prompt_instructions


def improve(v1: str, v2: str, platform: str, config: Dict[str, Any]) -> str:
    """
    Synthesize v1 and v2 into improved v3.

    Args:
        v1: The initial draft from generator
        v2: The revised draft from critic
        platform: Target platform (linkedin, twitter, etc.)
        config: Configuration dict (loaded by orchestrate.py)

    Returns:
        The synthesized draft (v3)
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

    # Create provider and generate
    provider = create_provider("openai")
    return provider.generate(prompt)
