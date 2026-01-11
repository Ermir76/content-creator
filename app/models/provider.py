"""
PROVIDER_MODELS.PY
Internal data structures for AI Provider interactions.
Separates internal provider logic from external API schemas.
"""

from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class ProviderMetrics(BaseModel):
    """Metrics for a single AI generation call."""

    input_tokens: int = 0
    output_tokens: int = 0
    latency_ms: float = 0.0
    total_cost: float = 0.0  # Optional: Estimated cost


class ProviderResponse(BaseModel):
    """
    Standardized response from ANY AI Provider.
    """

    content: str
    tool_calls: List[Dict[str, Any]] = Field(default_factory=list)
    metrics: ProviderMetrics = Field(default_factory=ProviderMetrics)

    # Raw response for debugging (optional)
    raw_response: Optional[Any] = None

    # Provider metadata
    provider_name: str
    model_name: str
