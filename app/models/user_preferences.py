from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    # Store state as JSON strings or Text
    last_idea_prompt = Column(Text, nullable=True)
    last_platform_selection = Column(Text, nullable=True)  # JSON list of strings
    last_policies = Column(Text, nullable=True)  # JSON object
    last_expanded_platforms = Column(Text, nullable=True)  # JSON list of strings

    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationship to user
    user = relationship("User", back_populates="preferences")

    def __repr__(self):
        return f"<UserPreference(user_id={self.user_id})>"
