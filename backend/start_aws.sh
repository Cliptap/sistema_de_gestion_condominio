#!/bin/bash
set -e

# Crear tablas con SQLAlchemy directamente
python -c "from app.db.session import engine; from app.models.models import Base; Base.metadata.create_all(bind=engine); print('Tables created successfully')"

# Iniciar la aplicación
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
