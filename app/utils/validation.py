"""Output validation for generated content."""

from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class ValidationResult:
    """Result of content validation."""

    passed: bool
    reason: Optional[str] = None
    char_count: Optional[int] = None


class OutputValidator:
    """Validates generated content against config requirements."""

    @staticmethod
    def validate(
        content: str, platform: str, config: Dict[str, Any] = None
    ) -> ValidationResult:
        """
        Validate generated content.

        Checks:
        1. Not empty
        2. Not an error message
        3. Within character limit (from config)
        4. Minimum length

        Args:
            content: Generated content text
            platform: Target platform name
            config: Config dict (from config.yaml)

        Returns:
            ValidationResult with pass/fail status and reason
        """
        # Get char_limit from config or use default
        char_limit = 3000  # default
        if config and "constraints" in config:
            char_limit = config["constraints"].get("char_limit", 3000)

        char_count = len(content)

        # Check 1: Empty content
        if not content or not content.strip():
            return ValidationResult(
                passed=False, reason="Content is empty", char_count=0
            )

        # Check 2: Error messages in content (from AI failures)
        error_indicators = [
            "error generating",
            "failed to generate",
            "could not generate",
            "unable to create",
        ]
        content_lower = content.lower()
        if any(indicator in content_lower for indicator in error_indicators):
            return ValidationResult(
                passed=False,
                reason="Content contains error message",
                char_count=char_count,
            )

        # Check 3: Character limit
        if char_count > char_limit:
            return ValidationResult(
                passed=False,
                reason=f"Content exceeds character limit ({char_count}/{char_limit})",
                char_count=char_count,
            )

        # Check 4: Minimum content length
        if char_count < 10:
            return ValidationResult(
                passed=False,
                reason="Content too short (less than 10 characters)",
                char_count=char_count,
            )

        # All checks passed
        return ValidationResult(passed=True, reason=None, char_count=char_count)
