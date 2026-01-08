import os
from abc import ABC, abstractmethod
from dotenv import load_dotenv

load_dotenv()


class AIProvider(ABC):
    """Abstract base class for AI content generation providers."""

    @abstractmethod
    def generate(self, prompt: str) -> str:
        """Generate content based on the given prompt."""
        pass

    @abstractmethod
    def get_name(self) -> str:
        """Return the provider name."""
        pass


class GeminiProvider(AIProvider):
    """Google Gemini AI provider."""

    def __init__(self):
        import google.generativeai as genai  # type: ignore

        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is not set")

        genai.configure(api_key=api_key)  # type: ignore
        self.model = genai.GenerativeModel('gemini-2.0-flash')  # type: ignore

    def generate(self, prompt: str) -> str:
        """Generate content using Gemini."""
        response = self.model.generate_content(prompt)
        return response.text.strip()

    def get_name(self) -> str:
        return "gemini"


class OpenAIProvider(AIProvider):
    """OpenAI (ChatGPT) provider."""

    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            # Provide stub for now if no API key
            self.client = None
            self._has_key = False
        else:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=api_key)
                self._has_key = True
            except ImportError:
                raise ImportError("openai package not installed. Run: pip install openai")

    def generate(self, prompt: str) -> str:
        """Generate content using OpenAI."""
        if not self._has_key or not self.client:
            raise ValueError("OPENAI_API_KEY not configured")

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",  # Using GPT-4o-mini for cost efficiency
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1000
        )
        return (response.choices[0].message.content or "").strip()

    def get_name(self) -> str:
        return "openai"


class AnthropicProvider(AIProvider):
    """Anthropic (Claude) provider."""

    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            # Provide stub for now if no API key
            self.client = None
            self._has_key = False
        else:
            try:
                from anthropic import Anthropic
                self.client = Anthropic(api_key=api_key)
                self._has_key = True
            except ImportError:
                raise ImportError("anthropic package not installed. Run: pip install anthropic")

    def generate(self, prompt: str) -> str:
        """Generate content using Claude."""
        if not self._has_key or not self.client:
            raise ValueError("ANTHROPIC_API_KEY not configured")

        message = self.client.messages.create(
            model="claude-3-5-haiku-20241022",  # Using Haiku for cost efficiency
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )
        # Get text from first content block
        content_block = message.content[0]
        text = getattr(content_block, 'text', str(content_block))
        return text.strip()

    def get_name(self) -> str:
        return "anthropic"


class XAIProvider(AIProvider):
    """X.AI (Grok) provider."""

    def __init__(self):
        api_key = os.getenv("XAI_API_KEY")
        if not api_key:
            # Provide stub for now if no API key
            self.client = None
            self._has_key = False
        else:
            # Grok uses OpenAI-compatible API
            try:
                from openai import OpenAI
                self.client = OpenAI(
                    api_key=api_key,
                    base_url="https://api.x.ai/v1"
                )
                self._has_key = True
            except ImportError:
                raise ImportError("openai package not installed. Run: pip install openai")

    def generate(self, prompt: str) -> str:
        """Generate content using Grok."""
        if not self._has_key or not self.client:
            raise ValueError("XAI_API_KEY not configured")

        response = self.client.chat.completions.create(
            model="grok-2-latest",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1000
        )
        return (response.choices[0].message.content or "").strip()

    def get_name(self) -> str:
        return "xai"


def create_provider(model_name: str) -> AIProvider:
    """Factory function to create AI provider instances."""
    providers = {
        "gemini": GeminiProvider,
        "openai": OpenAIProvider,
        "anthropic": AnthropicProvider,
        "xai": XAIProvider
    }

    provider_class = providers.get(model_name.lower())
    if not provider_class:
        raise ValueError(f"Unknown model: {model_name}. Available: {', '.join(providers.keys())}")

    return provider_class()
