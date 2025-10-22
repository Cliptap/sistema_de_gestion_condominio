from fastapi import APIRouter, Depends
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
import logging
import json
from decimal import Decimal

logger = logging.getLogger(__name__)

router = APIRouter()

# Helper para convertir Decimal a float
def decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

@router.get("/residente/{usuario_id}")
async def desglose_residente(usuario_id: int, db: Session = Depends(get_db)):
    logger.info(f"DEBUG Pagos: Iniciando desglose_residente para usuario_id={usuario_id}")
    try:
        # Viviendas del residente
        rv_list: list[Any] = db.query(ResidenteVivienda).filter(ResidenteVivienda.usuario_id == usuario_id).all()
        viv_ids = [int(getattr(rv, "vivienda_id")) for rv in rv_list]
        if not viv_ids:
            logger.warning(f"DEBUG Pagos: No se encontraron viviendas para usuario_id={usuario_id}")
            return {"viviendas": [], "cargo_fijo_uf": 0.0, "gastos_comunes": [], "multas": [], "reservas": []}

        # Tomamos la primera vivienda para cargo fijo (MVP)
        vivienda: Any = db.query(Vivienda).filter(Vivienda.id.in_(viv_ids)).order_by(Vivienda.id.asc()).first()
        cargo_val: Any = getattr(vivienda, "cargo_fijo_uf", 0.0) if vivienda is not None else 0.0
        cargo_fijo_uf = float(cargo_val) if cargo_val is not None else 0.0

        # Gastos comunes
        gastos: list[Any] = db.query(GastoComun).filter(GastoComun.vivienda_id.in_(viv_ids)).all()
        gastos_payload = []
        for g in gastos:
            venci = getattr(g, "vencimiento", None)
            monto_val = getattr(g, "monto_total", 0)
            monto_total = float(monto_val) if monto_val is not None else 0.0
            gastos_payload.append(
                {
                    "id": int(getattr(g, "id")),
                    "vivienda_id": int(getattr(g, "vivienda_id")),
                    "mes": int(getattr(g, "mes")),
                    "ano": int(getattr(g, "ano")),
                    "monto_total": monto_total,
                    "estado": str(getattr(g, "estado", "")),
                    "vencimiento": venci.isoformat() if venci is not None else None,
                }
            )

        # Multas
        multas: list[Any] = db.query(Multa).filter(Multa.vivienda_id.in_(viv_ids)).all()
        multas_payload = []
        for m in multas:
            monto_val = getattr(m, "monto", 0)
            monto = float(monto_val) if monto_val is not None else 0.0
            fecha_aplicada = getattr(m, "fecha_aplicada", None)
            fecha_aplicada_str = fecha_aplicada.isoformat() if fecha_aplicada is not None else None
            multas_payload.append(
                {
                    "id": int(getattr(m, "id")),
                    "vivienda_id": int(getattr(m, "vivienda_id")),
                    "monto": monto,
                    "descripcion": str(getattr(m, "descripcion", "")),
                    "fecha_aplicada": fecha_aplicada_str,
                }
            )

        # Reservas del usuario
        reservas: list[Any] = db.query(Reserva).filter(Reserva.usuario_id == usuario_id).all()
        reservas_payload = []
        for r in reservas:
            monto_val = getattr(r, "monto_pago", 0)
            monto_pago = float(monto_val) if monto_val is not None else 0.0
            
            inicio = getattr(r, "fecha_hora_inicio", None)
            fin = getattr(r, "fecha_hora_fin", None)
            inicio_str = inicio.isoformat() if inicio is not None else None
            fin_str = fin.isoformat() if fin is not None else None
            
            reservas_payload.append(
                {
                    "id": int(getattr(r, "id")),
                    "monto_pago": monto_pago,
                    "estado_pago": str(getattr(r, "estado_pago", "")),
                    "inicio": inicio_str,
                    "fin": fin_str,
                }
            )

        response_data = {
            "viviendas": viv_ids,
            "cargo_fijo_uf": cargo_fijo_uf,
            "gastos_comunes": gastos_payload,
            "multas": multas_payload,
            "reservas": reservas_payload,
        }
        
        logger.info(f"DEBUG Pagos: Desglose completado para usuario_id={usuario_id}")
        return response_data
        
    except Exception as e:
        logger.error(f"ERROR Pagos: Exception en desglose_residente: {str(e)}", exc_info=True)
        raise
