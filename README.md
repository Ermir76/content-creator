# Social Media Content Generator

An AI-powered application that generates platform-specific social media content using **multiple AI models** with smart fallback. Simply describe your idea, select your platforms, and get optimized content ready to copy and paste!

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Features

- **Multi-AI Content Generation** - Uses 4 AI models (Gemini, GPT-5, Claude, Grok) with automatic fallback
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
| **Google** | `gemini-3-flash` | Instagram (primary), Fallback for LinkedIn/Reddit |
| **OpenAI** | `gpt-5-mini` | LinkedIn/Facebook (primary), Fallback for Twitter/TikTok |
| **Anthropic** | `claude-haiku-4-5` | Reddit (primary) - Natural conversation |
| **X.AI** | `grok-4-1-fast-reasoning` | Twitter/TikTok (primary) - Punchy content |

### Platform → Model Routing

| Platform | Primary Model | Fallback Model |
|----------|---------------|----------------|
| LinkedIn | GPT-5 | Gemini |
| Twitter | Grok | GPT-5 |
| Reddit | Claude | Gemini |
| Instagram | Gemini | GPT-5 |
| Facebook | GPT-5 | Gemini |
| TikTok | Grok | GPT-5 |

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
│   ├── config/                   # Platform policies & routing
│   │   └── platform_policies.py
│   ├── database/                 # Database configuration
│   │   └── database.py
│   ├── models/                   # SQLAlchemy & Pydantic models
│   │   ├── models.py
│   │   └── response_models.py
│   ├── services/                 # Business logic
│   │   ├── ai_provider.py       # Multi-AI provider abstraction
│   │   ├── content_generator.py # Main orchestration service
│   │   ├── circuit_breaker.py   # Failure detection
│   │   ├── model_router.py      # Platform → model routing
│   │   ├── prompt_adapter.py    # Model-specific prompts
│   │   ├── output_validator.py  # Content validation
│   │   ├── retry_handler.py     # Retry logic
│   │   └── quality_logger.py    # Metrics logging
│   └── main.py                   # FastAPI app entry point
├── alembic/                      # Database migrations
├── frontend/                     # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn/UI components
│   │   │   ├── Layout.tsx
│   │   │   ├── ContentComposer.tsx
│   │   │   └── GeneratedContentCard.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── .env                          # Environment variables (gitignored)
├── requirements.txt
└── README.md
```

## Platform Specifications

| Platform | Character Limit | Tone | Primary AI |
|----------|----------------|------|------------|
| **LinkedIn** | 3,000 | Professional & thought-provoking | GPT-5 |
| **Twitter** | 280 | Concise & engaging | Grok |
| **Reddit** | 3,000 | Conversational & authentic | Claude |
| **Instagram** | 2,200 | Visual & inspiring | Gemini |
| **Facebook** | 3,000 | Casual-professional | GPT-5 |
| **TikTok** | 2,200 | Energetic & trendy | Grok |

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

Built with FastAPI, React, and Multi-AI Architecture (Gemini, GPT-5, Claude, Grok)
