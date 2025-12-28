"""Prompt adaptation for different AI models."""

from app.config.platform_policies import get_platform_policy


class PromptAdapter:
    """Adapts prompts for different AI models and platforms."""

    @staticmethod
    def adapt_prompt(idea: str, platform: str, model_name: str, voice_profile: str = None) -> str:
        """
        Create a model-specific prompt for content generation.

        Different AI models respond better to different prompt structures:
        - OpenAI (ChatGPT): Prefers structured, systematic prompts
        - Anthropic (Claude): Prefers conversational, natural prompts
        - XAI (Grok): Prefers concise, punchy instructions
        - Gemini: Works well with detailed, explicit prompts

        Args:
            idea: The content idea to generate from
            platform: Target platform (e.g., 'linkedin', 'twitter')
            model_name: AI model being used ('openai', 'anthropic', 'xai', 'gemini')
            voice_profile: Optional writing style/voice

        Returns:
            Formatted prompt string optimized for the specific model
        """
        # Get platform specifications
        policy = get_platform_policy(platform)
        char_limit = policy.get("char_limit", 2000)
        tone = policy.get("tone", "engaging")
        features = policy.get("features", "")
        format_style = policy.get("format", "")

        # Default voice if not provided
        if not voice_profile:
            voice_profile = "Professional, engaging, and authentic. Uses storytelling and practical examples."

        # Model-specific prompt templates
        if model_name == "openai":
            return PromptAdapter._openai_prompt(idea, platform, char_limit, tone, features, format_style, voice_profile)
        elif model_name == "anthropic":
            return PromptAdapter._anthropic_prompt(idea, platform, char_limit, tone, features, format_style, voice_profile)
        elif model_name == "xai":
            return PromptAdapter._xai_prompt(idea, platform, char_limit, tone, features, format_style, voice_profile)
        else:  # gemini or default
            return PromptAdapter._gemini_prompt(idea, platform, char_limit, tone, features, format_style, voice_profile)

    @staticmethod
    def _openai_prompt(idea: str, platform: str, char_limit: int, tone: str, features: str, format_style: str, voice: str) -> str:
        """Structured prompt for OpenAI models."""
        return f"""You are an expert social media content creator. Create a {platform.upper()} post.

TASK: Generate engaging content for {platform.upper()}

CONTENT IDEA:
{idea}

REQUIREMENTS:
1. Character Limit: Maximum {char_limit} characters
2. Tone: {tone}
3. Style: {voice}
4. Features: {features}
5. Format: {format_style}

CRITICAL INSTRUCTIONS:
- Write ONLY the post content, nothing else
- Do NOT include meta-commentary like "Here's a post..." or "This post..."
- Stay within the {char_limit} character limit
- Match the {tone} tone precisely
- Follow {platform}'s best practices

Generate the post now:"""

    @staticmethod
    def _anthropic_prompt(idea: str, platform: str, char_limit: int, tone: str, features: str, format_style: str, voice: str) -> str:
        """Conversational prompt for Claude."""
        return f"""Hey! I need your help creating a great {platform.upper()} post.

Here's what I'm thinking about:
{idea}

Can you write this in a {tone} way? I want it to feel {voice.lower()}

A few things to keep in mind:
- Keep it under {char_limit} characters
- {features}
- {format_style}

Just write the post itself - no explanations or commentary needed. Make it authentic and engaging for {platform}!"""

    @staticmethod
    def _xai_prompt(idea: str, platform: str, char_limit: int, tone: str, features: str, format_style: str, voice: str) -> str:
        """Punchy, direct prompt for Grok."""
        return f"""Create a {platform.upper()} post. {tone.capitalize()} tone.

Idea: {idea}

Rules:
- Max {char_limit} chars
- {features}
- {format_style}
- Style: {voice}

Just the post. No fluff. Go:"""

    @staticmethod
    def _gemini_prompt(idea: str, platform: str, char_limit: int, tone: str, features: str, format_style: str, voice: str) -> str:
        """Detailed prompt for Gemini (current implementation style)."""
        return f"""Create a social media post for {platform.upper()} based on the following:

CONTENT IDEA: {idea}

WRITING STYLE: {voice}

PLATFORM REQUIREMENTS FOR {platform.upper()}:
- Character limit: {char_limit}
- Tone: {tone}
- Features: {features}
- Format: {format_style}

INSTRUCTIONS:
1. Write ONLY the post content, nothing else
2. Do not include meta-commentary like "Here's a post..." or "This post..."
3. Stay within the character limit
4. Match the specified tone and writing style
5. Follow the platform's best practices
6. Make it engaging and valuable to the audience

Generate the post now:"""
