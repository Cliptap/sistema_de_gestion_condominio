from fastapi import APIRouter
from .routes import auth, gastos, reservas, pagos

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(gastos.router, prefix="/gastos", tags=["gastos"])
api_router.include_router(reservas.router, prefix="/reservas", tags=["reservas"])
api_router.include_router(pagos.router, prefix="/pagos", tags=["pagos"])
