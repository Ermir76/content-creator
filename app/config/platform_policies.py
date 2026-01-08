"""Platform-specific content generation policies."""

from typing import Dict, Any


PLATFORM_POLICIES: Dict[str, Dict[str, Any]] = {
    "linkedin": {
        "char_limit": 3000,
        "tone": "professional and thought-provoking",
        "features": "Use line breaks for readability, include relevant hashtags (3-5), and encourage engagement",
        "format": "Start with a hook, provide value, end with a call-to-action",
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
