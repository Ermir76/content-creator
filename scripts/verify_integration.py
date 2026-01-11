import asyncio
import sys
import os

# Add project root to path so we can import 'app'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Load env vars before importing app modules potentially
from dotenv import load_dotenv

load_dotenv()

from app.services.content import generate_for_platform


async def main():
    print(">>> Starting Backend Integration Verification...")
    print("---------------------------------------------")

    idea = "Explain why AI Agents are the future of software development."
    platform = "linkedin"

    print(f"Prompt: {idea}")
    print(f"Platform: {platform}")
    print("Generating... (This invokes Generator -> Critic -> Improver -> Judge)")

    try:
        result = await generate_for_platform(idea, platform)

        if result.success:
            print("\nSUCCESS!")
            print(f"Model Used: {result.model_used}")
            print(f"Character Count: {result.char_count}")
            print("\n--- Final Content ---\n")
            print(result.content)
            print("\n---------------------\n")

            print("Draft Details:")
            for draft in result.drafts:
                # draft is a Pydantic model (Draft), not a dict
                model = getattr(draft, "model", "unknown")
                step = getattr(draft, "step", "Unknown Step")
                content_len = len(getattr(draft, "content", "") or "")
                print(f"  - {step}: {model} (Length: {content_len})")

        else:
            print("\nFAILURE")
            print(f"Error Code: {result.error_code}")
            print(f"Error Message: {result.error}")

    except Exception as e:
        print(f"\nCRITICAL EXCEPTION: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
