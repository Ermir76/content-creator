"""
PLATFORM_DEFAULTS.PY
The "Physics" of the social networks.
Contains hard limits (max characters) and default models.

These are the SOURCE OF TRUTH for constraints.
"""

from typing import Dict, Any


def get_platform_policy(platform: str) -> Dict[str, Any]:
    """
    Get hard limits for a platform.
    """
    defaults = {
        # LinkedIn
        "linkedin": {
            "char_limit": 3000,
            "primary_model": "gemini",
        },
        # X
        "x": {
            "char_limit": 280,
            "primary_model": "xai",
        },
        # Reddit
        "reddit": {
            "char_limit": 40000,
            "primary_model": "gemini",
        },
        # Instagram
        "instagram": {
            "char_limit": 2200,
            "max_hashtags": 30,  # Instagram Hard Limit
            "primary_model": "openai",
        },
        # Facebook
        "facebook": {
            "char_limit": 63206,
            "primary_model": "gemini",
        },
        # TikTok
        "tiktok": {
            "char_limit": 2200,
            "primary_model": "openai",
        },
    }

    return defaults.get(
        platform.lower(),
        {
            "char_limit": 1000,  # Fallback
        },
    )


def merge_policies(base: Dict, override: Dict) -> Dict:
    """Helper to merge two policy dicts."""
    return {**base, **override}
