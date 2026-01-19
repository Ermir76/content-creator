# Social Media Content Generator

AI-powered content generation with a 4-stage pipeline: Generator, Critic, Improver, and Blind Judge.

## Features

- **4-Stage Pipeline** - Generator → Critic → Improver → Judge (blind evaluation)
- **Multi-Provider Support** - Gemini, OpenAI, Anthropic, X.AI
- **Per-Stage Model Selection** - Choose different models for each pipeline stage
- **Circuit Breaker** - Automatic failure detection and fallback
- **Platform Optimization** - LinkedIn, Twitter, Reddit, Instagram, Facebook, TikTok

## Tech Stack

**Backend:** FastAPI, SQLAlchemy, SQLite, Python 3.8+
**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Shadcn/UI

## Quick Start

### 1. Clone & Setup

```bash
git clone https://github.com/Ermir76/content-creator.git
cd content-creator

# Backend
pip install -r requirements.txt

# Frontend
cd frontend && npm install
```

### 2. Configure API Keys

Create `.env` in project root:

```env
GEMINI_API_KEY=your_key
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
GROK_API_KEY=your_key
```

### 3. Run

```bash
# Terminal 1 - Backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend && npm run dev
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173

## AI Models

| Provider | Model | Default For |
|----------|-------|-------------|
| Google | `gemini-3-flash-preview` | Generator, Judge |
| OpenAI | `gpt-5-mini` | Critic, Improver |
| Anthropic | `claude-haiku-4-5` | Available |
| X.AI | `grok-4-1-fast-reasoning` | Available |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/health` | Health status |
| `GET` | `/platforms` | List available platforms |
| `POST` | `/content/generate` | Generate content |
| `POST` | `/content/save` | Save content |
| `GET` | `/content` | Get all content |
| `PUT` | `/content/{id}` | Update content |
| `DELETE` | `/content/{id}` | Delete content |
| `GET` | `/preferences/` | Get user preferences |
| `POST` | `/preferences/` | Update preferences |
| `GET` | `/circuit-breaker/status` | Check model availability |
| `POST` | `/circuit-breaker/reset/{model}` | Reset failed model |

## Project Structure

```
content-creator/
├── app/
│   ├── api/               # API routes
│   ├── core/              # Config, policy, database
│   ├── models/            # SQLAlchemy & Pydantic models
│   ├── providers/         # AI provider integrations
│   ├── repositories/      # Database operations
│   ├── services/
│   │   ├── pipeline/      # Generator, Critic, Improver, Judge
│   │   ├── orchestrate.py # Pipeline orchestration
│   │   └── content.py     # Content service
│   └── utils/             # Resilience, validation
├── frontend/
│   └── src/
│       ├── components/    # React components
│       └── types/         # TypeScript types
├── .env                   # API keys (gitignored)
└── requirements.txt
```

## Pipeline Flow

```
User Input
    ↓
Generator (v1) → Creates initial draft
    ↓
Critic (v2) → Reviews and critiques
    ↓
Improver (v3) → Refines based on critique
    ↓
Judge → Blind evaluation of v1, v2, v3
    ↓
Winner selected
```

## Author

**Ermir76** - [@Ermir76](https://github.com/Ermir76)
