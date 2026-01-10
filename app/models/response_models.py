from pydantic import BaseModel
from typing import List, Optional


class Draft(BaseModel):
    """Represents a single step's draft in the agentic flow."""

    step: str  # e.g., "Drafter", "Challenger"
    model: str  # e.g., "gpt-4o"
    content: str


class PlatformResult(BaseModel):
    """Result of content generation for a single platform."""

    platform: str
    success: bool
    content: Optional[str] = None
    model_used: Optional[str] = None
    error: Optional[str] = None
    error_code: Optional[str] = None

    char_count: Optional[int] = None
    drafts: Optional[List[Draft]] = None  # For agentic flow transparent history


class GenerationResponse(BaseModel):
    """Response containing results from all requested platforms."""

    results: List[PlatformResult]
    success_count: int
    failure_count: int
    total_platforms: int
