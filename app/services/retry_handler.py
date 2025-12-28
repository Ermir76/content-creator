"""Retry logic for handling transient failures."""

from typing import Tuple


class RetryHandler:
    """Determines retry behavior for different error types."""

    @staticmethod
    def should_retry(error: Exception) -> Tuple[bool, int]:
        """
        Determine if an error should be retried and how long to wait.

        Args:
            error: Exception that occurred

        Returns:
            Tuple of (should_retry: bool, wait_seconds: int)
        """
        error_str = str(error).lower()

        # Rate limit errors - retry after waiting
        if "rate limit" in error_str or "429" in error_str or "quota" in error_str:
            return True, 60  # Wait 60 seconds

        # Timeout errors - retry with shorter wait
        if "timeout" in error_str or "timed out" in error_str:
            return True, 5  # Wait 5 seconds

        # Network errors - retry quickly
        if any(keyword in error_str for keyword in ["network", "connection", "unreachable", "503", "502"]):
            return True, 3  # Wait 3 seconds

        # Authentication errors - don't retry (won't fix itself)
        if any(keyword in error_str for keyword in ["api key", "authentication", "unauthorized", "401", "403"]):
            return False, 0  # Don't retry

        # Server errors - retry with moderate wait
        if "500" in error_str or "internal server error" in error_str:
            return True, 10  # Wait 10 seconds

        # Default: retry with short wait for unknown errors
        return True, 2  # Wait 2 seconds
