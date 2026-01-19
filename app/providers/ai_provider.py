import time
import os
import asyncio
import logging
from abc import ABC, abstractmethod
from typing import Tuple, Optional

from dotenv import load_dotenv

from app.models.provider import ProviderResponse, ProviderMetrics

# Configure logging
logger = logging.getLogger(__name__)

# Optional Third-Party Imports
try:
    import google.generativeai as genai
except ImportError:
    genai = None

try:
    from openai import AsyncOpenAI, OpenAI
except ImportError:
    AsyncOpenAI = None
    OpenAI = None

try:
    from anthropic import AsyncAnthropic
except ImportError:
    AsyncAnthropic = None

load_dotenv()


class AIProvider(ABC):
    """
    Abstract base class for AI providers using the Template Method pattern.
    Handles common logic (logging, timing, execution safety).
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return the provider name (e.g., 'openai')."""
        pass

    @property
    @abstractmethod
    def default_model(self) -> str:
        """Return the default model ID."""
        pass

    @abstractmethod
    async def _generate_raw(self, prompt: str, model: str) -> Tuple[str, int, int]:
        """
        Internal implementation of the generation call.
        Args:
            prompt: User prompt
            model: Model ID to use
        Returns:
            Tuple(content_str, input_tokens, output_tokens)
        """
        pass

    async def generate(self, prompt: str, model: Optional[str] = None) -> ProviderResponse:
        """
        Public generation method.
        Handles logging, timing, timeouts, and error handling.
        """
        target_model = model or self.default_model
        logger.info(
            f"{self.provider_name.title()}: Generating content with model {target_model}"
        )

        start_time = time.time()
        try:
            # Global timeout for all providers for reliability
            content, in_tokens, out_tokens = await asyncio.wait_for(
                self._generate_raw(prompt, target_model), timeout=120.0
            )

        except asyncio.TimeoutError:
            logger.error(f"{self.provider_name.title()} request timed out")
            raise TimeoutError(
                f"{self.provider_name.title()} API request timed out after 60 seconds"
            )
        except Exception as e:
            logger.error(f"{self.provider_name.title()} request failed: {e}")
            raise

        latency = (time.time() - start_time) * 1000

        return ProviderResponse(
            content=content.strip(),
            metrics=ProviderMetrics(
                input_tokens=in_tokens,
                output_tokens=out_tokens,
                latency_ms=latency,
            ),
            provider_name=self.provider_name,
            model_name=target_model,
        )

    def get_name(self) -> str:
        return self.provider_name


class GeminiProvider(AIProvider):
    """Google Gemini AI provider."""

    def __init__(self):
        if genai is None:
            raise ImportError(
                "google-generativeai package not installed. Run: pip install google-generativeai"
            )

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")

        genai.configure(api_key=api_key)  # type: ignore
        self.default_model_inst = genai.GenerativeModel("gemini-3-flash-preview")  # type: ignore

    @property
    def provider_name(self) -> str:
        return "gemini"

    @property
    def default_model(self) -> str:
        return "gemini-3-flash-preview"

    async def _generate_raw(self, prompt: str, model: str) -> Tuple[str, int, int]:
        active_model = self.default_model_inst
        if model and model != self.default_model:
            active_model = genai.GenerativeModel(model)  # type: ignore

        response = await active_model.generate_content_async(prompt)

        # Extract metrics safely
        input_tokens = 0
        output_tokens = 0
        if hasattr(response, "usage_metadata"):
            input_tokens = response.usage_metadata.prompt_token_count
            output_tokens = response.usage_metadata.candidates_token_count

        return response.text, input_tokens, output_tokens


class OpenAIProvider(AIProvider):
    """OpenAI (ChatGPT) provider."""

    def __init__(self):
        if AsyncOpenAI is None:
            raise ImportError("openai package not installed. Run: pip install openai")

        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            self.client = None
            self._has_key = False
        else:
            self.client = AsyncOpenAI(api_key=api_key)
            self._has_key = True

    @property
    def provider_name(self) -> str:
        return "openai"

    @property
    def default_model(self) -> str:
        return "gpt-5-mini"

    async def _generate_raw(self, prompt: str, model: str) -> Tuple[str, int, int]:
        if not self._has_key or not self.client:
            raise ValueError("OPENAI_API_KEY not configured")

        response = await self.client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
        )

        usage = response.usage
        input_tokens = usage.prompt_tokens if usage else 0
        output_tokens = usage.completion_tokens if usage else 0
        content = response.choices[0].message.content or ""

        return content, input_tokens, output_tokens


class AnthropicProvider(AIProvider):
    """Anthropic (Claude) provider."""

    def __init__(self):
        if AsyncAnthropic is None:
            raise ImportError(
                "anthropic package not installed. Run: pip install anthropic"
            )

        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            self.client = None
            self._has_key = False
        else:
            self.client = AsyncAnthropic(api_key=api_key)
            self._has_key = True

    @property
    def provider_name(self) -> str:
        return "anthropic"

    @property
    def default_model(self) -> str:
        return "claude-haiku-4-5"

    async def _generate_raw(self, prompt: str, model: str) -> Tuple[str, int, int]:
        if not self._has_key or not self.client:
            raise ValueError("ANTHROPIC_API_KEY not configured")

        message = await self.client.messages.create(
            model=model,
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}],
        )

        content_block = message.content[0]
        text = getattr(content_block, "text", str(content_block))

        return text, message.usage.input_tokens, message.usage.output_tokens


class XAIProvider(AIProvider):
    """X.AI (Grok) provider."""

    def __init__(self):
        if AsyncOpenAI is None:
            raise ImportError("openai package not installed. Run: pip install openai")

        api_key = os.getenv("GROK_API_KEY")
        if not api_key:
            self.client = None
            self._has_key = False
        else:
            self.client = AsyncOpenAI(api_key=api_key, base_url="https://api.x.ai/v1")
            self._has_key = True

    @property
    def provider_name(self) -> str:
        return "xai"

    @property
    def default_model(self) -> str:
        return "grok-4-1-fast-reasoning"

    async def _generate_raw(self, prompt: str, model: str) -> Tuple[str, int, int]:
        if not self._has_key or not self.client:
            raise ValueError("GROK_API_KEY not configured")

        response = await self.client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1000,
        )

        content = response.choices[0].message.content or ""
        input_tokens = response.usage.prompt_tokens if response.usage else 0
        output_tokens = response.usage.completion_tokens if response.usage else 0
        return content, input_tokens, output_tokens


MODEL_REGISTRY = {
    "gpt-5-mini": ("openai", "gpt-5-mini"),
    "gemini-3-flash-preview": ("gemini", "gemini-3-flash-preview"),
    "claude-haiku-4-5": ("anthropic", "claude-haiku-4-5"),
    "grok-4-1-fast-reasoning": ("xai", "grok-4-1-fast-reasoning"),
}


def resolve_model(model_id: str) -> Tuple[str, Optional[str]]:
    """
    Resolve a model ID to (provider_name, model_id).
    If model_id is already a provider name, return (provider_name, None).

    Args:
        model_id: Either a specific model ID (e.g., "gpt-5-mini") or provider name (e.g., "openai")

    Returns:
        Tuple of (provider_name, model_id or None)
    """
    if model_id in MODEL_REGISTRY:
        return MODEL_REGISTRY[model_id]

    # Assume it's a provider name like "openai", "gemini"
    return (model_id, None)


def create_provider(model_name: str) -> AIProvider:
    """Factory function to create AI provider instances."""
    providers = {
        "gemini": GeminiProvider,
        "openai": OpenAIProvider,
        "anthropic": AnthropicProvider,
        "xai": XAIProvider,
    }

    provider_class = providers.get(model_name.lower())
    if not provider_class:
        raise ValueError(
            f"Unknown model: {model_name}. Available: {', '.join(providers.keys())}"
        )

    return provider_class()
