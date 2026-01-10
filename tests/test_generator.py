"""
Test file for generator.py - shows the prompt without calling AI.
"""

import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.policy import load_config, build_prompt_instructions
from app.services.pipeline.generator import generate


def test_generator_prompt():
    """Show what prompt would be sent to the AI."""

    # Load config (this is what orchestrate.py would do)
    config = load_config()

    # Sample inputs
    user_input = "I just learned that simple code beats clever code every time"
    platform = "linkedin"

    # Build style instructions (what generator.py does internally)
    style_instructions = build_prompt_instructions(config)

    # Build the full prompt (same as generator.py)
    prompt = f"""You are a content creator for {platform}.

INPUT:
{user_input}

STYLE REQUIREMENTS:
{style_instructions}

Write ONLY the post content. No meta-commentary, no explanations, no "Here's the post" preamble.
Just the actual post text, ready to publish.

Generate the post now:"""

    print("=" * 60)
    print("GENERATOR PROMPT TEST")
    print("=" * 60)
    print()
    print("USER INPUT:", user_input)
    print("PLATFORM:", platform)
    print()
    print("-" * 60)
    print("FULL PROMPT THAT WOULD BE SENT TO AI:")
    print("-" * 60)
    print()
    print(prompt)
    print()
    print("=" * 60)


def test_with_sample_config():
    """Test with sample config that has actual weights set."""

    sample_config = {
        "constraints": {
            "char_limit": 700,
            "target_chars": 500,
            "hashtags": 3,
        },
        "author_persona": {
            "perspective": "first-person",
            "personality": {
                "human": 0.8,
                "vulnerable": 0.5,
            },
            "authenticity": {
                "honest": 0.9,
            },
            "corporate": False,
        },
        "writing_style": {
            "style": {"direct": 0.7},
            "mood": {"reflective": 0.6},
            "approach": {"storytelling": 0.7},
            "humor": {"enabled": False},
            "short_paragraphs": True,
            "emojis": "none",
        },
        "format": {
            "hook": {"confession": 0.8},
            "body": {"type": "honest-experience", "texture": {"tension": 0.5}},
            "ending": {"one_question": 0.7},
        },
    }

    user_input = "I just learned that simple code beats clever code every time"
    platform = "linkedin"

    style_instructions = build_prompt_instructions(sample_config)

    prompt = f"""You are a content creator for {platform}.

INPUT:
{user_input}

STYLE REQUIREMENTS:
{style_instructions}

Write ONLY the post content. No meta-commentary, no explanations, no "Here's the post" preamble.
Just the actual post text, ready to publish.

Generate the post now:"""

    print()
    print("=" * 60)
    print("SAMPLE CONFIG PROMPT TEST")
    print("=" * 60)
    print()
    print("-" * 60)
    print("FULL PROMPT WITH SAMPLE WEIGHTS:")
    print("-" * 60)
    print()
    print(prompt)
    print()
    print("=" * 60)


if __name__ == "__main__":
    test_generator_prompt()
    test_with_sample_config()
