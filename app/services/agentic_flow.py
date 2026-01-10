"""
Agentic Workflow Service.

Orchestrates the multi-model pipeline for content generation:
1. Drafter (GPT-4o) -> Creates initial draft
2. Challenger (Gemini) -> Critiques and Rewrites (Draft V2)
3. Synthesizer (GPT-4o) -> Combines V1 and V2 into V3
4. Judge (Claude) -> Final polish
"""

from typing import Optional, List, Tuple
import logging

from app.services.ai_provider import create_provider
from app.services.prompt_adapter import PromptAdapter
from app.config.platform_policies import get_platform_policy
from app.models.response_models import Draft

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("agentic_flow.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


class AgenticFlow:
    """Orchestrator for the Agentic Content Pipeline."""

    @staticmethod
    def generate_flow(
        idea: str, platform: str, voice_profile: Optional[str] = None
    ) -> Tuple[str, List[Draft]]:
        """
        Run the complete agentic flow.

        Args:
            idea: Content idea
            platform: Target platform
            voice_profile: Optional voice

        Returns:
            Tuple[str, List[Draft]]: (Final Content, List of all Drafts)
        """
        policy = get_platform_policy(platform)

        # 1. Initialize Providers
        drafter = create_provider("openai")  # GPT-4o (Drafter)
        challenger = create_provider("gemini")  # Gemini Flash (Challenger)
        synthesizer = create_provider("openai")  # GPT-4o (Synthesizer)
        judge = create_provider("anthropic")  # Claude (Judge)

        drafts: List[Draft] = []

        # --- STEP 1: DRAFTER (GPT-5 Mini) ---
        logger.info("--- STEP 1: DRAFTER (GPT-5 Mini) ---")

        draft_prompt = PromptAdapter.adapt_prompt(
            idea, platform, "openai", voice_profile
        )
        draft_v1 = drafter.generate(draft_prompt)

        drafts.append(Draft(step="Drafter", model="gpt-5-mini", content=draft_v1))

        # --- STEP 2: CHALLENGER (Gemini) ---
        logger.info("--- STEP 2: CHALLENGER (Gemini) ---")

        challenger_prompt = PromptAdapter.challenger_prompt(draft_v1, platform, policy)
        challenger_response = challenger.generate(challenger_prompt)

        # Robust split for critique and draft
        parts = challenger_response.split("<<<DRAFT_V2_START>>>")
        if len(parts) == 2:
            critique_text = parts[0].strip()
            draft_v2_text = parts[1].strip()
        else:
            critique_text = challenger_response
            draft_v2_text = "(Model failed to separate Draft V2)"

        drafts.append(
            Draft(
                step="Challenger (Critique & V2)",
                model="gemini-3-flash-preview",
                content=draft_v2_text,
            )
        )

        # --- STEP 3: SYNTHESIZER (GPT-5 Mini) ---
        logger.info("--- STEP 3: SYNTHESIZER (GPT-5 Mini) ---")

        synth_prompt = PromptAdapter.synthesizer_prompt(
            draft_v1, critique_text, draft_v2_text, platform, policy
        )
        draft_v3 = synthesizer.generate(synth_prompt)

        drafts.append(Draft(step="Synthesizer", model="gpt-5-mini", content=draft_v3))

        # --- STEP 4: JUDGE (Claude) ---
        logger.info("--- STEP 4: JUDGE (Claude) ---")

        judge_prompt = PromptAdapter.judge_prompt(
            draft1=draft_v1,
            draft2=draft_v2_text,
            draft3=draft_v3,
            platform=platform,
        )
        final_post = judge.generate(judge_prompt)

        drafts.append(
            Draft(
                step="Final Judge (Selector)",
                model="claude-haiku-4-5",
                content=final_post,
            )
        )

        return final_post, drafts
