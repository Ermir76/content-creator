"""
POLICY_LOADER.PY - Reads config.yaml and converts weights to natural language prompts.
Handles hierarchical merging: Defaults -> Platform -> Overrides -> Hard Limits.
"""

import yaml
from pathlib import Path
from typing import Dict, Any, Optional

from app.core.platform_defaults import get_platform_policy


def weight_to_word(weight: float) -> str:
    """Convert a weight (0.0-1.0) to a descriptive word."""
    if weight <= 0.0:
        return ""  # Skip
    elif weight <= 0.2:
        return "hints of"
    elif weight <= 0.4:
        return "subtly"
    elif weight <= 0.6:
        return "noticeably"
    elif weight <= 0.8:
        return "strongly"
    else:
        return "dominantly"


def build_weighted_list(weights: Dict[str, float]) -> list[str]:
    """Convert a dict of weights to a list of 'word trait' strings."""
    result = []
    for trait, weight in weights.items():
        if isinstance(weight, (int, float)) and weight > 0:
            word = weight_to_word(weight)
            # Clean up trait name: replace underscores with spaces
            trait_clean = trait.replace("_", " ")
            result.append(f"{word} {trait_clean}")
    return result


# Global cache for configuration
_CONFIG_CACHE = {}


def load_config(config_path: Optional[str] = None) -> Dict[str, Any]:
    """Load the YAML config file (Cached)."""
    if config_path is None:
        path_obj = Path(__file__).parent / "config.yaml"
    else:
        path_obj = Path(config_path)

    # Use absolute string path as cache key to prevent duplicates
    try:
        abs_path = str(path_obj.resolve())
    except OSError:
        # Fallback if path is invalid (e.g. strict mock)
        abs_path = str(path_obj)

    if abs_path in _CONFIG_CACHE:
        return _CONFIG_CACHE[abs_path]

    try:
        with open(abs_path, "r", encoding="utf-8") as f:
            config = yaml.safe_load(f)
            _CONFIG_CACHE[abs_path] = config
            return config
    except FileNotFoundError:
        return {"defaults": {}}


def deep_merge(base: Dict, override: Dict) -> Dict:
    """Recursively merge dictionary overrides into base."""
    merged = base.copy()
    for key, value in override.items():
        if isinstance(value, dict) and key in merged and isinstance(merged[key], dict):
            merged[key] = deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged


def _apply_runtime_overrides(config: Dict, overrides: Any) -> Dict:
    """Apply runtime request overrides (clean logic extraction)."""
    if not overrides:
        return config

    # Check if overrides is a Pydantic object (Handle v1 and v2)
    if hasattr(overrides, "model_dump"):
        # Pydantic v2
        overrides_dict = overrides.model_dump(exclude_unset=True)
    elif hasattr(overrides, "dict"):
        # Pydantic v1
        overrides_dict = overrides.dict(exclude_unset=True)
    else:
        overrides_dict = overrides

    # Map overrides to config structure

    # 1. Deep Merge the full overrides object (New System)
    # This allows overriding constraints, author_persona, writing_style, etc.
    config = deep_merge(config, overrides_dict)

    # 2. Legacy Support (Old API)
    # If the user sent top-level 'target_chars', map it to constraints
    if "target_chars" in overrides_dict and overrides_dict["target_chars"]:
        if "constraints" not in config:
            config["constraints"] = {}
        config["constraints"]["target_chars"] = overrides_dict["target_chars"]

    return config


def _enforce_hard_limits(config: Dict, platform: str) -> Dict:
    """Enforce platform hard limits (The Physics)."""
    hard_limits = get_platform_policy(platform)
    char_limit = hard_limits.get("char_limit", 1000)

    constraints = config.get("constraints", {})

    # 1. Cap target_chars
    current_target = constraints.get("target_chars", 500)
    if current_target > char_limit:
        constraints["target_chars"] = char_limit

    # 2. Set strict char limit
    constraints["char_limit"] = char_limit

    # 3. Cap hashtags
    max_tags = hard_limits.get("max_hashtags")
    if max_tags is not None:
        current_tags = constraints.get("hashtags", 0)
        if current_tags > max_tags:
            constraints["hashtags"] = max_tags

    config["constraints"] = constraints
    return config


def get_merged_config(
    platform: str, overrides: Optional[Dict] = None, config_path: Optional[str] = None
) -> Dict[str, Any]:
    """
    Get the final configuration for a specific platform request.
    Hierarchy:
    1. Global Defaults (config.yaml)
    2. Platform Config (config.yaml -> platforms -> [platform])
    3. Request Overrides (runtime)
    4. Hard Limits (platform_defaults.py)
    """
    full_config = load_config(config_path)

    # 1. Start with Global Defaults
    final_config = full_config.get("defaults", {}).copy()

    # 2. Merge Platform Specific Config
    platform_config = full_config.get("platforms", {}).get(platform.lower(), {})
    if platform_config:
        final_config = deep_merge(final_config, platform_config)

    # 3. Apply Runtime Overrides
    final_config = _apply_runtime_overrides(final_config, overrides)

    # 4. Enforce Hard Limits
    final_config = _enforce_hard_limits(final_config, platform)

    return final_config


def build_constraints_prompt(config: Dict) -> str:
    """Build prompt section for constraints."""
    constraints = config.get("constraints", {})
    parts = []

    char_limit = constraints.get("char_limit", 0)
    if char_limit > 0:
        parts.append(f"Maximum {char_limit} characters (Strict Limit)")

    target_chars = constraints.get("target_chars", 0)
    if target_chars > 0:
        parts.append(
            f"STRICT REQUIREMENT: Total length must be very close to {target_chars} characters. Do not exceed significantly"
        )

    hashtags = constraints.get("hashtags", 0)
    if hashtags > 0:
        parts.append(f"Include {hashtags} hashtags")
    elif hashtags == 0:
        parts.append("No hashtags")

    return "CONSTRAINTS: " + ". ".join(parts) + "." if parts else ""


def build_author_persona_prompt(config: Dict) -> str:
    """Build prompt section for author persona."""
    persona = config.get("author_persona", {})
    parts = []

    # Perspective
    perspective = persona.get("perspective", "")
    if perspective:
        parts.append(f"Write in {perspective}")

    # Personality weights
    personality = persona.get("personality", {})
    personality_traits = build_weighted_list(personality)
    if personality_traits:
        parts.append(f"Personality: {', '.join(personality_traits)}")

    # Authenticity weights
    authenticity = persona.get("authenticity", {})
    authenticity_traits = build_weighted_list(authenticity)
    if authenticity_traits:
        parts.append(f"Authenticity: {', '.join(authenticity_traits)}")

    # Corporate
    corporate = persona.get("corporate", False)
    if corporate:
        parts.append("Use brand voice")
    else:
        parts.append("Use human voice, not corporate")

    return "AUTHOR PERSONA: " + ". ".join(parts) + "." if parts else ""


def build_writing_style_prompt(config: Dict) -> str:
    """Build prompt section for writing style."""
    style_config = config.get("writing_style", {})
    parts = []

    # Style weights
    style = style_config.get("style", {})
    style_traits = build_weighted_list(style)
    if style_traits:
        parts.append(f"Style: {', '.join(style_traits)}")

    # Mood weights
    mood = style_config.get("mood", {})
    mood_traits = build_weighted_list(mood)
    if mood_traits:
        parts.append(f"Mood: {', '.join(mood_traits)}")

    # Approach weights
    approach = style_config.get("approach", {})
    approach_traits = build_weighted_list(approach)
    if approach_traits:
        parts.append(f"Approach: {', '.join(approach_traits)}")

    # Humor
    humor = style_config.get("humor", {})
    if humor.get("enabled", False):
        intensity = humor.get("intensity", 0)
        intensity_word = weight_to_word(intensity) if intensity > 0 else "some"
        humor_types = humor.get("types", {})
        humor_traits = build_weighted_list(humor_types)
        if humor_traits:
            parts.append(
                f"Humor: {intensity_word} humor with {', '.join(humor_traits)}"
            )
        else:
            parts.append(f"Include {intensity_word} humor")

    # Short paragraphs
    if style_config.get("short_paragraphs", False):
        parts.append("Use short paragraphs (1-2 lines each)")

    # Emojis
    emojis = style_config.get("emojis", "")
    if emojis and emojis != "none":
        parts.append(f"Emojis: {emojis}")

    return "WRITING STYLE: " + ". ".join(parts) + "." if parts else ""


def build_format_prompt(config: Dict) -> str:
    """Build prompt section for format."""
    format_config = config.get("format", {})
    parts = []

    # Hook weights
    hook = format_config.get("hook", {})
    hook_traits = build_weighted_list(hook)
    if hook_traits:
        parts.append(f"Hook: {', '.join(hook_traits)}")

    # Body
    body = format_config.get("body", {})
    body_type = body.get("type", "")
    if body_type:
        parts.append(f"Body type: {body_type}")

    # Body texture weights
    texture = body.get("texture", {})
    texture_traits = build_weighted_list(texture)
    if texture_traits:
        parts.append(f"Body texture: {', '.join(texture_traits)}")

    # Ending weights
    ending = format_config.get("ending", {})
    ending_traits = build_weighted_list(ending)
    if ending_traits:
        parts.append(f"Ending: {', '.join(ending_traits)}")

    return "FORMAT: " + ". ".join(parts) + "." if parts else ""


def build_prompt_instructions(config: Dict[str, Any]) -> str:
    """
    Build complete prompt instructions from config dict.

    Args:
        config: Configuration dictionary (usually from get_merged_config())

    Returns:
        A single string ready to inject into an AI prompt.
    """
    sections = [
        build_constraints_prompt(config),
        build_author_persona_prompt(config),
        build_writing_style_prompt(config),
        build_format_prompt(config),
    ]

    # Filter out empty sections and join with newlines
    non_empty = [s for s in sections if s]
    return "\n\n".join(non_empty)
