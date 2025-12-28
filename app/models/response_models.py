from pydantic import BaseModel
from typing import List, Optional


class PlatformResult(BaseModel):
    """Result of content generation for a single platform."""
    platform: str
    success: bool
    content: Optional[str] = None
    model_used: Optional[str] = None
    error: Optional[str] = None
    error_code: Optional[str] = None
    char_count: Optional[int] = None


class GenerationResponse(BaseModel):
    """Response containing results from all requested platforms."""
    results: List[PlatformResult]
    success_count: int
    failure_count: int
    total_platforms: int
