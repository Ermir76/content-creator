from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.models.response_models import GenerationResponse
from app.models.schemas import (
    ContentGenerateRequest,
    ContentSaveRequest,
    GeneratedContentResponse,
    ContentUpdateRequest,
)
from app.services.content import (
    generate_content as generate_multi_platform_content,
    get_circuit_breaker_status,
    reset_circuit_breaker,
)
from app.repositories import content_repo
from app.core.platform_defaults import get_platform_policy

router = APIRouter()


@router.get("/platforms", tags=["System"])
async def get_platform_limits():
    """
    Get hard limits/defaults for all supported platforms.
    """
    platforms = ["linkedin", "twitter", "reddit", "instagram", "facebook", "tiktok"]
    return {p: get_platform_policy(p) for p in platforms}


@router.get("/", tags=["Health"])
async def root():
    return {"message": "Hello World", "status": "API is running"}


@router.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}


@router.post("/content/generate", response_model=GenerationResponse, tags=["Content"])
async def generate_content(
    request: ContentGenerateRequest, db: Session = Depends(get_db)
):
    """
    Generate platform-specific content using AI models.
    """
    # Logic delegated to Service Layer (orchestrate.py / content.py) which uses config.yaml logic

    return generate_multi_platform_content(
        idea=request.idea_prompt, platforms=request.platforms
    )


@router.post("/content/save", response_model=GeneratedContentResponse, tags=["Content"])
async def save_content(request: ContentSaveRequest, db: Session = Depends(get_db)):
    """Save generated content."""
    return content_repo.create_content(db, request)


@router.delete("/content/{content_id}", tags=["Content"])
async def delete_content(content_id: int, db: Session = Depends(get_db)):
    """Delete saved content."""
    success = content_repo.delete_content(db, content_id)
    if not success:
        raise HTTPException(status_code=404, detail="Content not found")
    return {"message": "Content deleted successfully", "id": content_id}


@router.put(
    "/content/{content_id}", response_model=GeneratedContentResponse, tags=["Content"]
)
async def update_content(
    content_id: int, request: ContentUpdateRequest, db: Session = Depends(get_db)
):
    """Update content text."""
    content = content_repo.update_content(db, content_id, request)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content


@router.get("/content", response_model=List[GeneratedContentResponse], tags=["Content"])
async def get_all_content(db: Session = Depends(get_db)):
    """Get all saved content."""
    return content_repo.get_all_content(db)


@router.get("/circuit-breaker/status", tags=["System"])
async def get_model_status():
    """Get system status."""
    return get_circuit_breaker_status()


@router.post("/circuit-breaker/reset/{model_name}", tags=["System"])
async def reset_model_circuit(model_name: Optional[str] = None):
    """Reset circuit breaker."""
    if model_name == "all":
        reset_circuit_breaker(None)
        return {"message": "All circuit breakers reset"}
    else:
        reset_circuit_breaker(model_name)
        return {"message": f"Circuit breaker reset for {model_name}"}
