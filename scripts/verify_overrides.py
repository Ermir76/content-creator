import asyncio
import sys
import os

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services import content as content_service


async def main():
    print("--- Starting Override Verification ---")

    idea = "A quick announcement about our new features."
    platform = "linkedin"

    # 1. Custom Override: VERY short text
    target_length = 50
    overrides = {platform: {"target_chars": target_length, "tone": "Direct"}}

    print(f"Requesting generation for {platform} with target_chars={target_length}...")

    # Call service directly (mimicking API)
    response = await content_service.generate_content(
        idea=idea, platforms=[platform], platform_policies=overrides
    )

    result = response.results[0]

    if not result.success:
        print(f"FAILED: {result.error}")
        return

    content_len = len(result.content)
    print(f"\nGeneratred Content:\n'{result.content}'")
    print(f"\nLength: {content_len}")

    # Validation
    # Note: AI isn't perfect, so we allow some margin, but it should be much shorter than default (3000 chars)
    if content_len < 200:
        print(f"SUCCESS: Content length {content_len} is within expected short range.")
    else:
        print(
            f"WARNING: Content length {content_len} seems too long for target {target_length}."
        )


if __name__ == "__main__":
    asyncio.run(main())
