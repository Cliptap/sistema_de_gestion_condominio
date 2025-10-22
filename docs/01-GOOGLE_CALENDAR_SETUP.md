# 📅 Configuración de Google Calendar API

## Paso a Paso para Configurar Google Calendar

### 1. Obtener la API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto (o usa uno existente)
3. Ve a **APIs y Servicios** > **Biblioteca**
4. Busca y habilita **Google Calendar API**
5. Ve a **Credenciales**
6. Haz clic en **+ Crear Credenciales** > **Clave de API**
7. Selecciona **Clave de API** en el menú que aparece
8. Copia la clave generada

### 2. Obtener los IDs de los Calendarios de Google

1. Ve a [Google Calendar](https://calendar.google.com)
2. Para cada espacio, crea un calendario nuevo:
   - Haz clic en **+** junto a "Otros calendarios"
   - Selecciona **Crear nuevo calendario**
   - Nombra: "Multicancha", "Quincho", "Sala de Eventos"

3. Para cada calendario:
   - Haz clic en el calendario en la lista izquierda
   - Haz clic en los **3 puntos** > **Configuración**
   - Desplázate hasta **Integración**
   - Copia el **ID del calendario** (se ve así: `abc123@grupo.calendar.google.com`)

### 3. Crear el archivo `.env`

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

Luego, reemplaza los valores con tus credenciales:

```env
GOOGLE_CALENDAR_API_KEY=AIzaSyD_xxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_CALENDAR_ID_MULTICANCHA=abc123@grupo.calendar.google.com
GOOGLE_CALENDAR_ID_QUINCHO=def456@grupo.calendar.google.com
GOOGLE_CALENDAR_ID_SALA_EVENTOS=ghi789@grupo.calendar.google.com
```

### 4. Instalar dependencias del backend

```bash
cd backend
pip install -r requirements.txt
```

### 5. Verificar configuración

El backend validará automáticamente que todas las configuraciones estén presentes al iniciar.

## 📝 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `GOOGLE_CALENDAR_API_KEY` | Tu clave de API de Google | `AIzaSyD_...` |
| `GOOGLE_CALENDAR_ID_MULTICANCHA` | ID del calendario de Multicancha | `abc@grupo.calendar.google.com` |
| `GOOGLE_CALENDAR_ID_QUINCHO` | ID del calendario de Quincho | `def@grupo.calendar.google.com` |
| `GOOGLE_CALENDAR_ID_SALA_EVENTOS` | ID del calendario de Sala de Eventos | `ghi@grupo.calendar.google.com` |

## 🔒 Seguridad

⚠️ **IMPORTANTE:** 
- **Nunca** hagas commit del archivo `.env` a Git
- El archivo `.env` está en `.gitignore` para proteger tus credenciales
- Solo comparte el archivo `.env.example` con tus compañeros
- Cada desarrollador debe crear su propio `.env` local

## ✅ Verificación

Para verificar que la configuración es correcta:

1. Inicia el servidor backend:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

2. Si no hay errores sobre variables de entorno faltantes, ¡todo está correcto!

## 🆘 Troubleshooting

### Error: "GOOGLE_CALENDAR_API_KEY no está configurada"
- Verifica que el archivo `.env` exista en la raíz del proyecto
- Verifica que hayas copiado correctamente tu API Key
- Reinicia el servidor

### Error: "Invalid calendar ID"
- Verifica que los IDs de calendario estén correctos
- Los IDs deben terminar en `@grupo.calendar.google.com`
- No confundas el nombre del calendario con su ID

### Los eventos no aparecen en Google Calendar
- Verifica que el calendario esté visible en Google Calendar
- Asegúrate de que los eventos se crean en el ID de calendario correcto
- Revisa la consola del servidor para mensajes de error
