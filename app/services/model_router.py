"""Model routing logic for selecting AI providers based on platform."""

from typing import Tuple
from app.config.platform_policies import get_platform_policy
from app.services.ai_provider import AIProvider, create_provider


class ModelRouter:
    """Routes platform requests to appropriate AI models."""

    @staticmethod
    def select_model(platform: str) -> Tuple[AIProvider, AIProvider]:
        """
        Select primary and fallback AI models for a given platform.

        Args:
            platform: Platform name (e.g., 'linkedin', 'twitter')

        Returns:
            Tuple of (primary_provider, fallback_provider)

        Raises:
            ValueError: If provider creation fails
        """
        # Get platform policy
        policy = get_platform_policy(platform)

        # Create provider instances
        primary_model_name = policy.get("primary_model", "gemini")
        fallback_model_name = policy.get("fallback_model", "gemini")

        primary_provider = create_provider(primary_model_name)
        fallback_provider = create_provider(fallback_model_name)

        return primary_provider, fallback_provider
