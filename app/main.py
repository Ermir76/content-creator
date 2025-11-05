from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime

from app.database import Base, engine, get_db
from app.models.models import User, GeneratedContent
from app.services.gemini_service import generate_content_for_platforms

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Social Media Content Generator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
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
    id: int
    idea_prompt: str
    platform: str
    content_text: str
    status: str
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True


@app.post("/content/generate", response_model=List[GeneratedContentResponse])
async def generate_content(request: ContentGenerateRequest, db: Session = Depends(get_db)):
    """
    Generate platform-specific content using Google Gemini AI.
    
    - **idea_prompt**: The content idea or topic
    - **platforms**: List of platforms (e.g., ["linkedin", "twitter", "reddit", "instagram"])
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
    
    try:
        # Call Gemini service to generate content for all platforms
        generated_contents_dict = generate_content_for_platforms(
            idea_prompt=request.idea_prompt,
            voice_profile=voice_profile,
            platforms=request.platforms
        )
        
        # Save each generated content to database
        content_records = []
        for platform, content_text in generated_contents_dict.items():
            content_record = GeneratedContent(
                idea_prompt=request.idea_prompt,
                platform=platform,
                content_text=content_text,
                status="ready_for_copy",
                user_id=user.id
            )
            db.add(content_record)
            content_records.append(content_record)
        
        db.commit()
        
        # Refresh all records to get their IDs
        for record in content_records:
            db.refresh(record)
        
        return content_records
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to generate content: {str(e)}")


@app.get("/content", response_model=List[GeneratedContentResponse])
async def get_all_content(db: Session = Depends(get_db)):
    """
    Retrieve all generated content from the database.
    """
    contents = db.query(GeneratedContent).order_by(GeneratedContent.created_at.desc()).all()
    return contents
