import os


class Settings:
    """Minimal settings loader using environment variables."""

    def __init__(self) -> None:
        self.DB_HOST: str = os.getenv("DB_HOST", "db")
        self.DB_PORT: int = int(os.getenv("DB_PORT", 5432))
        self.DB_USER: str = os.getenv("DB_USER", "condouser")
        self.DB_PASSWORD: str = os.getenv("DB_PASSWORD", "condopass")
        self.DB_NAME: str = os.getenv("DB_NAME", "condominio")

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )


settings = Settings()
