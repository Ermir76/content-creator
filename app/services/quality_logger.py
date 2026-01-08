"""Quality logging service for tracking content generation metrics."""

from typing import Optional
from sqlalchemy.orm import Session

from app.models.models import GeneratedContent


class QualityLogger:
    """
    Logger for tracking quality metrics of AI-generated content.

    Records model usage, validation results, and regeneration attempts
    to enable analysis and optimization of content generation.
    """

    def __init__(self, db: Session):
        """
        Initialize the quality logger with a database session.

        Args:
            db: SQLAlchemy database session for persisting metrics
        """
        self.db = db

    def log(
        self,
        content_record: GeneratedContent,
        model_used: str,
        validation_passed: bool,
        char_count: Optional[int] = None,
        regeneration_count: int = 0,
    ) -> None:
        """
        Log quality metrics for a generated content record.

        Args:
            content_record: The GeneratedContent database record to update
            model_used: Name of the AI model that generated the content
            validation_passed: Whether the content passed validation checks
            char_count: Character count of the generated content
            regeneration_count: Number of retry attempts before success
        """
        content_record.model_used = model_used
        content_record.validation_passed = validation_passed
        content_record.char_count = char_count
        content_record.regeneration_count = regeneration_count

        # Note: caller is responsible for committing the transaction

    def log_success(
        self,
        content_record: GeneratedContent,
        model_used: str,
        content: str,
        regeneration_count: int = 0,
    ) -> None:
        """
        Log a successful content generation.

        Args:
            content_record: The GeneratedContent database record
            model_used: Name of the AI model used
            content: The generated content text
            regeneration_count: Number of retry attempts
        """
        self.log(
            content_record=content_record,
            model_used=model_used,
            validation_passed=True,
            char_count=len(content),
            regeneration_count=regeneration_count,
        )

    def log_failure(
        self,
        content_record: GeneratedContent,
        model_used: str,
        regeneration_count: int = 0,
    ) -> None:
        """
        Log a failed content generation attempt.

        Args:
            content_record: The GeneratedContent database record
            model_used: Name of the AI model that failed
            regeneration_count: Number of retry attempts made
        """
        self.log(
            content_record=content_record,
            model_used=model_used,
            validation_passed=False,
            char_count=None,
            regeneration_count=regeneration_count,
        )
