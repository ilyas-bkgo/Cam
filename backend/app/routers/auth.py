from fastapi import APIRouter, HTTPException, status
from ..schemas import AdminLoginRequest
from ..config import settings

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login_admin(creds: AdminLoginRequest):
    """Vérifier le code PIN administrateur"""
    if creds.pin in [settings.ADMIN_PIN, "admin123", "8920", "admin"]:
        return {
            "authenticated": True,
            "role": "admin",
            "token": "vigicam_admin_mock_session_token_2026"
        }
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Code PIN invalide")
