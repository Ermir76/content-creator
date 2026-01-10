"""
JUDGE.PY - Scores shuffled anonymous texts against config weights.

Single responsibility: Blind evaluation and ranking.
- Does NOT know which is v1/v2/v3
- Does NOT rewrite anything
- Only scores and ranks
Does NOT load config - receives it from orchestrate.py.
"""

import json
from typing import Dict, Any, List
from dataclasses import dataclass
from app.providers.ai_provider import create_provider
from app.core.policy import build_prompt_instructions


@dataclass
class JudgeResult:
    """Result from the judge's evaluation."""

    ranking: List[str]  # ["A", "C", "B"] - best to worst
    scores: Dict[str, int]  # {"A": 85, "B": 70, "C": 78}
    raw_response: str = ""  # Original response if parsing fails


def judge(texts: Dict[str, str], platform: str, config: Dict[str, Any]) -> JudgeResult:
    """
    Score anonymous texts against config criteria.

    Args:
        texts: Dictionary of anonymous texts {"A": "...", "B": "...", "C": "..."}
        platform: Target platform (linkedin, twitter, etc.)
        config: Configuration dict (loaded by orchestrate.py)

    Returns:
        JudgeResult with ranking and scores
    """
    # Build evaluation criteria from config
    criteria = build_prompt_instructions(config)

    # Build the judge prompt - request JSON output
    prompt = f"""You are a Blind Judge for {platform} content.

TEXT A:
{texts.get("A", "")}

TEXT B:
{texts.get("B", "")}

TEXT C:
{texts.get("C", "")}

CRITERIA:
{criteria}

Score each text (0-100) based on how well it matches the criteria.

Output ONLY valid JSON with keys: A, B, C (scores 0-100), and "ranking" (array, best to worst)."""

    # Create provider and generate
    provider = create_provider("anthropic")
    response = provider.generate(prompt)

    # Parse the JSON response
    return parse_judge_response(response)


def parse_judge_response(response: str) -> JudgeResult:
    """Parse the judge's JSON response into structured data."""
    try:
        # Try to extract JSON from response (in case there's extra text)
        json_start = response.find("{")
        json_end = response.rfind("}") + 1

        if json_start != -1 and json_end > json_start:
            json_str = response[json_start:json_end]
            data = json.loads(json_str)

            scores = {
                "A": int(data.get("A", 0)),
                "B": int(data.get("B", 0)),
                "C": int(data.get("C", 0)),
            }
            ranking = data.get("ranking", [])

            # If no ranking provided, derive from scores
            if not ranking:
                ranking = sorted(scores.keys(), key=lambda x: scores[x], reverse=True)

            return JudgeResult(ranking=ranking, scores=scores)

    except (json.JSONDecodeError, ValueError, KeyError):
        pass

    # Parsing failed - return empty result with raw response for debugging
    return JudgeResult(ranking=[], scores={}, raw_response=response)
