from fastapi import APIRouter

router = APIRouter()

@router.get("/vivienda/{vivienda_id}")
async def listar_gastos(vivienda_id: int):
    # TODO: fetch from DB. Mock for now
    return [
        {"id": 1, "mes": 1, "ano": 2025, "monto_total": 150000, "estado": "pendiente"},
        {"id": 2, "mes": 2, "ano": 2025, "monto_total": 150000, "estado": "pagado"}
    ]
