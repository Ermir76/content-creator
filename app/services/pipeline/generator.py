"""
GENERATOR.PY - Creates the initial draft (v1) from idea + config.

Single responsibility: Generate one content draft using config weights.
Does NOT load config - receives it from orchestrate.py.
"""

from typing import Dict, Any
from app.providers.ai_provider import create_provider
from app.core.policy import build_prompt_instructions


def generate(user_input: str, platform: str, config: Dict[str, Any]) -> str:
    """
    Generate initial draft (v1) from idea and config.

    Args:
        user_input: Content/topic/brief from user
        platform: Target platform (linkedin, twitter, etc.)
        config: Configuration dict (loaded by orchestrate.py)

    Returns:
        The generated content (v1)
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

    # Create provider and generate
    provider = create_provider("openai")
    return provider.generate(prompt)
