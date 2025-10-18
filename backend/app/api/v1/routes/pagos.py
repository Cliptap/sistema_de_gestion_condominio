from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from typing import Any
from sqlalchemy.orm import Session
from ....db.deps import get_db
from ....models.models import (
    ResidenteVivienda,
    Vivienda,
    GastoComun,
    Multa,
    Reserva,
)

router = APIRouter()

@router.get("/residente/{usuario_id}")
async def desglose_residente(usuario_id: int, db: Session = Depends(get_db)):
    # Viviendas del residente
    rv_list: list[Any] = db.query(ResidenteVivienda).filter(ResidenteVivienda.usuario_id == usuario_id).all()
    viv_ids = [int(getattr(rv, "vivienda_id")) for rv in rv_list]
    if not viv_ids:
        return {"viviendas": [], "cargo_fijo_uf": 0, "gastos_comunes": [], "multas": [], "reservas": []}

    # Tomamos la primera vivienda para cargo fijo (MVP)
    vivienda: Any = db.query(Vivienda).filter(Vivienda.id.in_(viv_ids)).order_by(Vivienda.id.asc()).first()
    cargo_val: Any = getattr(vivienda, "cargo_fijo_uf", 0.0) if vivienda is not None else 0.0
    try:
        cargo_fijo_uf = float(cargo_val) if cargo_val is not None else 0.0
    except Exception:
        cargo_fijo_uf = 0.0

    # Gastos comunes
    gastos: list[Any] = db.query(GastoComun).filter(GastoComun.vivienda_id.in_(viv_ids)).all()
    gastos_payload = []
    for g in gastos:
        venci = getattr(g, "vencimiento", None)
        monto_val = getattr(g, "monto_total", 0)
        try:
            monto_total = float(monto_val) if monto_val is not None else 0.0
        except Exception:
            monto_total = 0.0
        gastos_payload.append(
            {
                "id": int(getattr(g, "id")),
                "vivienda_id": int(getattr(g, "vivienda_id")),
                "mes": int(getattr(g, "mes")),
                "ano": int(getattr(g, "ano")),
                "monto_total": monto_total,
                "estado": getattr(g, "estado"),
                "vencimiento": venci.isoformat() if venci is not None else None,
            }
        )

    # Multas
    multas: list[Any] = db.query(Multa).filter(Multa.vivienda_id.in_(viv_ids)).all()
    multas_payload = []
    for m in multas:
        monto_val = getattr(m, "monto", 0)
        try:
            monto = float(monto_val) if monto_val is not None else 0.0
        except Exception:
            monto = 0.0
        multas_payload.append(
            {
                "id": int(getattr(m, "id")),
                "vivienda_id": int(getattr(m, "vivienda_id")),
                "monto": monto,
                "descripcion": getattr(m, "descripcion"),
                "fecha_aplicada": getattr(m, "fecha_aplicada").isoformat(),
            }
        )

    # Reservas del usuario
    reservas: list[Any] = db.query(Reserva).filter(Reserva.usuario_id == usuario_id).all()
    reservas_payload = []
    for r in reservas:
        monto_val = getattr(r, "monto_pago", 0)
        try:
            monto_pago = float(monto_val) if monto_val is not None else 0.0
        except Exception:
            monto_pago = 0.0
        reservas_payload.append(
            {
                "id": int(getattr(r, "id")),
                "monto_pago": monto_pago,
                "estado_pago": getattr(r, "estado_pago"),
                "inicio": getattr(r, "fecha_hora_inicio").isoformat(),
                "fin": getattr(r, "fecha_hora_fin").isoformat(),
            }
        )

    return {
        "viviendas": viv_ids,
        "cargo_fijo_uf": cargo_fijo_uf,
        "gastos_comunes": gastos_payload,
        "multas": multas_payload,
        "reservas": reservas_payload,
    }
