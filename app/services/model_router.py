"""Model routing logic for selecting AI providers based on platform."""

from typing import Tuple
from app.core.platform_defaults import get_platform_policy
from app.providers.ai_provider import AIProvider, create_provider
from app.utils.resilience import CIRCUIT_BREAKER


class ModelRouter:
    """Routes platform requests to appropriate AI models."""

    @staticmethod
    def select_model(
        platform: str, overrides: dict = None
    ) -> Tuple[AIProvider, AIProvider]:
        """
        Select primary and fallback AI models for a given platform.

        Args:
            platform: Platform name (e.g., 'linkedin', 'twitter')
            overrides: Optional configuration overrides (user selection)

        Returns:
            Tuple of (primary_provider, fallback_provider)

        Raises:
            ValueError: If provider creation fails
        """
        # Get platform policy
        policy = get_platform_policy(platform)
        primary_name = policy.get("primary_model", "gemini")

        # 1. Check for overrides (User preference)
        # overrides structure might be deep merged config or raw overrides
        # We look for models -> default
        if overrides:
            models_config = overrides.get("models", {})
            if models_config and isinstance(models_config, dict):
                override_default = models_config.get("default")
                if override_default:
                    primary_name = override_default

        # Determine fallback dynamically if not set
        fallback_name = policy.get("fallback_model")
        if not fallback_name:
            # Simple toggle fallback
            fallback_name = "openai" if primary_name == "gemini" else "gemini"

        # Circuit Breaker Check
        if not CIRCUIT_BREAKER.is_available(primary_name):
            if CIRCUIT_BREAKER.is_available(fallback_name):
                # Swap: Fallback becomes primary
                return create_provider(fallback_name), create_provider(primary_name)
            else:
                # Both down? Try primary anyway or raise error?
                # For now, return primary and let it fail (to trigger retry/breaker open again)
                pass

        return create_provider(primary_name), create_provider(fallback_name)
