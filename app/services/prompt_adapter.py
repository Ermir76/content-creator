"""Prompt adaptation for different AI models."""

from typing import Optional, Dict, Any
import textwrap

from app.config.platform_policies import get_platform_policy


class PromptAdapter:
    """Adapts prompts for different AI models and platforms."""

    @staticmethod
    def adapt_prompt(
        idea: str, platform: str, model_name: str, voice_profile: Optional[str] = None
    ) -> str:
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
        target_chars = policy.get("target_chars")  # Soft target
        tone = policy.get("tone", "engaging")
        features = policy.get("features", "")
        format_style = policy.get("format", "")
        examples = policy.get("examples", [])

        # Determine strict char limit for prompt instructions
        # If target_chars is present, we might want to mention it.
        # But char_limit is the hard stop.

        # Default voice logic:
        # 1. Use passed voice_profile if valid
        # 2. Use policy-level voice_profile if exists
        # 3. Fallback to generic default
        if not voice_profile:
            voice_profile = policy.get(
                "voice_profile",
                "Professional, engaging, and authentic. Uses storytelling and practical examples.",
            )

        # Update char_limit description if target exists
        char_instruction = f"Maximum {char_limit} characters"
        if target_chars:
            char_instruction += f" (Target ~{target_chars} characters)"

        # Model-specific prompt templates
        if model_name == "openai":
            return PromptAdapter._openai_prompt(
                idea,
                platform,
                char_instruction,
                tone,
                features,
                format_style,
                voice_profile,
                examples,
            )
        elif model_name == "anthropic":
            return PromptAdapter._anthropic_prompt(
                idea,
                platform,
                char_instruction,
                tone,
                features,
                format_style,
                voice_profile,
                examples,
            )
        elif model_name == "xai":
            return PromptAdapter._xai_prompt(
                idea,
                platform,
                char_instruction,
                tone,
                features,
                format_style,
                voice_profile,
                examples,
            )
        else:  # gemini or default
            return PromptAdapter._gemini_prompt(
                idea,
                platform,
                char_instruction,
                tone,
                features,
                format_style,
                voice_profile,
                examples,
            )

    @staticmethod
    def _openai_prompt(
        idea: str,
        platform: str,
        char_limit: int,
        tone: str,
        features: str,
        format_style: str,
        voice: str,
        examples: list[str] = None,
    ) -> str:
        """Structured prompt for OpenAI models."""

        limit_desc = str(char_limit) if isinstance(char_limit, int) else char_limit

        examples_section = ""
        if examples:
            formatted_examples = "\n\n".join(
                [
                    f"Example {i + 1}:\n{textwrap.dedent(ex).strip()}"
                    for i, ex in enumerate(examples)
                ]
            )
            examples_section = (
                f"\n\nREFERENCE EXAMPLES (EMULATE THIS STYLE):\n{formatted_examples}"
            )

        return f"""You are an expert social media content creator. Create a {platform.upper()} post.

TASK: Generate engaging content for {platform.upper()}

CONTENT IDEA:
{idea}

REQUIREMENTS:
1. Character Limit: {limit_desc}
2. Tone: {tone}
3. Style: {voice}
4. Features: {features}
5. Format: {format_style}{examples_section}

CRITICAL INSTRUCTIONS:
- Write ONLY the post content, nothing else
- Do NOT include meta-commentary like "Here's a post..." or "This post..."
- Stay within the character limit
- Match the {tone} tone precisely
- Follow {platform}'s best practices

Generate the post now:"""

    @staticmethod
    def _anthropic_prompt(
        idea: str,
        platform: str,
        char_limit: int,
        tone: str,
        features: str,
        format_style: str,
        voice: str,
        examples: list[str] = None,
    ) -> str:
        """Conversational prompt for Claude."""
        examples_text = ""
        if examples:
            formatted = "\n\n".join(
                [
                    f"Example {i + 1}:\n{textwrap.dedent(ex).strip()}"
                    for i, ex in enumerate(examples)
                ]
            )
            examples_text = (
                f"\n\nHere are some examples of the style I want:\n{formatted}"
            )

        return f"""Hey! I need your help creating a great {platform.upper()} post.

Here's what I'm thinking about:
{idea}

Can you write this in a {tone} way? I want it to feel {voice.lower()}

A few things to keep in mind:
- {char_limit}
- {features}
- {format_style}{examples_text}

Just write the post itself - no explanations or commentary needed. Make it authentic and engaging for {platform}!"""

    @staticmethod
    def _xai_prompt(
        idea: str,
        platform: str,
        char_limit: int,
        tone: str,
        features: str,
        format_style: str,
        voice: str,
        examples: list[str] = None,
    ) -> str:
        """Punchy, direct prompt for Grok."""
        examples_text = ""
        if examples:
            formatted = "\n\n".join(
                [
                    f"Ex {i + 1}:\n{textwrap.dedent(ex).strip()}"
                    for i, ex in enumerate(examples)
                ]
            )
            examples_text = f"\n\nStyle Examples:\n{formatted}"

        return f"""Create a {platform.upper()} post. {tone.capitalize()} tone.

Idea: {idea}

Rules:
- {char_limit}
- {features}
- {format_style}
- Style: {voice}{examples_text}

Just the post. No fluff. Go:"""

    @staticmethod
    def _gemini_prompt(
        idea: str,
        platform: str,
        char_limit: int,
        tone: str,
        features: str,
        format_style: str,
        voice: str,
        examples: list[str] = None,
    ) -> str:
        """Detailed prompt for Gemini (current implementation style)."""
        examples_section = ""
        if examples:
            formatted = "\n\n".join(
                [
                    f"Example {i + 1}:\n{textwrap.dedent(ex).strip()}"
                    for i, ex in enumerate(examples)
                ]
            )
            examples_section = f"\n\nREFERENCE EXAMPLES:\n{formatted}"

        return f"""Create a social media post for {platform.upper()} based on the following:

CONTENT IDEA: {idea}

WRITING STYLE: {voice}

PLATFORM REQUIREMENTS FOR {platform.upper()}:
- Character limit: {char_limit}
- Tone: {tone}
- Features: {features}
- Format: {format_style}{examples_section}

INSTRUCTIONS:
1. Write ONLY the post content, nothing else
2. Do not include meta-commentary like "Here's a post..." or "This post..."
3. Stay within the character limit
4. Match the specified tone and writing style
5. Follow the platform's best practices
6. Make it engaging and valuable to the audience

Generate the post now:"""

    @staticmethod
    def challenger_prompt(
        draft: str,
        platform: str,
        policy: Dict[str, Any],
    ) -> str:
        """
        Step 2: The Challenger (Gemini).
        Critiques AND Rewrites the draft to be more logical and compliant.
        """
        char_limit = policy.get("char_limit", 2000)
        target_chars = policy.get("target_chars")
        tone = policy.get("tone", "engaging")
        features = policy.get("features", "")
        format_style = policy.get("format", "")

        # Build char instruction
        if target_chars:
            char_instruction = f"Target ~{target_chars} characters (hard max: {char_limit})"
        else:
            char_instruction = f"Maximum {char_limit} characters"

        return f"""You are a Ruthless Editor for {platform.upper()}.

Your goal is to optimize this content for VIRALITY and ENGAGEMENT.

CURRENT DRAFT V1:
{draft}

YOUR MISSION:
1. CRITIQUE V1: Identify 3 key weaknesses (e.g., boring hook, filler words, weak CTA, not following platform rules).
2. REWRITE V2: Write a completely NEW version ("Draft V2") that solves these issues.

PLATFORM RULES:
- Tone: {tone}
- Format: {format_style}
- Features: {features}
- LENGTH: {char_instruction}

OUTPUT FORMAT:
CRITIQUE:
- [Point 1]
- [Point 2]
- [Point 3]

<<<DRAFT_V2_START>>>
[Your complete rewritten post]"""

    @staticmethod
    def synthesizer_prompt(
        draft1: str,
        critique: str,
        draft2: str,
        platform: str,
        policy: Dict[str, Any],
    ) -> str:
        """
        Step 3: The Synthesizer (GPT-4o).
        Combines the creative spark of V1 with the logical structure of V2.
        """
        format_style = policy.get("format", "")
        char_limit = policy.get("char_limit", 2000)
        target_chars = policy.get("target_chars")

        # Build char instruction
        if target_chars:
            char_instruction = f"Target ~{target_chars} characters (hard max: {char_limit})"
        else:
            char_instruction = f"Maximum {char_limit} characters"

        return f"""You are an Expert Content Synthesizer.

We have two drafts for a {platform.upper()} post.

DRAFT V1 (Creative/Story-driven):
{draft1}

CRITIQUE OF V1:
{critique}

DRAFT V2 (Logical/Compliant):
{draft2}

TASK:
Create "Draft V3" - the FINAL version.
- Combine the "Soul" and storytelling of V1.
- With the "Discipline" and structure of V2.
- Ensure strict adherence to: {format_style}
- LENGTH: {char_instruction}

Output ONLY the final post content."""

    @staticmethod
    def judge_prompt(
        draft1: str,
        draft2: str,
        draft3: str,
        platform: str,
    ) -> str:
        """
        Step 4: The Judge (Selector).
        Evaluates V1, V2, and V3 and picks the winner.
        """
        return f"""You are the Final Strategy Judge for {platform.upper()}.

We have 3 candidate drafts for a post:

DRAFT A:
{draft1}

DRAFT B:
{draft2}

DRAFT C:
{draft3}

TASK:
1. Analyze which draft BEST fits the {platform.upper()} algorithm and audience.
2. Select the winner.
3. You may make *tiny* polish edits (grammar/formatting) to the winner if absolutely necessary, but prefer the original.

Output ONLY the content of the winning post. Nothing else."""
