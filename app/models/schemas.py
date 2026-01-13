from typing import List, Dict, Optional, Any, Union
from datetime import datetime
from pydantic import BaseModel, Field


# --- Deep Configuration Models (Matching config.yaml) ---


class PersonalityConfig(BaseModel):
    human: Optional[float] = None
    professional: Optional[float] = None
    friendly: Optional[float] = None
    vulnerable: Optional[float] = None
    provocative: Optional[float] = None
    opinionated: Optional[float] = None


class AuthenticityConfig(BaseModel):
    honest: Optional[float] = None
    polished: Optional[float] = None
    raw: Optional[float] = None


class AuthorPersona(BaseModel):
    perspective: Optional[str] = None  # first-person, etc.
    personality: Optional[PersonalityConfig] = None
    authenticity: Optional[AuthenticityConfig] = None
    corporate: Optional[bool] = None


class StyleWeights(BaseModel):
    direct: Optional[float] = None
    indirect: Optional[float] = None
    casual: Optional[float] = None


class MoodWeights(BaseModel):
    reflective: Optional[float] = None
    energetic: Optional[float] = None
    serious: Optional[float] = None
    inspiring: Optional[float] = None
    urgent: Optional[float] = None
    calm: Optional[float] = None
    defiant: Optional[float] = None
    curious: Optional[float] = None


class ApproachWeights(BaseModel):
    direct: Optional[float] = None
    storytelling: Optional[float] = None
    educational: Optional[float] = None


class HumorConfig(BaseModel):
    enabled: Optional[bool] = None
    intensity: Optional[float] = None
    types: Optional[Dict[str, float]] = (
        None  # dry, witty, etc using dict for flexibility
    )


class WritingStyle(BaseModel):
    style: Optional[StyleWeights] = None
    mood: Optional[MoodWeights] = None
    approach: Optional[ApproachWeights] = None
    humor: Optional[HumorConfig] = None
    short_paragraphs: Optional[bool] = None
    emojis: Optional[str] = None


class HookWeights(BaseModel):
    punchy: Optional[float] = None
    question: Optional[float] = None
    statistic: Optional[float] = None
    story: Optional[float] = None
    bold_claim: Optional[float] = None
    contrarian: Optional[float] = None
    confession: Optional[float] = None
    pain_point: Optional[float] = None


class BodyTexture(BaseModel):
    examples: Optional[float] = None
    data: Optional[float] = None
    analogy: Optional[float] = None
    dialogue: Optional[float] = None
    tension: Optional[float] = None


class BodyConfig(BaseModel):
    type: Optional[str] = None
    texture: Optional[BodyTexture] = None


class EndingWeights(BaseModel):
    one_question: Optional[float] = None
    call_to_action: Optional[float] = None
    statement: Optional[float] = None
    cliffhanger: Optional[float] = None
    callback: Optional[float] = None
    challenge: Optional[float] = None


class FormatConfig(BaseModel):
    hook: Optional[HookWeights] = None
    body: Optional[BodyConfig] = None
    ending: Optional[EndingWeights] = None


class Constraints(BaseModel):
    char_limit: Optional[int] = None
    target_chars: Optional[int] = None
    hashtags: Optional[int] = None


class ModelRouting(BaseModel):
    default: Optional[str] = None
    pipeline: Optional[Dict[str, str]] = None  # generator: gemini, etc.


# --- The Master Override Object ---


class PolicyOverride(BaseModel):
    """
    Full control over every aspect of generation.
    Matches the structure of defaults/platforms in config.yaml.
    """

    constraints: Optional[Constraints] = None
    author_persona: Optional[AuthorPersona] = None
    writing_style: Optional[WritingStyle] = None
    format: Optional[FormatConfig] = None
    models: Optional[ModelRouting] = None  # Allow overriding models per request!

    # Backwards compatibility fields (mapped validation in policy.py might need check)
    # kept for simple UI parts if needed, but deep config is preferred
    tone: Optional[str] = None
    voice_profile: Optional[str] = None


# --- API Request/Response Models ---


class ContentGenerateRequest(BaseModel):
    idea_prompt: str
    platforms: List[str]
    # Map platform_name -> Full Policy Override
    platform_policies: Optional[Dict[str, PolicyOverride]] = None


class ContentSaveRequest(BaseModel):
    """Request model for saving generated content."""

    idea_prompt: str
    platform: str
    content_text: str
    model_used: Optional[str] = None
    char_count: Optional[int] = None


class GeneratedContentResponse(BaseModel):
    """Response model for database-stored content (GET endpoints)."""

    id: int
    idea_prompt: str
    platform: str
    content_text: str
    status: str
    created_at: datetime
    user_id: int
    # Quality tracking fields
    model_used: Optional[str] = None
    validation_passed: Optional[bool] = None
    regeneration_count: Optional[int] = None
    char_count: Optional[int] = None

    class Config:
        from_attributes = True


class ContentUpdateRequest(BaseModel):
    """Request model for updating content text."""

    content_text: str


# --- User Preferences Schemas ---


class UserPreferenceUpdate(BaseModel):
    last_idea_prompt: Optional[str] = None
    last_platform_selection: Optional[str] = None  # JSON string
    last_policies: Optional[str] = None  # JSON string
    last_expanded_platforms: Optional[str] = None  # JSON string


class UserPreferenceResponse(BaseModel):
    id: int
    user_id: int
    last_idea_prompt: Optional[str] = None
    last_platform_selection: Optional[str] = None
    last_policies: Optional[str] = None
    last_expanded_platforms: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True
