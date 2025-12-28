# Multi-AI Architecture Implementation Tasks

## Phase 1: Database Migrations Setup

### 1.1 Install Alembic
- [x] Add `alembic>=1.13.0` to requirements.txt
- [x] Run `pip install alembic`

### 1.2 Initialize Alembic
- [x] Run `alembic init alembic`
- [x] Verify `alembic/` directory created
- [x] Verify `alembic.ini` file created

### 1.3 Configure Alembic
- [x] Edit `alembic/env.py`:
  - [x] Import `from app.database import Base`
  - [x] Import `from app.models.models import User, GeneratedContent`
  - [x] Set `target_metadata = Base.metadata`
- [x] Edit `alembic.ini`:
  - [x] Set `sqlalchemy.url = sqlite:///./database.sqlite`

### 1.4 Create Initial Migration
- [x] Run `alembic revision --autogenerate -m "Initial schema"`
- [x] Review generated migration file in `alembic/versions/`
- [x] Run `alembic upgrade head`
- [x] Verify database schema matches current models

---

## Phase 2: Response Models

### 2.1 Create Response Models File
- [x] Create `app/models/response_models.py`

### 2.2 Define PlatformResult Model
- [x] Import Pydantic BaseModel and Optional
- [x] Create `PlatformResult` class with fields:
  - [x] platform: str
  - [x] success: bool
  - [x] content: Optional[str]
  - [x] model_used: Optional[str]
  - [x] error: Optional[str]
  - [x] error_code: Optional[str]
  - [x] char_count: Optional[int]

### 2.3 Define GenerationResponse Model
- [x] Create `GenerationResponse` class with fields:
  - [x] results: List[PlatformResult]
  - [x] success_count: int
  - [x] failure_count: int
  - [x] total_platforms: int

---

## Phase 3: AI Provider Abstraction

### 3.1 Create AI Provider Base Class
- [x] Create `app/services/ai_provider.py`
- [x] Import ABC and abstractmethod
- [x] Define abstract `AIProvider` class:
  - [x] Abstract method `generate(prompt: str) -> str`
  - [x] Abstract method `get_name() -> str`

### 3.2 Implement GeminiProvider
- [x] Create `GeminiProvider` class inheriting from `AIProvider`
- [x] Initialize with API key from environment
- [x] Implement `generate()` method
- [x] Implement `get_name()` returning "gemini"
- [x] Add error handling for API calls

### 3.3 Implement OpenAIProvider (ChatGPT)
- [x] Add `openai>=1.0.0` to requirements.txt
- [ ] Install: `pip install openai` (will install when API key is added)
- [x] Create `OpenAIProvider` class
- [x] Initialize OpenAI client with API key
- [x] Implement `generate()` using GPT-4o-mini
- [x] Implement `get_name()` returning "openai"
- [x] Add error handling

### 3.4 Implement AnthropicProvider (Claude)
- [x] Add `anthropic>=0.20.0` to requirements.txt
- [ ] Install: `pip install anthropic` (will install when API key is added)
- [x] Create `AnthropicProvider` class
- [x] Initialize Anthropic client with API key
- [x] Implement `generate()` using Claude 3.5 Haiku
- [x] Implement `get_name()` returning "anthropic"
- [x] Add error handling

### 3.5 Implement XAIProvider (Grok)
- [x] Research Grok API documentation (uses OpenAI-compatible API)
- [x] Add SDK to requirements.txt (using openai SDK)
- [x] Create `XAIProvider` class
- [x] Initialize client with API key
- [x] Implement `generate()` method
- [x] Implement `get_name()` returning "xai"
- [x] Add error handling

### 3.6 Create Provider Factory
- [x] Add `create_provider(model_name: str) -> AIProvider` function
- [x] Map model names to provider classes
- [x] Handle unknown model names

---

## Phase 4: Platform Policies Configuration

### 4.1 Create Config Directory
- [x] Create `app/config/` directory
- [x] Create `app/config/__init__.py`

### 4.2 Define Platform Policies
- [x] Create `app/config/platform_policies.py`
- [x] Define `PLATFORM_POLICIES` dictionary with:
  - [x] LinkedIn config (char_limit: 3000, tone: professional, primary: openai, fallback: gemini)
  - [x] Twitter config (char_limit: 280, tone: punchy, primary: xai, fallback: openai)
  - [x] Reddit config (char_limit: 40000, tone: conversational, primary: anthropic, fallback: gemini)
  - [x] Instagram config (char_limit: 2200, tone: visual, primary: gemini, fallback: openai)
  - [x] Facebook config (char_limit: 63206, tone: casual-professional, primary: openai, fallback: gemini)
  - [x] TikTok config (char_limit: 2200, tone: energetic, primary: xai, fallback: openai)

### 4.3 Add Helper Functions
- [x] Create `get_platform_policy(platform: str)` function
- [x] Add validation for unknown platforms
- [x] Return default policy for unsupported platforms

---

## Phase 5: Model Router

### 5.1 Create Model Router File
- [x] Create `app/services/model_router.py`

### 5.2 Implement ModelRouter Class
- [x] Import platform policies
- [x] Import AI provider factory
- [x] Create `ModelRouter` class

### 5.3 Implement Model Selection
- [x] Create `select_model(platform: str)` method
- [x] Fetch platform policy
- [x] Create primary provider instance
- [x] Create fallback provider instance
- [x] Return tuple (primary, fallback)

---

## Phase 6: Prompt Adapter

### 6.1 Create Prompt Adapter File
- [x] Create `app/services/prompt_adapter.py`

### 6.2 Define Prompt Templates
- [x] Create prompt template for OpenAI (structured format)
- [x] Create prompt template for Anthropic (conversational format)
- [x] Create prompt template for XAI (punchy format)
- [x] Create prompt template for Gemini (current format)

### 6.3 Implement PromptAdapter Class
- [x] Create `PromptAdapter` class
- [x] Implement `adapt_prompt(idea, platform, model_name)` method
- [x] Fetch platform policy
- [x] Select appropriate template based on model
- [x] Format prompt with idea, platform specs, tone
- [x] Return formatted prompt string

---

## Phase 7: Output Validator

### 7.1 Create Validator File
- [x] Create `app/services/output_validator.py`

### 7.2 Define ValidationResult Class
- [x] Create `ValidationResult` dataclass with:
  - [x] passed: bool
  - [x] reason: Optional[str]
  - [x] char_count: Optional[int]

### 7.3 Implement OutputValidator Class
- [x] Create `OutputValidator` class
- [x] Implement `validate(content, platform)` method:
  - [x] Check character count against platform limit
  - [x] Check basic format (hashtags present if required)
  - [x] Check tone keywords (platform-specific validation)
  - [x] Return ValidationResult

---

## Phase 8: Circuit Breaker

### 8.1 Create Circuit Breaker File
- [x] Create `app/services/circuit_breaker.py`

### 8.2 Implement CircuitBreaker Class
- [x] Initialize with failure_threshold=3, timeout=300
- [x] Add `failures` dict (model_name -> count)
- [x] Add `opened_at` dict (model_name -> timestamp)

### 8.3 Implement Circuit Breaker Methods
- [x] Implement `is_available(model_name)`:
  - [x] Check if circuit is open
  - [x] Check if timeout expired (auto-recover)
  - [x] Return bool
- [x] Implement `record_failure(model_name)`:
  - [x] Increment failure count
  - [x] Open circuit if threshold reached
- [x] Implement `record_success(model_name)`:
  - [x] Reset failure count to 0
- [x] Implement `reset(model_name)`:
  - [x] Clear failure count
  - [x] Remove from opened_at

---

## Phase 9: Retry Handler

### 9.1 Create Retry Handler File
- [x] Create `app/services/retry_handler.py`

### 9.2 Implement RetryHandler Class
- [x] Create static method `should_retry(error) -> (bool, int)`
- [x] Check for "rate limit" → return (True, 60)
- [x] Check for "timeout" → return (True, 5)
- [x] Check for "network" → return (True, 3)
- [x] Check for "api key" → return (False, 0)
- [x] Default → return (True, 2)

---

## Phase 10: Quality Tracking

### 10.1 Update Database Models
- [ ] Edit `app/models/models.py`
- [ ] Add to GeneratedContent model:
  - [ ] `model_used = Column(String)`
  - [ ] `validation_passed = Column(Boolean, default=True)`
  - [ ] `regeneration_count = Column(Integer, default=0)`
  - [ ] `char_count = Column(Integer)`

### 10.2 Create Migration
- [ ] Run `alembic revision --autogenerate -m "Add quality tracking columns"`
- [ ] Review migration file
- [ ] Run `alembic upgrade head`
- [ ] Verify new columns in database

### 10.3 Create Quality Logger
- [ ] Create `app/services/quality_logger.py`
- [ ] Create `QualityLogger` class
- [ ] Implement `log(platform, model_used, validation)` method
- [ ] Store metrics in database

---

## Phase 11: Main Orchestration Service

### 11.1 Create Content Generator File
- [ ] Create `app/services/content_generator.py`
- [ ] Import all dependencies (providers, router, adapter, validator, etc.)

### 11.2 Implement Error Classification
- [ ] Create `classify_error(error) -> str` function
- [ ] Classify rate limit errors
- [ ] Classify timeout errors
- [ ] Classify API key errors
- [ ] Classify network errors
- [ ] Return error codes

### 11.3 Implement Retry Logic
- [ ] Create `try_generate_with_retry(idea, platform, primary, fallback)` function
- [ ] Loop through models (primary, then fallback)
- [ ] For each model, attempt 2 times
- [ ] Use RetryHandler for wait times
- [ ] Validate output before returning
- [ ] Record circuit breaker failures
- [ ] Raise exception if all fail

### 11.4 Implement Platform Generation
- [ ] Create `generate_for_platform(idea, platform) -> PlatformResult` function
- [ ] Get platform policy
- [ ] Select models via router
- [ ] Check circuit breaker
- [ ] Try generation with retry
- [ ] Validate output
- [ ] Record success/failure
- [ ] Log quality metrics
- [ ] Return PlatformResult (success or error)

### 11.5 Implement Main Generation Function
- [ ] Create `generate_content(idea, platforms) -> GenerationResponse` function
- [ ] Initialize circuit breaker
- [ ] Loop through platforms
- [ ] Call `generate_for_platform` for each
- [ ] Collect all results
- [ ] Count successes and failures
- [ ] Return GenerationResponse

---

## Phase 12: Update API Endpoint

### 12.1 Update main.py Imports
- [ ] Remove import of `gemini_service`
- [ ] Import `content_generator`
- [ ] Import response models from `app.models.response_models`

### 12.2 Update Generate Endpoint
- [ ] Change response model to `GenerationResponse`
- [ ] Update endpoint to call new `generate_content` function
- [ ] Remove old content saving logic (moved to orchestrator)
- [ ] Handle new response structure

### 12.3 Update Get All Content Endpoint
- [ ] Modify to include new fields (model_used, etc.)
- [ ] Test endpoint returns correct data

### 12.4 Delete Old Service
- [ ] Delete `app/services/gemini_service.py`

---

## Phase 13: Frontend - App.tsx Updates

### 13.1 Update Interfaces
- [ ] Edit `frontend/src/App.tsx`
- [ ] Update `GeneratedContent` interface to match `PlatformResult`:
  - [ ] Add `success: boolean`
  - [ ] Make `content_text` optional
  - [ ] Add `model_used?: string`
  - [ ] Add `error?: string`
  - [ ] Add `error_code?: string`

### 13.2 Update handleGenerate Function
- [ ] Parse response with new structure:
  - [ ] Extract `results`, `success_count`, `failure_count`
- [ ] Set generated content with results array
- [ ] Update toast notifications:
  - [ ] Success: all platforms succeeded
  - [ ] Error: all platforms failed
  - [ ] Warning: partial success

### 13.3 Update Error Handling
- [ ] Only catch network/server errors in catch block
- [ ] Platform-specific errors now in results array

---

## Phase 14: Frontend - GeneratedContentCard Updates

### 14.1 Update Component Interface
- [ ] Edit `frontend/src/components/GeneratedContentCard.tsx`
- [ ] Update props interface:
  - [ ] Add `success: boolean`
  - [ ] Make `content` optional
  - [ ] Add `model_used?: string`
  - [ ] Add `error?: string`
  - [ ] Add `error_code?: string`
  - [ ] Add `onRetry?: (platform: string) => void`

### 14.2 Implement Error Card View
- [ ] Add conditional rendering for `!success`
- [ ] Show error card with:
  - [ ] Destructive border
  - [ ] Platform badge with destructive variant
  - [ ] Error title
  - [ ] Error message
  - [ ] Conditional message for RATE_LIMIT
  - [ ] Retry button (if onRetry provided)

### 14.3 Update Success Card View
- [ ] Keep existing content display
- [ ] Add model badge showing which AI was used
- [ ] Position badges: platform on left, model on right

---

## Phase 15: Platform Support

### 15.1 Add Facebook to Backend
- [ ] Already defined in platform_policies.py (verify)
- [ ] Test Facebook content generation

### 15.2 Add TikTok to Backend
- [ ] Already defined in platform_policies.py (verify)
- [ ] Test TikTok content generation

### 15.3 Add Facebook to Frontend
- [ ] Edit `frontend/src/components/ContentComposer.tsx`
- [ ] Add to PLATFORMS array:
  - [ ] id: 'facebook'
  - [ ] name: 'Facebook'
  - [ ] icon: appropriate icon from lucide-react

### 15.4 Add TikTok to Frontend
- [ ] Add to PLATFORMS array:
  - [ ] id: 'tiktok'
  - [ ] name: 'TikTok'
  - [ ] icon: appropriate icon from lucide-react

---

## Phase 16: Environment Setup

### 16.1 Get API Keys
- [ ] Get OpenAI API key from https://platform.openai.com/api-keys
- [ ] Get Anthropic API key from https://console.anthropic.com/
- [ ] Get X.AI API key (research availability)

### 16.2 Update .env File
- [ ] Add `OPENAI_API_KEY=...`
- [ ] Add `ANTHROPIC_API_KEY=...`
- [ ] Add `XAI_API_KEY=...` (if available)
- [ ] Keep existing `GOOGLE_API_KEY=...`

### 16.3 Verify .env is Gitignored
- [ ] Confirm `.env` in `.gitignore`
- [ ] Never commit API keys

---

## Phase 17: Testing - Error Scenarios

### 17.1 Test Rate Limiting
- [ ] Trigger rate limit error
- [ ] Verify retry after 60 seconds
- [ ] Verify fallback to secondary model
- [ ] Verify error message shown to user

### 17.2 Test Network Errors
- [ ] Simulate network failure
- [ ] Verify retry with 3 second wait
- [ ] Verify circuit breaker opens after 3 failures
- [ ] Verify auto-recovery after 5 minutes

### 17.3 Test Invalid API Key
- [ ] Use invalid API key
- [ ] Verify no retry attempted
- [ ] Verify clear error message
- [ ] Verify error code INVALID_API_KEY

### 17.4 Test Timeout
- [ ] Simulate slow API response
- [ ] Verify retry with 5 second wait
- [ ] Verify fallback model used

### 17.5 Test Validation Failure
- [ ] Generate content exceeding character limit
- [ ] Verify validation fails
- [ ] Verify regeneration with fallback model

### 17.6 Test Partial Success
- [ ] Make one model fail, others succeed
- [ ] Verify partial results returned
- [ ] Verify warning toast shown
- [ ] Verify error cards shown for failed platforms
- [ ] Verify success cards shown for successful platforms

---

## Phase 18: Testing - AI Models

### 18.1 Test Gemini Provider
- [ ] Generate content using Gemini
- [ ] Verify response quality
- [ ] Verify character limits respected

### 18.2 Test OpenAI Provider
- [ ] Generate LinkedIn content (primary: OpenAI)
- [ ] Verify professional tone
- [ ] Verify structured format
- [ ] Compare quality to Gemini

### 18.3 Test Anthropic Provider
- [ ] Generate Reddit content (primary: Claude)
- [ ] Verify conversational tone
- [ ] Verify natural language
- [ ] Compare quality to others

### 18.4 Test XAI Provider (if available)
- [ ] Generate Twitter content (primary: Grok)
- [ ] Verify punchy, concise style
- [ ] Verify engagement-optimized
- [ ] Compare to ChatGPT for Twitter

### 18.5 Test Model Routing
- [ ] Verify LinkedIn uses OpenAI
- [ ] Verify Twitter uses Grok (if available)
- [ ] Verify Reddit uses Claude
- [ ] Verify Instagram uses Gemini
- [ ] Verify fallback works when primary fails

### 18.6 Test All Platforms
- [ ] Generate content for all 6 platforms simultaneously
- [ ] Verify each uses correct model
- [ ] Verify all content meets platform specs
- [ ] Verify quality tracking saved to database

---

## Phase 19: Quality Assurance

### 19.1 Database Verification
- [ ] Check all migrations applied
- [ ] Verify quality tracking columns exist
- [ ] Verify data saves correctly with new fields

### 19.2 Code Quality
- [ ] Run type checking (if using mypy)
- [ ] Fix any linting issues
- [ ] Ensure all imports working

### 19.3 UI/UX Testing
- [ ] Test all toast notifications
- [ ] Test error card display
- [ ] Test success card display
- [ ] Test model badges appear
- [ ] Test retry button functionality

### 19.4 End-to-End Test
- [ ] Start fresh: clear database
- [ ] Generate content for all platforms
- [ ] Verify results displayed correctly
- [ ] Copy content to clipboard
- [ ] Check database has all fields populated

---

## Phase 20: Documentation

### 20.1 Update README
- [ ] Document new AI models supported
- [ ] Document required API keys
- [ ] Update setup instructions
- [ ] Add troubleshooting for new features

### 20.2 Code Documentation
- [ ] Add docstrings to major functions
- [ ] Document error codes
- [ ] Document platform policies

---

## Completion Checklist

- [ ] All 4 AI providers implemented and tested
- [ ] Circuit breaker working correctly
- [ ] Retry logic handling all error types
- [ ] Platform policies configured for 6 platforms
- [ ] Database migrations successful
- [ ] Frontend displays errors and successes
- [ ] Quality tracking saving to database
- [ ] All error scenarios tested
- [ ] All models tested and compared
- [ ] Documentation updated

**Estimated Total Time: 14-16 hours**