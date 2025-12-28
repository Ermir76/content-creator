# Multi-AI Model Architecture Implementation Plan

## Architecture Overview

5-component system for quality content generation:

```
User Request
    ↓
[1] Policy Engine → defines quality per platform
    ↓
[2] Model Router → picks primary + fallback model
    ↓
[3] Prompt Adapter → model-specific prompts
    ↓
[4] Output Validator → length/format/tone check
    ↓
[5] Quality Logger → tracks performance
    ↓
Generated Content
```

---

## Implementation Plan

### Phase 1: Add AI Provider Abstraction Layer

**File:** `app/services/ai_provider.py` (new)

Create abstract base class:
```python
class AIProvider(ABC):
    @abstractmethod
    def generate(self, prompt: str) -> str

    @abstractmethod
    def get_name(self) -> str
```

Implement providers:
- `GeminiProvider`
- `OpenAIProvider` (ChatGPT)
- `AnthropicProvider` (Claude)
- `XAIProvider` (Grok)

---

### Phase 2: Policy Engine

**File:** `app/config/platform_policies.py` (new)

Define quality criteria per platform:
```python
PLATFORM_POLICIES = {
    "linkedin": {
        "char_limit": 3000,
        "tone": "professional",
        "format_rules": [...],
        "primary_model": "openai",
        "fallback_model": "gemini"
    },
    "twitter": {
        "char_limit": 280,
        "tone": "punchy",
        "format_rules": [...],
        "primary_model": "xai",  # Grok
        "fallback_model": "openai"
    },
    ...
}
```

---

### Phase 3: Model Router

**File:** `app/services/model_router.py` (new)

```python
class ModelRouter:
    def select_model(self, platform: str) -> (AIProvider, AIProvider):
        # Returns (primary, fallback)
        policy = get_platform_policy(platform)
        primary = create_provider(policy.primary_model)
        fallback = create_provider(policy.fallback_model)
        return primary, fallback
```

---

### Phase 4: Prompt Adapter

**File:** `app/services/prompt_adapter.py` (new)

Different prompt templates per model:
```python
class PromptAdapter:
    def adapt_prompt(self,
                     idea: str,
                     platform: str,
                     model_name: str) -> str:
        # Model-specific prompt engineering
        # ChatGPT needs structured prompts
        # Claude prefers conversational
        # Grok needs punchy instructions
```

---

### Phase 5: Output Validator

**File:** `app/services/output_validator.py` (new)

```python
class OutputValidator:
    def validate(self, content: str, platform: str) -> ValidationResult:
        # Check length
        # Check format (hashtags, structure)
        # Check tone (basic keyword matching)
        # Return pass/fail + reason
```

If validation fails → regenerate once with fallback model.

---

### Phase 6: Database Migrations (Alembic Setup)

**Setup Alembic first - before any schema changes:**

```bash
pip install alembic
alembic init alembic
```

**File:** `alembic/env.py` (modify)
```python
from app.database import Base
from app.models.models import User, GeneratedContent

target_metadata = Base.metadata
```

**File:** `alembic.ini` (modify)
```ini
sqlalchemy.url = sqlite:///./database.sqlite
```

**Create initial migration:**
```bash
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head
```

Now database is under version control.

---

### Phase 7: Quality Logger

**File:** `app/models/models.py` (modify)

Add to `GeneratedContent` model:
```python
model_used = Column(String)  # which AI generated this
validation_passed = Column(Boolean, default=True)
regeneration_count = Column(Integer, default=0)
char_count = Column(Integer)
```

**Create migration:**
```bash
alembic revision --autogenerate -m "Add quality tracking columns"
alembic upgrade head
```

**File:** `app/services/quality_logger.py` (new)

Simple logging:
```python
def log_generation(platform, model, validation_result):
    # Save to DB
    # Can analyze later which models perform best
```

---

### Phase 8: Error Handling & Resilience

**File:** `app/services/circuit_breaker.py` (new)

Circuit breaker pattern for failing models:
```python
class CircuitBreaker:
    def __init__(self, failure_threshold=3, timeout=300):
        self.failures = {}  # model_name -> failure_count
        self.opened_at = {}  # model_name -> timestamp

    def is_available(self, model_name: str) -> bool:
        # Check if circuit is open (model marked as down)
        if model_name in self.opened_at:
            # Auto-recover after 5 minutes
            if time.time() - self.opened_at[model_name] > 300:
                self.reset(model_name)
                return True
            return False
        return True

    def record_failure(self, model_name: str):
        self.failures[model_name] = self.failures.get(model_name, 0) + 1
        if self.failures[model_name] >= 3:
            self.opened_at[model_name] = time.time()

    def record_success(self, model_name: str):
        self.failures[model_name] = 0
```

**File:** `app/services/retry_handler.py` (new)

Smart retry logic:
```python
class RetryHandler:
    @staticmethod
    def should_retry(error) -> (bool, int):
        # Returns (should_retry, wait_seconds)
        if "rate limit" in str(error).lower():
            return True, 60
        if "timeout" in str(error).lower():
            return True, 5
        if "network" in str(error).lower():
            return True, 3
        if "api key" in str(error).lower():
            return False, 0  # Don't retry invalid key
        return True, 2  # Default retry with 2s wait
```

**File:** `app/models/response_models.py` (new)

Structured response models:
```python
class PlatformResult(BaseModel):
    platform: str
    success: bool
    content: Optional[str] = None
    model_used: Optional[str] = None
    error: Optional[str] = None
    error_code: Optional[str] = None
    char_count: Optional[int] = None

class GenerationResponse(BaseModel):
    results: List[PlatformResult]
    success_count: int
    failure_count: int
    total_platforms: int
```

---

### Phase 9: Orchestration Service

**File:** `app/services/content_generator.py` (replace gemini_service.py)

Professional orchestration with error handling:
```python
circuit_breaker = CircuitBreaker()

def generate_content(idea: str, platforms: List[str]) -> GenerationResponse:
    results = []

    for platform in platforms:
        result = generate_for_platform(idea, platform)
        results.append(result)

    success_count = sum(1 for r in results if r.success)

    return GenerationResponse(
        results=results,
        success_count=success_count,
        failure_count=len(results) - success_count,
        total_platforms=len(results)
    )

def generate_for_platform(idea: str, platform: str) -> PlatformResult:
    try:
        # 1. Get policy
        policy = PolicyEngine.get_policy(platform)

        # 2. Route to model
        primary, fallback = ModelRouter.select_model(platform)

        # 3. Check circuit breaker
        if not circuit_breaker.is_available(primary.name):
            primary = fallback  # Skip to fallback if primary is down

        # 4. Try primary model with retry
        content, model_used = try_generate_with_retry(
            idea, platform, primary, fallback
        )

        # 5. Validate
        validation = OutputValidator.validate(content, platform)

        # 6. Record success
        circuit_breaker.record_success(model_used)

        # 7. Log quality
        QualityLogger.log(platform, model_used, validation)

        return PlatformResult(
            platform=platform,
            success=True,
            content=content,
            model_used=model_used,
            char_count=len(content)
        )

    except Exception as e:
        # Log error
        logger.error(f"Failed to generate for {platform}: {e}")

        return PlatformResult(
            platform=platform,
            success=False,
            error=str(e),
            error_code=classify_error(e)
        )

def try_generate_with_retry(idea, platform, primary, fallback):
    models = [primary, fallback]

    for model in models:
        for attempt in range(2):  # Max 2 attempts per model
            try:
                prompt = PromptAdapter.adapt(idea, platform, model.name)
                content = model.generate(prompt)

                # Validate before returning
                validation = OutputValidator.validate(content, platform)
                if validation.passed:
                    return content, model.name

            except Exception as e:
                should_retry, wait_time = RetryHandler.should_retry(e)

                if should_retry and attempt == 0:
                    time.sleep(wait_time)
                    continue
                else:
                    circuit_breaker.record_failure(model.name)
                    break  # Try next model

    raise Exception("All models failed")

def classify_error(error) -> str:
    error_str = str(error).lower()
    if "rate limit" in error_str:
        return "RATE_LIMIT"
    if "timeout" in error_str:
        return "TIMEOUT"
    if "api key" in error_str:
        return "INVALID_API_KEY"
    if "network" in error_str:
        return "NETWORK_ERROR"
    return "UNKNOWN_ERROR"
```

---

### Phase 10: Frontend Updates

**File:** `frontend/src/App.tsx` (modify)

Handle partial success responses:
```tsx
interface PlatformResult {
  platform: string;
  success: boolean;
  content?: string;
  model_used?: string;
  error?: string;
  error_code?: string;
}

const handleGenerate = async (ideaPrompt: string, platforms: string[]) => {
  try {
    const response = await axios.post('/content/generate', {
      idea_prompt: ideaPrompt,
      platforms: platforms,
    });

    const { results, success_count, failure_count } = response.data;

    // Show results (both success and failures)
    setGeneratedContent(results);

    // Show summary toast
    if (failure_count === 0) {
      toast.success(`Generated ${success_count} posts successfully!`);
    } else if (success_count === 0) {
      toast.error('All platforms failed. Check errors below.');
    } else {
      toast.warning(`${success_count} succeeded, ${failure_count} failed`);
    }
  } catch (err) {
    // Only network/server errors reach here
    toast.error('Cannot connect to server');
  }
};
```

**File:** `frontend/src/components/GeneratedContentCard.tsx` (modify)

Handle both success and error states:
```tsx
interface GeneratedContentCardProps {
  platform: string;
  success: boolean;
  content?: string;
  model_used?: string;
  error?: string;
  error_code?: string;
  createdAt?: string;
  onRetry?: (platform: string) => void;
}

export function GeneratedContentCard({
  platform, success, content, model_used, error, error_code, onRetry
}: GeneratedContentCardProps) {
  if (!success) {
    // Error card
    return (
      <Card className="border-destructive">
        <CardHeader>
          <Badge variant="destructive">{platform}</Badge>
          <CardTitle className="text-destructive">Generation Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
          {error_code === 'RATE_LIMIT' && (
            <p className="text-sm mt-2">Try again in 60 seconds</p>
          )}
          {onRetry && (
            <Button onClick={() => onRetry(platform)} className="mt-4">
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Success card (existing code + model badge)
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <Badge>{platform}</Badge>
          <Badge variant="secondary">via {model_used}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* existing content display */}
      </CardContent>
    </Card>
  );
}
```

---

## Critical Files to Modify

**Backend:**
- `app/services/gemini_service.py` → delete, replace with `content_generator.py`
- `app/main.py` → update imports, change response model
- `app/models/models.py` → add quality tracking columns
- `app/.env` → add API keys for all models

**Backend - New Files:**
- `app/services/ai_provider.py` → AI abstraction
- `app/services/circuit_breaker.py` → resilience pattern
- `app/services/retry_handler.py` → retry logic
- `app/models/response_models.py` → structured responses
- `app/config/platform_policies.py` → platform configs
- `app/services/model_router.py` → model selection
- `app/services/prompt_adapter.py` → prompt engineering
- `app/services/output_validator.py` → validation
- `app/services/quality_logger.py` → quality tracking

**Frontend:**
- `frontend/src/App.tsx` → handle partial success
- `frontend/src/components/GeneratedContentCard.tsx` → error states + model badge

---

## Environment Variables Needed

```env
# Existing
GOOGLE_API_KEY=...

# New
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
XAI_API_KEY=...
```

---

## Platform Support

Add Facebook and TikTok:

**Backend:** `app/config/platform_policies.py`
```python
"facebook": {
    "char_limit": 63206,
    "tone": "casual-professional",
    "primary_model": "openai",
    "fallback_model": "gemini"
},
"tiktok": {
    "char_limit": 2200,
    "tone": "energetic",
    "primary_model": "xai",  # Punchy like Twitter
    "fallback_model": "openai"
}
```

**Frontend:** `frontend/src/components/ContentComposer.tsx`
Add to PLATFORMS array.

---

## Dependencies to Add

**Backend requirements.txt:**
```
alembic>=1.13.0
openai>=1.0.0
anthropic>=0.20.0
xai-sdk>=0.1.0  # or requests if no official SDK
```

---

## Implementation Order

1. **Setup Alembic** (database migrations)
2. Create initial migration for current schema
3. Create structured response models (`response_models.py`)
4. Create AI provider abstraction (`ai_provider.py`)
5. Implement 4 providers (Gemini, OpenAI, Anthropic, XAI)
6. Create platform policies config (`platform_policies.py`)
7. Build model router (`model_router.py`)
8. Build prompt adapter (`prompt_adapter.py`)
9. Build output validator (`output_validator.py`)
10. Build circuit breaker (`circuit_breaker.py`)
11. Build retry handler (`retry_handler.py`)
12. Add quality tracking columns to models
13. Create migration for quality columns
14. Add quality logger (`quality_logger.py`)
15. Build main orchestration with error handling (`content_generator.py`)
16. Update API endpoint in `main.py`
17. Update frontend App.tsx for partial success
18. Update GeneratedContentCard for error states
19. Add Facebook + TikTok platform support
20. Test all error scenarios
21. Test with all models

---

## Estimated Effort

- Alembic setup: 30 mins
- Backend core architecture: 4-6 hours
- Provider implementations: 2-3 hours
- Error handling & resilience: 2-3 hours
- Database migration: 30 mins
- Frontend updates: 2 hours
- Testing (error scenarios + models): 3 hours

**Total: ~14-16 hours**

---

## Quality Improvements Expected

Based on research:
- Twitter: 14-18% better engagement with Grok
- LinkedIn: More structured with ChatGPT
- Reddit: More natural with Claude
- Instagram: Visual-focused with Gemini

This is a real quality upgrade, not just feature bloat.
