from fastapi import APIRouter

router = APIRouter()

@router.get("/usuario/{usuario_id}")
async def listar_reservas(usuario_id: int):
    # TODO: fetch from DB. Mock for now
    return [
        {"id": 10, "espacio": "Quincho", "inicio": "2025-10-24T18:00:00Z", "fin": "2025-10-24T22:00:00Z", "estado_pago": "pendiente"}
    ]
