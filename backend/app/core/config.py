from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Breath-Analyzer API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Database - Use DATABASE_URL from .env if available
    DATABASE_URL: str | None = None
    
    # Fallback TimescaleDB / PostgreSQL Connection
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "breath_analyzer"
    POSTGRES_PORT: int = 5432
    
    # External APIs
    WAQI_TOKEN: str | None = None
    GROQ_API_KEY: str | None = None
    VITE_SUPABASE_URL: str | None = None
    VITE_SUPABASE_ANON_KEY: str | None = None
    SUPABASE_URL: str | None = None
    SUPABASE_KEY: str | None = None

    # Google Cloud / Vertex AI
    GCP_PROJECT_ID: str | None = None
    GCP_LOCATION: str = "us-central1"

    @property
    def async_database_url(self) -> str:
        # Use DATABASE_URL from .env if available (Supabase)
        if self.DATABASE_URL:
            # Convert postgresql:// to postgresql+asyncpg://
            # Remove any query parameters that aren't valid for asyncpg
            url = self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
            # Strip query parameters - we'll handle them in connect_args instead
            if "?" in url:
                url = url.split("?")[0]
            return url
        # Fallback to local PostgreSQL
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

settings = Settings()
