"""
Test file for improver.py - shows the prompt without calling AI.
"""

import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.policy import load_config, build_prompt_instructions
from app.services.pipeline.improver import improve


def test_improver_prompt():
    """Show what prompt would be sent to the AI."""

    # Load config (this is what orchestrate.py would do)
    config = load_config()

    # Sample v1 draft (from generator)
    v1 = """I used to think cleverness was the goal.

I spent 3 days writing a complex algorithm, only to realize a simple for-loop was faster.

Complicated code breaks. Simple code ships.

Does anyone else struggle to keep it simple?

#Coding #SoftwareEngineering"""

    # Sample v2 draft (from critic - slightly improved)
    v2 = """Cleverness is overrated.

Last week I spent 3 days on a "smart" algorithm. A simple for-loop was faster.

The lesson?
- Complex code breaks
- Simple code ships
- Ego slows you down

What's the most over-engineered thing you've built?

#Programming #Tech"""

    platform = "linkedin"

    # Build style instructions (what improver.py does internally)
    style_instructions = build_prompt_instructions(config)

    # Build the full prompt (same as improver.py)
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

    print("=" * 60)
    print("IMPROVER PROMPT TEST")
    print("=" * 60)
    print()
    print("V1 DRAFT (from generator):")
    print(v1)
    print()
    print("V2 DRAFT (from critic):")
    print(v2)
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


if __name__ == "__main__":
    test_improver_prompt()
