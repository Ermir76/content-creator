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
    PromptPreviewRequest,
    PromptPreviewResponse,
    PlatformPromptPreview,
)
from app.services import content as content_service
from app.repositories import content_repo
from app.core.platform_defaults import get_platform_policy
from app.core.policy import get_merged_config
from app.services.pipeline.generator import build_generation_prompt
from app.utils.resilience import CIRCUIT_BREAKER

router = APIRouter()


@router.get("/platforms", tags=["System"])
async def get_platform_limits():
    """
    Get hard limits/defaults for all supported platforms.
    """
    platforms = ["linkedin", "x", "reddit", "instagram", "facebook", "tiktok"]
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

    return await content_service.generate_content(
        idea=request.idea_prompt,
        platforms=request.platforms,
        platform_policies=request.platform_policies,
    )


@router.post(
    "/content/preview-prompt", response_model=PromptPreviewResponse, tags=["Content"]
)
async def preview_prompt(request: PromptPreviewRequest):
    """
    Preview the prompts that would be sent to AI without generating content.
    Returns one prompt per selected platform.
    """
    previews = []

    for platform in request.platforms:
        # Get policy overrides for this platform (if any)
        overrides = None
        if request.platform_policies and platform in request.platform_policies:
            policy = request.platform_policies[platform]
            overrides = policy.model_dump(exclude_none=True) if policy else None

        # Merge config with overrides
        config = get_merged_config(platform, overrides)

        # Build the prompt
        prompt = build_generation_prompt(request.idea_prompt, platform, config)

        previews.append(PlatformPromptPreview(platform=platform, prompt=prompt))

    return PromptPreviewResponse(previews=previews)


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
    # Check standard providers + any that have failed
    providers = ["gemini", "openai", "anthropic", "xai"]
    tracked = list(CIRCUIT_BREAKER.failures.keys())
    all_models = set(providers + tracked)

    return {model: CIRCUIT_BREAKER.get_status(model) for model in all_models}


@router.post("/circuit-breaker/reset/{model_name}", tags=["System"])
async def reset_model_circuit(model_name: Optional[str] = None):
    """Reset circuit breaker."""
    if not model_name or model_name.lower() == "all":
        # Reset everything we know about
        known_failures = list(CIRCUIT_BREAKER.failures.keys())
        known_open = list(CIRCUIT_BREAKER.opened_at.keys())
        targets = set(
            known_failures + known_open + ["gemini", "openai", "anthropic", "xai"]
        )

        for m in targets:
            CIRCUIT_BREAKER.reset(m)
        return {"message": "All circuit breakers reset"}
    else:
        CIRCUIT_BREAKER.reset(model_name)
        return {"message": f"Circuit breaker reset for {model_name}"}
