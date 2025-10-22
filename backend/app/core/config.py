import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()


class Settings:
    """Minimal settings loader using environment variables."""

    def __init__(self) -> None:
        self.DB_HOST: str = os.getenv("DB_HOST", "db")
        self.DB_PORT: int = int(os.getenv("DB_PORT", 5432))
        self.DB_USER: str = os.getenv("DB_USER", "condouser")
        self.DB_PASSWORD: str = os.getenv("DB_PASSWORD", "condopass")
        self.DB_NAME: str = os.getenv("DB_NAME", "condominio")
        
        # Google Calendar Configuration
        self.GOOGLE_CALENDAR_API_KEY: str = os.getenv("GOOGLE_CALENDAR_API_KEY", "")
        self.GOOGLE_CALENDAR_ID_MULTICANCHA: str = os.getenv("GOOGLE_CALENDAR_ID_MULTICANCHA", "")
        self.GOOGLE_CALENDAR_ID_QUINCHO: str = os.getenv("GOOGLE_CALENDAR_ID_QUINCHO", "")
        self.GOOGLE_CALENDAR_ID_SALA_EVENTOS: str = os.getenv("GOOGLE_CALENDAR_ID_SALA_EVENTOS", "")

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )


settings = Settings()

