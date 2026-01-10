from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    voice_profile = Column(Text, nullable=True)

    # Relationship to generated content
    generated_contents = relationship("GeneratedContent", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"


class GeneratedContent(Base):
    __tablename__ = "generated_content"

    id = Column(Integer, primary_key=True, index=True)
    idea_prompt = Column(Text, nullable=False)
    platform = Column(String, nullable=False)  # e.g., "linkedin", "reddit", "twitter"
    content_text = Column(Text, nullable=False)
    status = Column(String, default="ready_for_copy", nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Quality tracking columns (Phase 10)
    model_used = Column(String, nullable=True)  # Which AI model generated this content
    validation_passed = Column(
        Boolean, default=True, nullable=True
    )  # Did output pass validation
    regeneration_count = Column(
        Integer, default=0, nullable=True
    )  # How many retries needed
    char_count = Column(Integer, nullable=True)  # Character count of generated content

    # Relationship to user
    user = relationship("User", back_populates="generated_contents")

    def __repr__(self):
        return f"<GeneratedContent(id={self.id}, platform={self.platform}, model={self.model_used}, status={self.status})>"
