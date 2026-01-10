from datetime import datetime
from typing import Dict, List, Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models.models import GeneratedContent, User
from app.models.response_models import GenerationResponse
from app.services.content import (
    generate_content as generate_multi_platform_content,
    get_circuit_breaker_status,
    reset_circuit_breaker,
)
from app.core.exceptions import ContentCreatorException

load_dotenv()


# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Social Media Content Generator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World", "status": "API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Pydantic models for request/response validation
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
    platform_policies: Optional[Dict[str, PolicyOverride]] = (
        None  # Per-platform custom policies
    )


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
    # Quality tracking fields (Phase 10)
    model_used: Optional[str] = None
    validation_passed: Optional[bool] = None
    regeneration_count: Optional[int] = None
    char_count: Optional[int] = None

    class Config:
        from_attributes = True


class ContentUpdateRequest(BaseModel):
    """Request model for updating content text."""

    content_text: str


@app.post("/content/generate", response_model=GenerationResponse)
async def generate_content(
    request: ContentGenerateRequest, db: Session = Depends(get_db)
):
    """
    Generate platform-specific content using AI models.

    Uses multi-model architecture with automatic fallback and retry logic.
    Content is NOT automatically saved - use POST /content/save to persist.

    - **idea_prompt**: The content idea or topic
    - **platforms**: List of platforms (e.g., ["linkedin", "twitter", "reddit", "instagram"])
    - **platform_policies**: Optional per-platform custom policy overrides

    Returns GenerationResponse with results for each platform, including success/failure status.
    """
    # Validate policy overrides if provided
    if request.platform_policies:
        valid_tones = ["Professional", "Casual", "Direct", "Storytelling"]
        valid_hooks = ["Question", "Bold statement", "Story", "Fact", "Anti-pattern"]
        valid_cta = ["None", "Soft", "Medium", "Strong"]

        for platform, policy in request.platform_policies.items():
            if policy.target_chars is not None and not (
                500 <= policy.target_chars <= 1500
            ):
                raise HTTPException(
                    status_code=400,
                    detail=f"target_chars for {platform} must be between 500 and 1500",
                )
            if policy.tone is not None and policy.tone not in valid_tones:
                raise HTTPException(
                    status_code=400,
                    detail=f"tone for {platform} must be one of: {valid_tones}",
                )
            if policy.hook_style is not None and policy.hook_style not in valid_hooks:
                raise HTTPException(
                    status_code=400,
                    detail=f"hook_style for {platform} must be one of: {valid_hooks}",
                )
            if policy.cta_strength is not None and policy.cta_strength not in valid_cta:
                raise HTTPException(
                    status_code=400,
                    detail=f"cta_strength for {platform} must be one of: {valid_cta}",
                )

    # Generate content using new pipeline
    generation_response = generate_multi_platform_content(
        idea=request.idea_prompt,
        platforms=request.platforms,
    )

    return generation_response


@app.post("/content/save", response_model=GeneratedContentResponse)
async def save_content(request: ContentSaveRequest, db: Session = Depends(get_db)):
    """
    Save a single piece of generated content to the database.

    - **idea_prompt**: The original prompt used to generate content
    - **platform**: The target platform (e.g., "linkedin", "twitter")
    - **content_text**: The generated content text
    - **model_used**: Optional, the AI model that generated this content
    - **char_count**: Optional, character count of the content
    """
    # Ensure we have at least one user (for MVP, create a default user if none exists)
    user = db.query(User).first()
    if not user:
        user = User(email="default@example.com", voice_profile="Default voice profile")
        db.add(user)
        db.commit()
        db.refresh(user)

    # Create content record
    content_record = GeneratedContent(
        idea_prompt=request.idea_prompt,
        platform=request.platform,
        content_text=request.content_text,
        status="saved",
        user_id=user.id,
        model_used=request.model_used,
        validation_passed=True,
        char_count=request.char_count or len(request.content_text),
        regeneration_count=0,
    )
    db.add(content_record)
    db.commit()
    db.refresh(content_record)

    return content_record


@app.delete("/content/{content_id}")
async def delete_content(content_id: int, db: Session = Depends(get_db)):
    """
    Delete a saved content item by ID.

    - **content_id**: The ID of the content to delete
    """
    content = (
        db.query(GeneratedContent).filter(GeneratedContent.id == content_id).first()
    )
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    db.delete(content)
    db.commit()

    return {"message": "Content deleted successfully", "id": content_id}


@app.put("/content/{content_id}", response_model=GeneratedContentResponse)
async def update_content(
    content_id: int, request: ContentUpdateRequest, db: Session = Depends(get_db)
):
    """
    Update the text of a saved content item.

    - **content_id**: The ID of the content to update
    - **content_text**: The new content text
    """
    content = (
        db.query(GeneratedContent).filter(GeneratedContent.id == content_id).first()
    )
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    content.content_text = request.content_text
    content.char_count = len(request.content_text)
    db.commit()
    db.refresh(content)

    return content


@app.get("/content", response_model=List[GeneratedContentResponse])
async def get_all_content(db: Session = Depends(get_db)):
    """
    Retrieve all saved content from the database.

    Includes quality tracking fields: model_used, validation_passed, etc.
    """
    contents = (
        db.query(GeneratedContent).order_by(GeneratedContent.created_at.desc()).all()
    )
    return contents


@app.get("/circuit-breaker/status")
async def get_model_status():
    """
    Get the current status of all AI model circuit breakers.

    Useful for debugging and monitoring model availability.
    """
    return get_circuit_breaker_status()


@app.post("/circuit-breaker/reset/{model_name}")
async def reset_model_circuit(model_name: Optional[str] = None):
    """
    Reset circuit breaker for a specific model or all models.

    - **model_name**: Model to reset (gemini, openai, anthropic, xai) or 'all'
    """
    if model_name == "all":
        reset_circuit_breaker(None)
        return {"message": "All circuit breakers reset"}
    else:
        reset_circuit_breaker(model_name)
        return {"message": f"Circuit breaker reset for {model_name}"}


@app.exception_handler(ContentCreatorException)
async def content_creator_exception_handler(
    request: Request, exc: ContentCreatorException
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.code, "message": exc.message},
    )
