"""
Test file for critic.py - shows the prompt without calling AI.
"""

import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.policy import load_config, build_prompt_instructions
from app.services.pipeline.critic import critique


def test_critic_prompt():
    """Show what prompt would be sent to the AI."""

    # Load config (this is what orchestrate.py would do)
    config = load_config()

    # Sample v1 draft (what generator would produce)
    v1 = """I used to think cleverness was the goal.

I spent 3 days writing a complex algorithm, only to realize a simple for-loop was faster.

Complicated code breaks. Simple code ships.

Does anyone else struggle to keep it simple?

#Coding #SoftwareEngineering"""

    platform = "linkedin"

    # Build style instructions (what critic.py does internally)
    style_instructions = build_prompt_instructions(config)

    # Build the full prompt (same as critic.py)
    prompt = f"""You are a Critical Reviewer for {platform}.

CURRENT DRAFT:
{v1}

EVALUATION CRITERIA:
{style_instructions}

Evaluate the draft against these criteria. If there are weaknesses, rewrite to fix them. If the draft is already strong, return it unchanged.

Output ONLY the final post. No commentary."""

    print("=" * 60)
    print("CRITIC PROMPT TEST")
    print("=" * 60)
    print()
    print("V1 DRAFT:")
    print(v1)
    print()
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
            "personality": {"human": 0.8, "vulnerable": 0.5},
            "authenticity": {"honest": 0.9},
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

    v1 = """I used to think cleverness was the goal.

I spent 3 days writing a complex algorithm, only to realize a simple for-loop was faster.

Complicated code breaks. Simple code ships.

Does anyone else struggle to keep it simple?

#Coding #SoftwareEngineering"""

    platform = "linkedin"

    style_instructions = build_prompt_instructions(sample_config)

    prompt = f"""You are a Critical Reviewer for {platform}.

CURRENT DRAFT:
{v1}

EVALUATION CRITERIA:
{style_instructions}

Evaluate the draft against these criteria. If there are weaknesses, rewrite to fix them. If the draft is already strong, return it unchanged.

Output ONLY the final post. No commentary."""

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
    test_critic_prompt()
    test_with_sample_config()
