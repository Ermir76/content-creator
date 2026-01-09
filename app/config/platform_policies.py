"""Platform-specific content generation policies."""

from typing import Dict, Any


PLATFORM_POLICIES: Dict[str, Dict[str, Any]] = {
    "linkedin": {
        "char_limit": 3000,
        "target_chars": 700,
        "tone": "direct, human, reflective",
        "voice_profile": "first-person, direct, honest, no-corporate-tone",
        "features": (
            "Short paragraphs (1–2 lines), no links, NO emojis as bullet points (use dashes), "
            "no emojis in first line, include 2-3 broad hashtags at the very end (e.g., #Python #Coding)"
        ),
        "format": (
            "Punchy hook (focus on pain/insight/result, NO technical jargon, < 140 chars), "
            "honest experience (show struggle, not just success), leave room for insight, "
            "end with exactly ONE open question (NO filler phrases like 'Comments welcome')"
        ),
        "examples": [
            """
            I used to think cleverness was the goal.

            I spent 3 days writing a complex "performance" algorithm, only to realize later that a simple for-loop was actually faster for our data size.

            It was humbling. I was over-engineering because it felt like "real work."
            But real work is shipping something that works.

            - Complicated code breaks.
            - Simple code ships.

            I still catch myself trying to be too clever.

            Does anyone else struggle to keep it simple?

            #SoftwareEngineering #Coding
            """,
            """
            The hardest part of coding isn't the code.

            It's knowing WHAT to build.

            We shipped a fully functional feature last month. Perfect test coverage. Clean architecture. 
            
            Zero users.

            It was a painful lesson. We built what we *thought* they needed, not what they actually asked for.

            Now, I try to talk to users before I open VS Code. But it's hard to slow down.

            How do you validate your ideas before building?

            #ProductManagement #Startups
            """,
            """
            Hook: I just spent 15 minutes trimming "concise" code.

            Today, Claude Code decided that a 10-line request deserved a 100-line response—complete with repeated blocks and a 3-paragraph essay I didn't ask for. It was a frustrating reminder: AI that talks too much isn’t a feature; it’s a productivity tax.

            The Lesson: We expect AI to speed up the loop, but without strict guardrails, it just adds "editing" to our Trello boards.

            What I changed to regain control:

            - Hard Constraints: I stopped saying "be brief" and started saying "Output: Code Only. Max 20 lines."
            - Format Forced: I now specify the exact file structure before it starts typing.

            AI is a reflection of the constraints you set. If your prompt is loose, your output will be noisy.

            How are you handling "AI Yapping" in your workflow?

            #AI #Productivity
            """,
        ],
        "primary_model": "openai",
        "fallback_model": "gemini",
    },
    "twitter": {
        "char_limit": 280,
        "tone": "concise and engaging",
        "features": "Use 1-2 relevant hashtags, make every word count",
        "format": "Hook in first line, deliver value quickly",
        "primary_model": "xai",  # Grok optimized for Twitter/X
        "fallback_model": "openai",
    },
    "reddit": {
        "char_limit": 3000,
        "tone": "conversational and authentic",
        "features": "Be genuine, avoid corporate speak, provide real value to the community",
        "format": "Engaging title mindset, detailed explanation, encourage discussion",
        "primary_model": "anthropic",  # Claude for natural conversation
        "fallback_model": "gemini",
    },
    "instagram": {
        "char_limit": 2200,
        "tone": "visual and inspiring",
        "features": "Use emojis strategically, include 10-15 relevant hashtags at the end, line breaks for readability",
        "format": "Attention-grabbing opening, storytelling, call-to-action, hashtags at the end",
        "primary_model": "gemini",
        "fallback_model": "openai",
    },
    "facebook": {
        "char_limit": 3000,
        "tone": "casual-professional and relatable",
        "features": "Conversational yet polished, emojis acceptable, questions to encourage engagement",
        "format": "Personal hook, value delivery, call-to-action or question",
        "primary_model": "openai",
        "fallback_model": "gemini",
    },
    "tiktok": {
        "char_limit": 2200,
        "tone": "energetic and trendy",
        "features": "Short, punchy, emoji-heavy, trending hashtags, call-to-action",
        "format": "Immediate hook, quick value, strong CTA",
        "primary_model": "xai",  # Grok for punchy content
        "fallback_model": "openai",
    },
}


# Default policy for unsupported platforms
DEFAULT_POLICY = {
    "char_limit": 2000,
    "tone": "engaging and authentic",
    "features": "Clear and valuable content",
    "format": "Hook, value, call-to-action",
    "primary_model": "gemini",
    "fallback_model": "openai",
}


def get_platform_policy(platform: str) -> Dict[str, Any]:
    """
    Get the content generation policy for a specific platform.

    Args:
        platform: Platform name (e.g., 'linkedin', 'twitter')

    Returns:
        Dictionary containing platform-specific policies

    Raises:
        ValueError: If platform is not supported and strict mode is enabled
    """
    platform_lower = platform.lower()

    if platform_lower in PLATFORM_POLICIES:
        return PLATFORM_POLICIES[platform_lower]

    # Return default policy for unknown platforms
    return DEFAULT_POLICY.copy()


def get_supported_platforms() -> list[str]:
    """Return list of supported platform names."""
    return list(PLATFORM_POLICIES.keys())


def is_platform_supported(platform: str) -> bool:
    """Check if a platform is explicitly supported."""
    return platform.lower() in PLATFORM_POLICIES
