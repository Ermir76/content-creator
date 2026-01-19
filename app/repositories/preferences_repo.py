from sqlalchemy.orm import Session
from app.models.models import UserPreference
from app.models.schemas import UserPreferenceUpdate
from app.repositories.content_repo import get_or_create_default_user


def get_preferences(db: Session, user_id: int = 1) -> UserPreference:
    """Get preferences for a user, creating default if needed."""
    # Ensure user exists (using default user logic for now)
    user = get_or_create_default_user(db)

    prefs = db.query(UserPreference).filter(UserPreference.user_id == user.id).first()
    if not prefs:
        prefs = UserPreference(user_id=user.id)
        db.add(prefs)
        db.commit()
        db.refresh(prefs)

    return prefs


def update_preferences(
    db: Session, update_data: UserPreferenceUpdate, user_id: int = 1
) -> UserPreference:
    """Update user preferences."""
    prefs = get_preferences(db, user_id)

    if update_data.last_idea_prompt is not None:
        prefs.last_idea_prompt = update_data.last_idea_prompt  # type: ignore

    if update_data.last_platform_selection is not None:
        prefs.last_platform_selection = update_data.last_platform_selection  # type: ignore

    if update_data.last_policies is not None:
        prefs.last_policies = update_data.last_policies  # type: ignore

    if update_data.last_expanded_platforms is not None:
        prefs.last_expanded_platforms = update_data.last_expanded_platforms  # type: ignore

    db.commit()
    db.refresh(prefs)
    return prefs
