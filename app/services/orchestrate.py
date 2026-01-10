"""
ORCHESTRATE.PY - Ties the entire pipeline together.

Responsibilities:
1. Load config once
2. Run generator → v1
3. Run critic → v2
4. Run improver → v3
5. Shuffle [v1, v2, v3] → assign A, B, C randomly
6. Run judge with shuffled texts
7. Reveal mapping and present results to user
"""

import random
from typing import Dict, Tuple
from dataclasses import dataclass
from dotenv import load_dotenv

from app.core.policy import load_config
from app.services.pipeline.generator import generate
from app.services.pipeline.critic import critique
from app.services.pipeline.improver import improve
from app.services.pipeline.judge import judge, JudgeResult
from app.utils.validation import OutputValidator


load_dotenv()  # Load API keys from .env


@dataclass
class PipelineResult:
    """Complete result from the pipeline."""

    v1: str
    v2: str
    v3: str
    shuffle_map: Dict[str, str]  # {"A": "v1", "B": "v3", "C": "v2"}
    judge_result: JudgeResult


def shuffle_versions(
    v1: str, v2: str, v3: str
) -> Tuple[Dict[str, str], Dict[str, str]]:
    """
    Randomly assign v1, v2, v3 to labels A, B, C.

    Returns:
        Tuple of (texts_for_judge, reveal_map)
        - texts_for_judge: {"A": "text...", "B": "text...", "C": "text..."}
        - reveal_map: {"A": "v1", "B": "v3", "C": "v2"} (for revealing after)
    """
    versions = [("v1", v1), ("v2", v2), ("v3", v3)]
    random.shuffle(versions)

    labels = ["A", "B", "C"]
    texts_for_judge = {}
    reveal_map = {}

    for i, (version_name, content) in enumerate(versions):
        label = labels[i]
        texts_for_judge[label] = content
        reveal_map[label] = version_name

    return texts_for_judge, reveal_map


def run_pipeline(
    user_input: str, platform: str, config_path: str = None
) -> PipelineResult:
    """
    Run the complete content generation pipeline.

    Args:
        user_input: The user's content/topic/brief
        platform: Target platform (linkedin, twitter, etc.)
        config_path: Optional path to config.yaml

    Returns:
        PipelineResult with all versions, shuffle map, and judge scores
    """
    # Load config ONCE
    config = load_config(config_path)

    # Step 1: Generate v1 (with validation + 1 retry)
    v1 = generate(user_input, platform, config)
    validation = OutputValidator.validate(v1, platform, config)

    if not validation.passed:
        # Retry once
        v1 = generate(user_input, platform, config)
        validation = OutputValidator.validate(v1, platform, config)

        if not validation.passed:
            raise ValueError(f"Generator failed validation twice: {validation.reason}")

    # Step 2: Critique → v2
    v2 = critique(v1, platform, config)

    # Step 3: Improve → v3
    v3 = improve(v1, v2, platform, config)

    # Step 4: Shuffle for blind judging
    texts_for_judge, reveal_map = shuffle_versions(v1, v2, v3)

    # Step 5: Judge (blind)
    judge_result = judge(texts_for_judge, platform, config)

    return PipelineResult(
        v1=v1, v2=v2, v3=v3, shuffle_map=reveal_map, judge_result=judge_result
    )
