from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError, DisconnectionError
from ..core.config import settings
import logging

logger = logging.getLogger(__name__)

database_url = settings.database_url
engine_kwargs = {
    "echo": False,
}

driver = database_url.split("://", 1)[0].lower()

if driver.startswith("sqlite"):
    engine_kwargs.update({"connect_args": {"check_same_thread": False}})
else:
    engine_kwargs.update(
        {
            "pool_pre_ping": True,
            "pool_recycle": 3600,
            "pool_size": 5,
            "max_overflow": 10,
        }
    )

# Configurar el engine con opciones dependiendo del motor
engine = create_engine(database_url, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
