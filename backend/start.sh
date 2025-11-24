#!/bin/sh
set -e

# Create tables directly from models (skip Alembic for now)
python -c "from app.db.session import engine; from app.models.models import Base; Base.metadata.create_all(bind=engine); print('Tables created successfully')"

exec uvicorn app.main:app --host 0.0.0.0 --port 8000
