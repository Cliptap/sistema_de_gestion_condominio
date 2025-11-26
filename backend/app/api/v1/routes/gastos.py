from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import httpx

from app.core.auth import get_current_active_user
from app.db.deps import get_db
from app.models.models import GastoComun, ResidenteVivienda, Usuario, Vivienda

router = APIRouter()


async def get_uf_value() -> float:
    """Obtiene el valor actual de la UF desde el endpoint interno"""
    try:
        # Usar el endpoint interno del mismo servidor
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get("http://localhost:8000/api/v1/uf/current")
            if response.status_code == 200:
                data = response.json()
                return float(data.get("value_clp", 39643.59))
    except Exception as e:
        print(f"Error obteniendo valor UF: {e}")
    
    # Valor por defecto si falla
    return 39643.59


@router.get("/vivienda/{vivienda_id}")
async def listar_gastos(
    vivienda_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_active_user),
):
    vivienda = db.query(Vivienda).filter(Vivienda.id == vivienda_id).first()
    if not vivienda:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vivienda {vivienda_id} no encontrada",
        )

    if current_user.rol not in {"Administrador", "Conserje", "Super Admin"}:
        es_residente = (
            db.query(ResidenteVivienda)
            .filter(
                ResidenteVivienda.vivienda_id == vivienda_id,
                ResidenteVivienda.usuario_id == current_user.id,
            )
            .first()
        )
        if not es_residente:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para ver los gastos de esta vivienda",
            )

    gastos = (
        db.query(GastoComun)
        .filter(GastoComun.vivienda_id == vivienda_id)
        .order_by(GastoComun.ano.desc(), GastoComun.mes.desc())
        .all()
    )

    return [
        {
            "id": gasto.id,
            "mes": gasto.mes,
            "ano": gasto.ano,
            "monto_total": float(gasto.monto_total),
            "estado": gasto.estado,
            "vencimiento": gasto.vencimiento.isoformat() if gasto.vencimiento else None,
            "created_at": gasto.created_at.isoformat() if gasto.created_at else None,
        }
        for gasto in gastos
    ]


@router.get("/usuario/{usuario_id}")
async def listar_gastos_usuario(
    usuario_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_active_user),
):
    """
    Obtiene todos los gastos comunes de las viviendas del usuario.
    Para administradores y conserjes, puede consultar cualquier usuario.
    Para residentes, solo puede consultar sus propios gastos.
    
    Devuelve monto_total en UF y monto_clp calculado con el valor actual de la UF.
    """
    try:
        # Verificar permisos
        if current_user.id != usuario_id and current_user.rol not in {"Administrador", "Conserje", "Super Admin"}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para ver los gastos de este usuario",
            )

        # Obtener viviendas del usuario
        viviendas_rel = db.query(ResidenteVivienda).filter(
            ResidenteVivienda.usuario_id == usuario_id
        ).all()
        
        if not viviendas_rel:
            return []

        vivienda_ids = [rv.vivienda_id for rv in viviendas_rel]

        # Obtener todos los gastos de las viviendas del usuario
        gastos = (
            db.query(GastoComun)
            .filter(GastoComun.vivienda_id.in_(vivienda_ids))
            .order_by(GastoComun.ano.desc(), GastoComun.mes.desc())
            .all()
        )

        # Obtener información de viviendas para el contexto
        viviendas_info = {}
        for vivienda in db.query(Vivienda).filter(Vivienda.id.in_(vivienda_ids)).all():
            viviendas_info[vivienda.id] = vivienda.numero_vivienda

        # Obtener valor actual de la UF
        uf_value = await get_uf_value()

        return [
            {
                "id": gasto.id,
                "vivienda_id": gasto.vivienda_id,
                "vivienda_numero": viviendas_info.get(gasto.vivienda_id, "N/A"),
                "mes": gasto.mes,
                "ano": gasto.ano,
                "monto_uf": float(gasto.monto_total),  # Valor guardado en UF
                "monto_total": float(gasto.monto_total) * uf_value,  # Cálculo dinámico en CLP
                "uf_value_used": uf_value,  # Para referencia
                "estado": gasto.estado,
                "vencimiento": gasto.vencimiento.isoformat() if gasto.vencimiento else None,
                "created_at": gasto.created_at.isoformat() if gasto.created_at else None,
            }
            for gasto in gastos
        ]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener gastos: {str(e)}"
        )
