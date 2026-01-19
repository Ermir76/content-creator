from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import GeneratedContent, User
from app.models.schemas import ContentSaveRequest, ContentUpdateRequest


def get_or_create_default_user(db: Session) -> User:
    user = db.query(User).first()
    if not user:
        user = User(email="default@example.com", voice_profile="Default voice profile")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def create_content(db: Session, request: ContentSaveRequest) -> GeneratedContent:
    user = get_or_create_default_user(db)

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


def get_content_by_id(db: Session, content_id: int) -> Optional[GeneratedContent]:
    return db.query(GeneratedContent).filter(GeneratedContent.id == content_id).first()


def get_all_content(db: Session) -> List[GeneratedContent]:
    return db.query(GeneratedContent).order_by(GeneratedContent.created_at.desc()).all()


def update_content(
    db: Session, content_id: int, request: ContentUpdateRequest
) -> Optional[GeneratedContent]:
    content = get_content_by_id(db, content_id)
    if not content:
        return None

    content.content_text = request.content_text  # type: ignore
    content.char_count = len(request.content_text)  # type: ignore
    db.commit()
    db.refresh(content)
    return content


def delete_content(db: Session, content_id: int) -> bool:
    content = get_content_by_id(db, content_id)
    if not content:
        return False

    db.delete(content)
    db.commit()
    return True
