# Social Media Content Generator

An AI-powered application that generates platform-specific social media content using Google Gemini AI. Simply describe your idea, select your platforms, and get optimized content ready to copy and paste!

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Features

- **AI-Powered Content Generation** - Uses Google Gemini 2.0 Flash for intelligent content creation
- **Platform-Specific Optimization** - Tailored content for LinkedIn, Twitter, Reddit, and Instagram
- **Toast Notifications** - Beautiful, non-intrusive notifications with Sonner
- **Smart Form Validation** - Real-time validation with helpful error messages
- **Copy to Clipboard** - One-click copy functionality with toast feedback
- **Professional Dark Theme** - Sleek, modern UI with Shadcn/UI components
- **Enhanced Loading States** - Smooth animations and loading indicators
- **Engaging Empty States** - Helpful guidance when starting out
- **Error Handling** - Comprehensive error messages with retry functionality
- **Content History** - All generated content is saved to database
- **Smooth Animations** - Fade-in effects and transitions throughout

## Videolink



## Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for Python
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **Google Gemini AI** - Advanced language model for content generation
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
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

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

# Create .env file and add your Google API Key
# The file should already exist, just add your key:
GOOGLE_API_KEY=your_api_key_here
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 4. Run the Application

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
   - Check one or more platforms (LinkedIn, Twitter, Reddit, Instagram)
   - Each platform has specific character limits and formatting

4. **Generate Content**
   - Click the "Generate Content" button
   - Wait for AI to create platform-specific content

5. **Copy & Use**
   - Click "Copy to Clipboard" on any generated content card
   - Paste directly into your social media platform

## Project Structure

```
content-creator/
├── app/                          # Backend application
│   ├── database/                 # Database configuration
│   │   ├── __init__.py
│   │   └── database.py
│   ├── models/                   # SQLAlchemy models
│   │   └── models.py
│   ├── services/                 # Business logic
│   │   └── gemini_service.py
│   └── main.py                   # FastAPI app entry point
├── frontend/                     # React application
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── ui/              # Shadcn/UI components
│   │   │   ├── Layout.tsx
│   │   │   ├── ContentComposer.tsx
│   │   │   └── GeneratedContentCard.tsx
│   │   ├── lib/                 # Utilities
│   │   ├── App.tsx              # Main app component
│   │   ├── main.tsx             # Entry point
│   │   └── style.css            # Global styles
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── .env                          # Environment variables
├── .gitignore
├── requirements.txt              # Python dependencies
└── README.md
```

## Platform Specifications

| Platform | Character Limit | Tone | Special Features |
|----------|----------------|------|------------------|
| **LinkedIn** | 3,000 | Professional & thought-provoking | 3-5 hashtags, line breaks for readability |
| **Twitter** | 280 | Concise & engaging | 1-2 hashtags, every word counts |
| **Reddit** | 40,000 | Conversational & authentic | No corporate speak, encourage discussion |
| **Instagram** | 2,200 | Visual & inspiring | 10-15 hashtags, emojis, line breaks |

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Database Configuration
DATABASE_URL=sqlite:///./database.sqlite

# Google Gemini API Key
GOOGLE_API_KEY=your_actual_api_key_here
```

### API Endpoints

- `GET /` - Health check
- `POST /content/generate` - Generate platform-specific content
  ```json
  {
    "idea_prompt": "Your content idea",
    "platforms": ["linkedin", "twitter", "reddit", "instagram"]
  }
  ```
- `GET /content` - Retrieve all generated content

## Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed: `python --version`
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check if port 8000 is available

### Frontend won't start
- Ensure Node.js 18+ is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check if port 5173 is available

### API Key Issues
- Verify your API key is valid at [Google AI Studio](https://makersuite.google.com/)
- Ensure `.env` file is in the project root
- Restart the backend server after changing `.env`

### Content Generation Fails
- Check backend console for error messages
- Verify internet connection (API calls to Google)
- Ensure API key has sufficient quota

## Current Limitations (MVP)

- No auto-posting to social media (manual copy-paste required)
- No scheduling functionality
- No OAuth authentication
- Single user only (no multi-user support)
- No advanced voice profile customization

## Future Enhancements

- [ ] Auto-posting to social media platforms
- [ ] Content scheduling system
- [ ] OAuth integration (LinkedIn, Twitter, etc.)
- [ ] Multi-user support with authentication
- [ ] Custom voice profile editor
- [ ] Content analytics and insights
- [ ] A/B testing for content variations
- [ ] Content calendar view
- [ ] Export to CSV/PDF

## Contributing

This is a personal MVP project, but suggestions are welcome! Feel free to open issues or reach out.

## License

This project is for educational and personal use.

## Author

**Ermir76**
- GitHub: [@Ermir76](https://github.com/Ermir76)

## Acknowledgments

- [Google Gemini AI](https://deepmind.google/technologies/gemini/) for the powerful language model
- [Shadcn/UI](https://ui.shadcn.com/) for the beautiful component library
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent Python framework
- [Lucide Icons](https://lucide.dev/) for the icon set

---

Built with FastAPI, React, and Google Gemini AI
