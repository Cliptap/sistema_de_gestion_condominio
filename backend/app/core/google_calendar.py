"""
Configuración e integración con Google Calendar API
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Configuración de Google Calendar usando Service Account
GOOGLE_SERVICE_ACCOUNT_KEY_PATH = os.getenv("GOOGLE_SERVICE_ACCOUNT_KEY_PATH", "google-service-account-key.json")
GOOGLE_CALENDAR_IDS = {
    "multicancha": os.getenv("GOOGLE_CALENDAR_ID_MULTICANCHA"),
    "quincho": os.getenv("GOOGLE_CALENDAR_ID_QUINCHO"),
    "sala_eventos": os.getenv("GOOGLE_CALENDAR_ID_SALA_EVENTOS"),
}

# Validar que las claves estén configuradas
def validate_google_calendar_config():
    """Valida que la configuración de Google Calendar sea válida"""
    if not os.path.exists(GOOGLE_SERVICE_ACCOUNT_KEY_PATH):
        raise ValueError(f"Service Account Key file not found at {GOOGLE_SERVICE_ACCOUNT_KEY_PATH}")
    
    for espacio, calendar_id in GOOGLE_CALENDAR_IDS.items():
        if not calendar_id:
            raise ValueError(f"GOOGLE_CALENDAR_ID_{espacio.upper()} no está configurada")
    
    return True

# Información sobre los espacios
ESPACIOS_COMUNES = {
    "multicancha": {
        "nombre": "Multicancha",
        "descripcion": "Cancha multiusos para fútbol, vóleibol, etc.",
        "requiere_pago": True,
        "precio": 50000  # en pesos o UF según tu sistema
    },
    "quincho": {
        "nombre": "Quincho",
        "descripcion": "Área de asados y reuniones",
        "requiere_pago": True,
        "precio": 75000
    },
    "sala_eventos": {
        "nombre": "Sala de Eventos",
        "descripcion": "Sala para reuniones y eventos",
        "requiere_pago": True,
        "precio": 100000
    }
}
