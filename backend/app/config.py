import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "VigiCam API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database Settings
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "vigicam_user")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "vigicam_secret_2026")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "vigicam_db")
    
    # Full DB URL fallback
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"postgresql://{os.getenv('POSTGRES_USER', 'vigicam_user')}:{os.getenv('POSTGRES_PASSWORD', 'vigicam_secret_2026')}@{os.getenv('POSTGRES_HOST', 'localhost')}:{os.getenv('POSTGRES_PORT', '5432')}/{os.getenv('POSTGRES_DB', 'vigicam_db')}"
    )

    # Admin Security
    ADMIN_PIN: str = os.getenv("ADMIN_PIN", "admin123")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_vigicam_jwt_key_2026")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "*"
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
