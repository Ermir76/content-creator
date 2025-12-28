"""Output validation for generated content."""

from dataclasses import dataclass
from typing import Optional
from app.config.platform_policies import get_platform_policy


@dataclass
class ValidationResult:
    """Result of content validation."""
    passed: bool
    reason: Optional[str] = None
    char_count: Optional[int] = None


class OutputValidator:
    """Validates generated content against platform requirements."""

    @staticmethod
    def validate(content: str, platform: str) -> ValidationResult:
        """
        Validate generated content against platform specifications.

        Checks:
        1. Character count (hard requirement)
        2. Basic format validation (hashtags, structure)
        3. Content quality (not empty, not error messages)

        Args:
            content: Generated content text
            platform: Target platform name

        Returns:
            ValidationResult with pass/fail status and reason
        """
        # Get platform policy
        policy = get_platform_policy(platform)
        char_limit = policy.get("char_limit", 2000)

        # Count characters
        char_count = len(content)

        # Check 1: Empty content
        if not content or not content.strip():
            return ValidationResult(
                passed=False,
                reason="Content is empty",
                char_count=0
            )

        # Check 2: Error messages in content (from AI failures)
        error_indicators = [
            "error generating",
            "failed to generate",
            "could not generate",
            "unable to create"
        ]
        content_lower = content.lower()
        if any(indicator in content_lower for indicator in error_indicators):
            return ValidationResult(
                passed=False,
                reason="Content contains error message",
                char_count=char_count
            )

        # Check 3: Character limit
        if char_count > char_limit:
            return ValidationResult(
                passed=False,
                reason=f"Content exceeds character limit ({char_count}/{char_limit})",
                char_count=char_count
            )

        # Check 4: Minimum content length (at least 10 chars for any platform)
        if char_count < 10:
            return ValidationResult(
                passed=False,
                reason="Content too short (less than 10 characters)",
                char_count=char_count
            )

        # Check 5: Platform-specific validation
        platform_validation = OutputValidator._validate_platform_specific(content, platform, policy)
        if not platform_validation.passed:
            return platform_validation

        # All checks passed
        return ValidationResult(
            passed=True,
            reason=None,
            char_count=char_count
        )

    @staticmethod
    def _validate_platform_specific(content: str, platform: str, policy: dict) -> ValidationResult:
        """
        Perform platform-specific validation.

        Args:
            content: Content text
            platform: Platform name
            policy: Platform policy dict

        Returns:
            ValidationResult
        """
        char_count = len(content)

        # Twitter-specific: Should be concise
        if platform.lower() == "twitter":
            # Check for hashtags (1-2 recommended)
            hashtag_count = content.count('#')
            if hashtag_count > 3:
                return ValidationResult(
                    passed=False,
                    reason="Too many hashtags for Twitter (max 2 recommended)",
                    char_count=char_count
                )

        # Instagram-specific: Should have hashtags
        elif platform.lower() == "instagram":
            hashtag_count = content.count('#')
            if hashtag_count < 3:
                return ValidationResult(
                    passed=False,
                    reason="Instagram posts should include hashtags (10-15 recommended)",
                    char_count=char_count
                )

        # LinkedIn-specific: Professional tone check
        elif platform.lower() == "linkedin":
            # Check for excessive emojis (unprofessional)
            emoji_indicators = ['😀', '😂', '🔥', '💯', '✨', '🎉', '😍']
            emoji_count = sum(content.count(emoji) for emoji in emoji_indicators)
            if emoji_count > 3:
                return ValidationResult(
                    passed=False,
                    reason="Too many emojis for LinkedIn professional tone",
                    char_count=char_count
                )

        # All platform-specific checks passed
        return ValidationResult(passed=True, char_count=char_count)
