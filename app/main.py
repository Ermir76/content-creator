from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.core.database import Base, engine
from app.core.exceptions import ContentCreatorException
from app.api.routes import router as api_router
from app.api.preferences import router as preferences_router

load_dotenv()

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Social Media Content Generator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handler
@app.exception_handler(ContentCreatorException)
async def content_creator_exception_handler(
    request: Request, exc: ContentCreatorException
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.code, "message": exc.message},
    )


# Include the API Router
app.include_router(api_router)
app.include_router(preferences_router)
