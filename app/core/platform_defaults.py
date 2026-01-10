from typing import Dict, Any, List


def get_platform_policy(platform: str) -> Dict[str, Any]:
    """
    Get default policy for a platform.
    """
    defaults = {
        "linkedin": {
            "char_limit": 3000,
            "target_chars": 1500,
            "tone": "professional",
            "features": ["hashtags"],
        },
        "twitter": {
            "char_limit": 280,
            "target_chars": 200,
            "tone": "casual",
            "features": [],
        },
        "reddit": {
            "char_limit": 4000,
            "target_chars": 1000,
            "tone": "direct",
            "features": [],
        },
    }
    return defaults.get(platform.lower(), {})


def merge_policies(base: Dict[str, Any], override: Dict[str, Any]) -> Dict[str, Any]:
    """
    Merge base policy with overrides.
    """
    merged = base.copy()
    merged.update(override or {})
    return merged
