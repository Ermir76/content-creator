from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

from app.database import Base, engine, get_db
from app.models.models import User, GeneratedContent
from app.models.response_models import GenerationResponse
from app.services.content_generator import (
    generate_content as generate_multi_platform_content,
)
from app.services.content_generator import (
    get_circuit_breaker_status,
    reset_circuit_breaker,
)


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
class ContentGenerateRequest(BaseModel):
    idea_prompt: str
    platforms: List[str]


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


@app.post("/content/generate", response_model=GenerationResponse)
async def generate_content(
    request: ContentGenerateRequest, db: Session = Depends(get_db)
):
    """
    Generate platform-specific content using AI models.

    Uses multi-model architecture with automatic fallback and retry logic.

    - **idea_prompt**: The content idea or topic
    - **platforms**: List of platforms (e.g., ["linkedin", "twitter", "reddit", "instagram"])

    Returns GenerationResponse with results for each platform, including success/failure status.
    """
    # MVP: Hardcoded voice profile
    voice_profile = "Professional, engaging, and authentic. Uses storytelling and practical examples."

    # Ensure we have at least one user (for MVP, create a default user if none exists)
    user = db.query(User).first()
    if not user:
        user = User(email="default@example.com", voice_profile=voice_profile)
        db.add(user)
        db.commit()
        db.refresh(user)

    # Generate content using new orchestrator
    generation_response = generate_multi_platform_content(
        idea=request.idea_prompt,
        platforms=request.platforms,
        voice_profile=voice_profile,
    )

    # Save successful results to database with quality tracking
    for result in generation_response.results:
        if result.success and result.content:
            content_record = GeneratedContent(
                idea_prompt=request.idea_prompt,
                platform=result.platform,
                content_text=result.content,
                status="ready_for_copy",
                user_id=user.id,
                model_used=result.model_used,
                validation_passed=True,
                char_count=result.char_count,
                regeneration_count=0,  # TODO: track from retry logic
            )
            db.add(content_record)

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        # Still return the generation response, just log the DB error
        print(f"Warning: Failed to save content to database: {e}")

    return generation_response


@app.get("/content", response_model=List[GeneratedContentResponse])
async def get_all_content(db: Session = Depends(get_db)):
    """
    Retrieve all generated content from the database.

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
async def reset_model_circuit(model_name: str = None):
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
