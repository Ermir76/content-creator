"""
Custom exceptions for the Content Creator application.
"""


class ContentCreatorException(Exception):
    """Base exception for the application."""

    def __init__(
        self, message: str, code: str = "INTERNAL_ERROR", status_code: int = 500
    ):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(self.message)


class ConfigurationError(ContentCreatorException):
    """Raised when there is a configuration issue."""

    def __init__(self, message: str):
        super().__init__(message, code="CONFIG_ERROR", status_code=500)


class AIProviderError(ContentCreatorException):
    """Raised when an AI provider fails."""

    def __init__(self, message: str):
        super().__init__(message, code="AI_PROVIDER_ERROR", status_code=503)


class ValidationError(ContentCreatorException):
    """Raised when validation fails."""

    def __init__(self, message: str):
        super().__init__(message, code="VALIDATION_ERROR", status_code=400)


class ContentNotFoundError(ContentCreatorException):
    """Raised when requested content is not found."""

    def __init__(self, message: str):
        super().__init__(message, code="CONTENT_NOT_FOUND", status_code=404)
