"""
Router para obtener el valor de la UF.
Actúa como proxy para la API de CMF Chile.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict
import httpx
from datetime import datetime

router = APIRouter()

CMF_API_URL = "https://api.cmfchile.cl/api-sbifv3/recursos_api/uf"
# API Key válida para CMF Chile
API_KEY = "2bea1a42f6b3d657e19f22c2b01f7ee02d69ebf4"


def parse_chilean_number(value: str) -> float:
    """
    Convierte un número en formato chileno a float.
    Ejemplo: "20.939,49" -> 20939.49
    """
    try:
        # Remover puntos (separador de miles) y reemplazar coma por punto
        normalized = value.replace(".", "").replace(",", ".")
        return float(normalized)
    except (ValueError, AttributeError):
        raise ValueError(f"No se pudo parsear el valor: {value}")


@router.get("/current", response_model=Dict)
async def get_current_uf():
    """
    Obtiene el valor actual de la UF desde la API de CMF Chile.
    
    Returns:
        Dict con el valor en CLP y la fecha
        {
            "value_clp": 37458.25,
            "date": "2024-01-15",
            "formatted": "$37.458"
        }
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                CMF_API_URL,
                params={"apikey": API_KEY, "formato": "json"}
            )
            
            if response.status_code != 200:
                # En caso de error, devolver valor por defecto
                return {
                    "value_clp": 37000,
                    "date": datetime.now().strftime("%Y-%m-%d"),
                    "formatted": "$37.000",
                    "error": f"Error {response.status_code} al consultar CMF"
                }
            
            data = response.json()
            
            # Formato esperado: { "UFs": [ { "Valor": "20.939,49", "Fecha": "YYYY-MM-DD" } ] }
            uf_item = data.get("UFs", [{}])[0]
            
            if not uf_item:
                raise ValueError("Respuesta vacía de la API")
            
            value_str = uf_item.get("Valor", "")
            date = uf_item.get("Fecha", datetime.now().strftime("%Y-%m-%d"))
            
            value_clp = parse_chilean_number(value_str)
            
            # Formatear el valor en formato chileno
            formatted = f"${int(value_clp):,}".replace(",", ".")
            
            return {
                "value_clp": value_clp,
                "date": date,
                "formatted": formatted
            }
            
    except httpx.TimeoutException:
        # Timeout - devolver valor por defecto
        return {
            "value_clp": 37000,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "formatted": "$37.000",
            "error": "Timeout al consultar CMF"
        }
    except Exception as e:
        # Cualquier otro error - devolver valor por defecto
        return {
            "value_clp": 37000,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "formatted": "$37.000",
            "error": str(e)
        }


@router.get("/convert", response_model=Dict)
async def convert_uf_to_clp(uf_amount: float):
    """
    Convierte un monto en UF a CLP usando el valor actual.
    
    Args:
        uf_amount: Cantidad en UF
        
    Returns:
        Dict con la conversión
        {
            "uf_amount": 0.5,
            "clp_amount": 18729.12,
            "uf_value": 37458.25,
            "date": "2024-01-15"
        }
    """
    try:
        uf_data = await get_current_uf()
        
        if "error" in uf_data:
            raise HTTPException(
                status_code=503,
                detail=f"Error al obtener valor UF: {uf_data['error']}"
            )
        
        value_clp = uf_data["value_clp"]
        clp_amount = uf_amount * value_clp
        
        return {
            "uf_amount": uf_amount,
            "clp_amount": round(clp_amount, 2),
            "uf_value": value_clp,
            "date": uf_data["date"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al convertir UF: {str(e)}"
        )
