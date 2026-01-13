from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.models.schemas import UserPreferenceResponse, UserPreferenceUpdate
from app.repositories import preferences_repo

router = APIRouter(prefix="/preferences", tags=["User Preferences"])


@router.get("/", response_model=UserPreferenceResponse)
async def get_preferences(db: Session = Depends(get_db)):
    """Get current user preferences."""
    # Assuming single user (ID 1) for now as per plan
    return preferences_repo.get_preferences(db, user_id=1)


@router.post("/", response_model=UserPreferenceResponse)
async def update_preferences(
    preferences: UserPreferenceUpdate, db: Session = Depends(get_db)
):
    """Update user preferences."""
    # Assuming single user (ID 1) for now
    return preferences_repo.update_preferences(db, preferences, user_id=1)


@router.get("/platform/{platform}")
async def get_platform_config(platform: str):
    """Get hard limits for a specific platform."""
    from app.core.platform_defaults import get_platform_policy

    return get_platform_policy(platform)
