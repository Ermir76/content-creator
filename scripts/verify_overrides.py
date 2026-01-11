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
    overrides = {
        "linkedin": {
            # Test Deep Schema (Phase 6)
            "constraints": {"target_chars": 50},
            "author_persona": {
                "perspective": "third-person",
                "personality": {"human": 1.0, "professional": 0.8},
            },
            "writing_style": {"mood": {"energetic": 1.0}, "emojis": "heavy"},
            "models": {"generator": "gemini-3-flash-preview", "critic": "gpt-5-mini"},
        }
    }

    print(f"Requesting generation for {platform} with target_chars={target_length}...")

    # Call service directly (mimicking API)
    try:
        results = await content_service.generate_content(
            idea_prompt="A startup founder struggling with impostor syndrome during a product launch.",
            platforms=[platform],
            platform_policies=overrides,
        )

        for res in results:
            content_len = len(res.content) if res.content else 0
            print(f"\n--- Result for {res.platform} ---")
            print(f"Model Used: {res.model_used}")
            print(f"Generated Content:\n{res.content!r}")
            print(f"Length: {content_len}")

            if res.content and content_len > target_length + 200:
                print(
                    f"WARNING: Content length {content_len} seems too long for target {target_length}."
                )
            else:
                print("SUCCESS: Content length is within reasonable constraints.")

    except Exception as e:
        print(f"FAILED with exception: {str(e)}")


if __name__ == "__main__":
    asyncio.run(main())
