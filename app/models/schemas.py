from typing import List, Dict, Optional
from datetime import datetime
from pydantic import BaseModel


class PolicyOverride(BaseModel):
    """Custom policy overrides for content generation."""

    target_chars: Optional[int] = None  # 500-1500
    tone: Optional[str] = None  # Professional, Casual, Direct, Storytelling
    features: Optional[List[str]] = (
        None  # hashtags, emojis, questions, short_paragraphs
    )
    voice_profile: Optional[str] = None
    hook_style: Optional[str] = (
        None  # Question, Bold statement, Story, Fact, Anti-pattern
    )
    cta_strength: Optional[str] = None  # None, Soft, Medium, Strong


class ContentGenerateRequest(BaseModel):
    idea_prompt: str
    platforms: List[str]
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
