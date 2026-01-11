import time
import os
from abc import ABC, abstractmethod


from dotenv import load_dotenv

from app.models.provider import ProviderResponse, ProviderMetrics

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
    """Abstract base class for AI content generation providers."""

    @abstractmethod
    async def generate(self, prompt: str, model: str = None) -> ProviderResponse:
        """
        Generate content based on the given prompt.
        Must return a ProviderResponse object.
        """
        pass

    @abstractmethod
    def get_name(self) -> str:
        """Return the provider name."""
        pass


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

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-3-flash-preview")

    async def generate(self, prompt: str, model: str = None) -> ProviderResponse:
        """Generate content using Gemini."""
        active_model = self.model
        target_model_name = model or "gemini-3-flash-preview"

        if model:
            active_model = genai.GenerativeModel(model)

        start_time = time.time()
        # Gemini Async Call
        response = await active_model.generate_content_async(prompt)
        latency = (time.time() - start_time) * 1000

        # Extract metrics safely
        input_tokens = 0
        output_tokens = 0
        if hasattr(response, "usage_metadata"):
            input_tokens = response.usage_metadata.prompt_token_count
            output_tokens = response.usage_metadata.candidates_token_count

        return ProviderResponse(
            content=response.text.strip(),
            metrics=ProviderMetrics(
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                latency_ms=latency,
            ),
            provider_name="gemini",
            model_name=target_model_name,
        )

    def get_name(self) -> str:
        return "gemini"


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

    async def generate(self, prompt: str, model: str = None) -> ProviderResponse:
        """Generate content using OpenAI."""
        if not self._has_key or not self.client:
            raise ValueError("OPENAI_API_KEY not configured")

        target_model = model or "gpt-5-mini"

        start_time = time.time()
        response = await self.client.chat.completions.create(
            model=target_model,
            messages=[{"role": "user", "content": prompt}],
        )
        latency = (time.time() - start_time) * 1000

        # Extract metrics
        usage = response.usage
        input_tokens = usage.prompt_tokens if usage else 0
        output_tokens = usage.completion_tokens if usage else 0
        content = response.choices[0].message.content or ""

        return ProviderResponse(
            content=content.strip(),
            metrics=ProviderMetrics(
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                latency_ms=latency,
            ),
            provider_name="openai",
            model_name=target_model,
        )

    def get_name(self) -> str:
        return "openai"


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

    async def generate(self, prompt: str, model: str = None) -> ProviderResponse:
        """Generate content using Claude (Sync wrapped in Async)."""
        if not self._has_key or not self.client:
            raise ValueError("ANTHROPIC_API_KEY not configured")

        target_model = model or "claude-haiku-4-5"

        start_time = time.time()
        message = await self.client.messages.create(
            model=target_model,
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}],
        )
        latency = (time.time() - start_time) * 1000

        # Get text from first content block
        content_block = message.content[0]
        text = getattr(content_block, "text", str(content_block))

        # Approximate metrics (Claude usage is in response.usage)
        input_tokens = message.usage.input_tokens
        output_tokens = message.usage.output_tokens

        return ProviderResponse(
            content=text.strip(),
            metrics=ProviderMetrics(
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                latency_ms=latency,
            ),
            provider_name="anthropic",
            model_name=target_model,
        )

    def get_name(self) -> str:
        return "anthropic"


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
            # Grok uses OpenAI-compatible API (Async)
            self.client = AsyncOpenAI(api_key=api_key, base_url="https://api.x.ai/v1")
            self._has_key = True

    async def generate(self, prompt: str, model: str = None) -> ProviderResponse:
        """Generate content using Grok."""
        if not self._has_key or not self.client:
            raise ValueError("GROK_API_KEY not configured")

        target_model = model or "grok-4-1-fast-reasoning"

        start_time = time.time()
        response = await self.client.chat.completions.create(
            model=target_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1000,
        )
        latency = (time.time() - start_time) * 1000

        return ProviderResponse(
            content=(response.choices[0].message.content or "").strip(),
            metrics=ProviderMetrics(
                input_tokens=response.usage.prompt_tokens,
                output_tokens=response.usage.completion_tokens,
                latency_ms=latency,
            ),
            provider_name="xai",
            model_name=target_model,
        )

    def get_name(self) -> str:
        return "xai"


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
