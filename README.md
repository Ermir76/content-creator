# Social Media Content Generator

An AI-powered application that generates platform-specific social media content using **multiple AI models** with smart fallback. Simply describe your idea, select your platforms, and get optimized content ready to copy and paste!

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Features

- **Multi-AI Content Generation** - Uses 4 AI providers (Gemini, OpenAI, Claude, X.AI) with automatic fallback
- **Platform-Specific Optimization** - Tailored content for 6 platforms: LinkedIn, Twitter, Reddit, Instagram, Facebook, TikTok
- **Smart Model Routing** - Each platform uses the best-suited AI model as primary
- **Circuit Breaker Pattern** - Automatic failure detection and recovery
- **Quality Tracking** - Logs which model generated content and validation status
- **Toast Notifications** - Beautiful, non-intrusive notifications with Sonner
- **Smart Form Validation** - Real-time validation with helpful error messages
- **Copy to Clipboard** - One-click copy functionality with toast feedback
- **Professional Dark Theme** - Sleek, modern UI with Shadcn/UI components
- **Error Handling** - Per-platform error cards with retry functionality
- **Content History** - All generated content saved with quality metrics

## AI Models

| Provider | Model | Used For |
|----------|-------|----------|
| **Google** | `gemini-3-flash` | LinkedIn, Reddit, Facebook (primary) |
| **OpenAI** | `gpt-5-mini` | Instagram, TikTok (primary) |
| **Anthropic** | `claude-haiku-4-5` | Judge stage only |
| **X.AI** | `grok-4-1-fast-reasoning` | Twitter (primary) |

### Platform → Model Routing

| Platform | Primary | Fallback |
|----------|---------|----------|
| LinkedIn | Gemini | OpenAI |
| Twitter | X.AI | OpenAI |
| Reddit | Gemini | OpenAI |
| Instagram | OpenAI | Gemini |
| Facebook | Gemini | OpenAI |
| TikTok | OpenAI | Gemini |

## Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for Python
- **SQLAlchemy** - SQL toolkit and ORM with Alembic migrations
- **SQLite** - Lightweight database
- **Multi-AI Architecture** - Gemini, OpenAI, Anthropic, X.AI providers
- **Circuit Breaker** - Failure detection and auto-recovery
- **Python 3.8+** - Programming language

### Frontend
- **React 19** - JavaScript library for building user interfaces
- **TypeScript** - Typed superset of JavaScript
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Re-usable component library
- **Sonner** - Toast notification library
- **Axios** - Promise-based HTTP client
- **Lucide React** - Beautiful icon library

## Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.8 or higher**
- **Node.js 18 or higher**
- **npm or yarn**
- **API Keys** (at least one required, all recommended):
  - Gemini API Key ([Google AI Studio](https://makersuite.google.com/app/apikey))
  - OpenAI API Key ([OpenAI Platform](https://platform.openai.com/api-keys))
  - Anthropic API Key ([Anthropic Console](https://console.anthropic.com/))
  - X.AI API Key ([X.AI](https://x.ai/))

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Ermir76/content-creator.git
cd content-creator
```

### 2. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Create .env file with your API keys
# At minimum, add GEMINI_API_KEY. Add others for full functionality.
```

### 3. Configure API Keys

Create a `.env` file in the project root:

```env
# Required: At least one API key
GEMINI_API_KEY=your_gemini_key_here

# Optional: For multi-AI support
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
XAI_API_KEY=your_xai_key_here

# Database (auto-created)
DATABASE_URL=sqlite:///./database.sqlite
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 5. Run the Application

**Terminal 1 - Start Backend:**
```bash
# From project root
uvicorn app.main:app --reload
```
Backend will be available at: `http://localhost:8000`

**Terminal 2 - Start Frontend:**
```bash
# From frontend directory
cd frontend
npm run dev
```
Frontend will be available at: `http://localhost:5173`

## Usage Guide

1. **Open the Application**
   - Navigate to `http://localhost:5173` in your browser

2. **Enter Your Idea**
   - Type your content idea in the textarea
   - Example: "Tips for improving remote work productivity"

3. **Select Platforms**
   - Check one or more platforms (LinkedIn, Twitter, Reddit, Instagram, Facebook, TikTok)
   - Each platform uses its optimal AI model

4. **Generate Content**
   - Click the "Generate Content" button
   - Watch as AI creates platform-specific content
   - See which AI model was used on each card

5. **Copy & Use**
   - Click "Copy to Clipboard" on any generated content card
   - Paste directly into your social media platform

## Project Structure

```
content-creator/
├── app/                          # Backend application
│   ├── core/                     # Core utilities
│   │   ├── platform_defaults.py # Platform policies & hard limits
│   │   ├── policy.py            # Policy merging logic
│   │   └── database.py          # Database configuration
│   ├── models/                   # SQLAlchemy & Pydantic models
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── provider.py
│   │   └── response_models.py
│   ├── services/                 # Business logic
│   │   ├── orchestrate.py       # Orchestrates 4-step pipeline (Generator→Critic→Improver→Judge)
│   │   ├── content.py           # Content generation service
│   │   ├── model_router.py      # Decides: LinkedIn=Gemini, Twitter=X.AI, etc.
│   │   └── pipeline/            # Pipeline stages
│   │       ├── generator.py     # Step 1: Creates initial draft
│   │       ├── critic.py        # Step 2: Reviews and critiques
│   │       ├── improver.py      # Step 3: Refines based on critique
│   │       └── judge.py         # Step 4: Selects best version
│   ├── providers/                # AI provider integrations
│   │   └── ai_provider.py       # OpenAI, Gemini, Claude, X.AI clients
│   ├── utils/                    # Utilities
│   │   ├── resilience.py        # Circuit breaker & retry logic
│   │   └── validation.py        # Output validation
│   └── main.py                   # API routes: /content/generate, etc.
├── alembic/                      # Database migrations
├── frontend/                     # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn/UI components
│   │   │   ├── Layout.tsx
│   │   │   ├── ContentComposer.tsx   # Input form + platform controls
│   │   │   ├── PolicyControls.tsx    # Customization sliders/dropdowns
│   │   │   └── GeneratedContentCard.tsx
│   │   ├── types/
│   │   │   └── policy.ts        # TypeScript types for settings
│   │   ├── App.tsx              # Main app + API calls
│   │   └── main.tsx
│   └── package.json
├── .env                          # Environment variables (gitignored)
├── requirements.txt
└── README.md
```

---

## 🔄 DATA FLOW: How Your Settings Travel Through The System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ContentComposer.tsx                                                        │
│   ├── User enters idea: "Create a post about burnout from LLM"              │
│   ├── User selects platform: LinkedIn ✓                                      │
│   ├── User clicks "Customize" and sets:                                      │
│   │   ├── target_chars: 750                                                  │
│   │   ├── tone: "Storytelling"                                               │
│   │   ├── features: [hashtags, questions, short_paragraphs]                  │
│   │   ├── hook_style: "Anti-pattern"                                         │
│   │   ├── cta_strength: "Soft"                                               │
│   │   └── voice_profile: "humble"                                            │
│   │                                                                          │
│   └── Calls: onGenerate(idea, platforms, platformPolicies)                   │
│                         │                                                    │
└─────────────────────────│────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│   App.tsx                                                                    │
│   ├── handleGenerate() receives the data                                     │
│   └── Sends HTTP POST to /content/generate with:                             │
│       {                                                                      │
│         idea_prompt: "Create a post about burnout from LLM",                 │
│         platforms: ["linkedin"],                                             │
│         platform_policies: {                                                 │
│           "linkedin": { target_chars: 750, tone: "Storytelling", ... }       │
│         }                                                                    │
│       }                                                                      │
└─────────────────────────│────────────────────────────────────────────────────┘
                          │
                          ▼ HTTP POST
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND (FastAPI)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   app/main.py                                                                │
│   ├── Receives request at /content/generate                                  │
│   ├── Validates policy values (target_chars 500-1500, valid tones, etc.)     │
│   └── Calls: generate_multi_platform_content(idea, platforms, policies)      │
│                         │                                                    │
└─────────────────────────│────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│   app/services/content.py                                          │
│   ├── generate_content() - loops through each platform                       │
│   ├── For each platform, extracts that platform's policy:                    │
│   │   policy_override = platform_policies["linkedin"]                        │
│   └── Calls: generate_for_platform(idea, "linkedin", policy_override)        │
│                         │                                                    │
│   ├── For LinkedIn: Uses AgenticFlow (4-step AI pipeline)                    │
│   └── For others: Uses simple try_generate_with_retry                        │
└─────────────────────────│────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│   app/services/orchestrate.py                                               │
│   ├── generate_flow() receives policy_override                               │
│   ├── Gets default policy: get_platform_policy("linkedin")                   │
│   ├── MERGES with user overrides: merge_policies(default, override)          │
│   │   Result: { target_chars: 750, tone: "Storytelling", hook_style: ... }   │
│   │                                                                          │
│   └── Runs 4-step pipeline:                                                  │
│       │                                                                      │
│       ├── STEP 1: GENERATOR                                                  │
│       │   └── Creates initial draft                                          │
│       │                                                                      │
│       ├── STEP 2: CRITIC                                                     │
│       │   └── Reviews and critiques the draft                                │
│       │                                                                      │
│       ├── STEP 3: IMPROVER                                                   │
│       │   └── Refines based on critique                                      │
│       │                                                                      │
│       └── STEP 4: JUDGE (Claude)                                             │
│           └── Selects best version                                           │
└─────────────────────────│────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│   app/services/pipeline/*.py       ⚠️ THE PROMPTS ARE HERE!                  │
│   app/core/policy.py                 build_prompt_instructions()            │
│   │                                                                          │
│   ├── generator.py - Creates initial draft prompt                            │
│   │   └── Uses build_prompt_instructions() from policy.py                    │
│   │   └── Currently uses: char_limit, tone, features, voice                  │
│   │   └── ❌ MISSING: hook_style, cta_strength                               │
│   │                                                                          │
│   ├── critic.py - Reviews and critiques the draft                            │
│   ├── improver.py - Refines based on critique                                │
│   └── judge.py - Selects best version (uses Claude)                          │
└─────────────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│   app/core/platform_defaults.py                                            │
│   ├── PLATFORM_POLICIES - Default settings for each platform                 │
│   │   Example for LinkedIn:                                                  │
│   │   {                                                                      │
│   │     "char_limit": 3000,                                                  │
│   │     "target_chars": 700,                                                 │
│   │     "tone": "direct, human, reflective",                                 │
│   │     "features": "Short paragraphs, no links, hashtags...",               │
│   │   }                                                                      │
│   │                                                                          │
│   ├── get_platform_policy(platform) - Returns default policy                 │
│   │                                                                          │
│   └── merge_policies(default, override) - Combines user settings             │
│       └── User values OVERRIDE defaults when provided                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 FILE DESCRIPTIONS: What Each File Does

### Backend Files (app/)

| File | Purpose | When To Edit |
|------|---------|--------------|
| **main.py** | API endpoints, request validation | Add new API routes, change validation rules |
| **core/platform_defaults.py** | Default policies per platform, `merge_policies()` | Change default char limits, tones, features |
| **services/orchestrate.py** | 4-step AI pipeline (Generator→Critic→Improver→Judge) | Orchestrates content generation |
| **services/pipeline/*.py** | Prompt templates for each pipeline stage | Edit prompts in generator.py, critic.py, improver.py, judge.py |
| **core/policy.py** | Policy merging & prompt instructions | Edit build_prompt_instructions() to add hook_style, cta_strength |
| **services/content.py** | Orchestrates generation, retry logic | Change retry behavior, model fallback |
| **providers/ai_provider.py** | Calls to OpenAI, Gemini, Claude, X.AI APIs | Change AI model versions, API parameters |
| **services/model_router.py** | Which AI model to use per platform | Change LinkedIn→Gemini, Twitter→X.AI etc. |
| **utils/resilience.py** | Circuit breaker & retry logic | Change failure thresholds, retry config |

### Frontend Files (frontend/src/)

| File | Purpose | When To Edit |
|------|---------|--------------|
| **App.tsx** | Main app, API calls, state management | Change how API is called |
| **components/ContentComposer.tsx** | Input form, platform checkboxes, customize button | Add/remove UI controls |
| **components/PolicyControls.tsx** | Slider, dropdowns, checkboxes for settings | Change UI for settings |
| **types/policy.ts** | TypeScript types for settings | Add new setting types |

---

## ⚠️ CURRENT ISSUE: Not All Settings Reach The Prompts

**What's Working:**
- ✅ target_chars → Used in prompts
- ✅ tone → Used in prompts  
- ✅ features → Used in prompts
- ✅ voice_profile → Used in prompts

**What's NOT Working:**
- ❌ hook_style → Merged but NOT in prompt text
- ❌ cta_strength → Merged but NOT in prompt text

**To Fix:** Edit `app/core/policy.py` (build_prompt_instructions function) to include hook_style and cta_strength in the generated prompt instructions.

## Platform Specifications

| Platform | Character Limit | Tone | Primary AI |
|----------|----------------|------|------------|
| **LinkedIn** | 3,000 | Professional & thought-provoking | Gemini |
| **Twitter** | 280 | Concise & engaging | X.AI |
| **Reddit** | 40,000 | Conversational & authentic | Gemini |
| **Instagram** | 2,200 | Visual & inspiring | OpenAI |
| **Facebook** | 63,206 | Casual-professional | Gemini |
| **TikTok** | 2,200 | Energetic & trendy | OpenAI |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/health` | Health status |
| `POST` | `/content/generate` | Generate content for platforms |
| `GET` | `/content` | Get all generated content |
| `GET` | `/circuit-breaker/status` | Check AI model availability |
| `POST` | `/circuit-breaker/reset/{model}` | Reset failed model circuit |

### Generate Content Request

```json
POST /content/generate
{
  "idea_prompt": "Your content idea",
  "platforms": ["linkedin", "twitter", "reddit", "instagram", "facebook", "tiktok"]
}
```

### Response Structure

```json
{
  "results": [
    {
      "platform": "linkedin",
      "success": true,
      "content": "Generated post content...",
      "model_used": "openai",
      "char_count": 1234
    },
    {
      "platform": "twitter",
      "success": false,
      "error": "Rate limit exceeded",
      "error_code": "RATE_LIMIT"
    }
  ],
  "success_count": 5,
  "failure_count": 1,
  "total_platforms": 6
}
```

## Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed: `python --version`
- Verify dependencies: `pip install -r requirements.txt`
- Check if port 8000 is available

### Frontend won't start
- Ensure Node.js 18+ is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check if port 5173 is available

### API Key Issues
- Verify your API keys are valid
- Ensure `.env` file is in the project root
- Restart the backend server after changing `.env`
- Check `/circuit-breaker/status` to see model availability

### Content Generation Fails
- Check which models have valid API keys
- The system automatically falls back to secondary models
- If all models fail, check the error cards for specific reasons

## Current Limitations

- No auto-posting to social media (manual copy-paste required)
- No scheduling functionality
- No OAuth authentication
- Single user only (no multi-user support)

## Future Enhancements

- [ ] Auto-posting to social media platforms
- [ ] Content scheduling system
- [ ] OAuth integration (LinkedIn, Twitter, etc.)
- [ ] Multi-user support with authentication
- [ ] Custom voice profile editor
- [ ] Content analytics and insights
- [ ] A/B testing for content variations

## Contributing

This is a personal project, but suggestions are welcome! Feel free to open issues or reach out.

## License

This project is for educational and personal use.

## Author

**Ermir76**
- GitHub: [@Ermir76](https://github.com/Ermir76)

## Acknowledgments

- [Google Gemini AI](https://deepmind.google/technologies/gemini/)
- [OpenAI](https://openai.com/)
- [Anthropic Claude](https://anthropic.com/)
- [X.AI Grok](https://x.ai/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Lucide Icons](https://lucide.dev/)

---

Built with FastAPI, React, and Multi-AI Architecture (Gemini, OpenAI, Claude, X.AI)
