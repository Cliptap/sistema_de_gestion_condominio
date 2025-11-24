import firebase_admin
from firebase_admin import credentials
from app.core.config import settings
import os

def initialize_firebase():
    """
    Inicializa la app de Firebase Admin si no ha sido inicializada.
    Intenta cargar las credenciales desde la ruta configurada.
    """
    try:
        if not firebase_admin._apps:
            cred_path = settings.FIREBASE_CREDENTIALS_PATH
            if os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
                print(f"Firebase Admin inicializado con credenciales en: {cred_path}")
            else:
                print(f"ADVERTENCIA: No se encontró el archivo de credenciales de Firebase en: {cred_path}")
                print("La autenticación con Firebase no funcionará hasta que se configure correctamente.")
    except Exception as e:
        print(f"Error al inicializar Firebase: {e}")
