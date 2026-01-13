# Code Review

## Critical Bugs

### 1. No Timeout on Gemini Async Calls
**File:** `app/providers/ai_provider.py:78`

```python
response = await active_model.generate_content_async(prompt)
```

No timeout specified. Requests can hang indefinitely if Gemini is slow or rate-limited.

**Fix:** Add timeout:
```python
response = await asyncio.wait_for(
    active_model.generate_content_async(prompt),
    timeout=60.0
)
```

---

## Notable Issues

### 2. Config File Reloaded on Every Request
**File:** `app/services/orchestrate.py:65` → `app/core/policy.py:134`

YAML config is read from disk on every generation request.

**Fix:** Cache config with optional TTL:
```python
_config_cache = None

def load_config(path=None):
    global _config_cache
    if _config_cache is None:
        _config_cache = yaml.safe_load(open(path))
    return _config_cache
```

---

### 3. Policy Merging Double-Application Risk
**File:** `app/core/policy.py:98-115`

Legacy `target_chars` at top level gets moved to `constraints.target_chars`. If it's already in overrides under `constraints`, it could be applied twice.

**Fix:** Check if already in constraints before applying legacy logic.

---

### 4. Pydantic v1 vs v2 Compatibility
**File:** `app/core/policy.py:103`

```python
if hasattr(overrides, "dict"):
    overrides_dict = overrides.dict(exclude_unset=True)
```

Pydantic v2 uses `.model_dump()`, not `.dict()`. Will break if upgraded to Pydantic v2.

**Fix:**
```python
if hasattr(overrides, "model_dump"):
    overrides_dict = overrides.model_dump(exclude_unset=True)
elif hasattr(overrides, "dict"):
    overrides_dict = overrides.dict(exclude_unset=True)
```

---

### 5. Frontend State Lost on Refresh
**File:** `frontend/src/App.tsx:53`

Generated content stored in component state only. Refresh loses all current results.

**Fix:** Save to localStorage or persist immediately to backend.

---

### 6. No Logging
**Entire codebase**

No structured logging. Debugging failures is very difficult.

**Fix:** Add Python logging:
```python
import logging
logger = logging.getLogger(__name__)

# In provider code
logger.info(f"Generating with {provider_name}, model: {model}")
logger.error(f"Generation failed: {error}")
```

---

## Simplification Opportunities

### 7. Remove Unused User Model
**File:** `app/repositories/content_repo.py:4`

```python
def get_or_create_default_user(db: Session) -> User:
    user = db.query(User).first()
    if not user:
        user = User(email="default@example.com", ...)
```

Creates fake default user. Either implement real auth or remove User model entirely.

---


### 8. Unused Fields in Models
**File:** `app/models/provider.py:18-31`

```python
class ProviderResponse(BaseModel):
    tool_calls: List[Dict[str, Any]] = Field(default_factory=list)  # Never used
    raw_response: Optional[Any] = None  # Debug only
```

Remove if not needed.

---

### 9. Large Frontend Component
**File:** `frontend/src/components/GeneratedContentCard.tsx` (330+ lines)

Single component handles errors, success, drafts, copying, saving, modals.

**Fix:** Split into:
- `ErrorCard`
- `SuccessCard`
- `DraftTabs` (reusable)

---

## Architecture Strengths

- Clean separation of pipeline stages (Generator → Critic → Improver → Judge)
- Well-structured dependency injection
- Good async/await usage for concurrent API calls
- Thoughtful circuit breaker implementation
- Comprehensive configuration system with platform overrides
- Good frontend UX with error handling and retry logic

---

## Priority Fixes (in order)

1. **Add Gemini timeout** (prevents hanging)
2. **Add logging** (debugging)
3. **Cache config loading** (performance)

## Optional (only if upgrading Pydantic to v2)
- Fix Pydantic v1/v2 compatibility in policy merging
