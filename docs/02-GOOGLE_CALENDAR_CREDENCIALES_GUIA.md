# 🔑 Guía Completa: Obtener Credenciales de Google Calendar

## Tu Situación Específica

Para tu módulo de reservas, necesitas elegir el tipo de credencial correcto.

### 🎯 Respuesta Corta:
**Usa "Datos de aplicaciones" → Cuenta de Servicio**

---

## 📊 Comparativa: OAuth vs Cuenta de Servicio

| Aspecto | OAuth (Datos de usuarios) | Cuenta de Servicio (Datos de aplicaciones) |
|--------|---------------------------|---------------------------------------------|
| **Quién usa** | Usuarios finales | Tu aplicación/backend |
| **Consentimiento** | Sí, requiere autorización del usuario | No, es automático |
| **Complejidad** | Mayor (flujo de login) | Menor (credenciales simples) |
| **Acceso a calendarios** | Solo calendarios compartidos por el usuario | Acceso a calendarios que configures |
| **Para reservas** | ❌ No recomendado | ✅ **Recomendado** |
| **Tipo de credencial** | Client ID OAuth 2.0 | Archivo JSON privado |

---

## ✅ Por qué usar Cuenta de Servicio para tu caso:

1. **No requiere login cada vez** - Tu backend puede acceder directo
2. **Más seguro** - Las credenciales están en el servidor, no en el navegador
3. **Control centralizado** - Tú controlas qué se reserva
4. **Residentes solo ven disponibilidad** - No necesitan autenticarse en Google

### Flujo actual:
```
Residente → Tu App → Backend → Backend accede a Google Calendar → Muestra disponibilidad
```

Si usaras OAuth:
```
Residente → Tu App → Debe hacer login en Google → Complejo y conflictivo
```

---

## 🚀 Paso a Paso: Crear Cuenta de Servicio

### 1. En Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Asegúrate de estar en el proyecto correcto (arriba a la izquierda)

### 2. Habilitar Google Calendar API

1. Haz clic en **"APIs y Servicios"** en el menú izquierdo
2. Haz clic en **"Biblioteca"**
3. Busca **"Google Calendar API"**
4. Haz clic en ella y luego en el botón **"HABILITAR"**

### 3. Crear Cuenta de Servicio

1. Ve a **"APIs y Servicios"** > **"Credenciales"**
2. Haz clic en **"+ Crear credenciales"** (arriba)
3. Selecciona **"Cuenta de servicio"**

### 4. Completar el formulario

**Paso 1 - Detalles de la cuenta de servicio:**
- **Nombre de la cuenta de servicio:** `reservas-condominio` (o cualquier nombre)
- **ID de la cuenta de servicio:** Se llenará automáticamente
- **Descripción:** `Acceso automatizado a Google Calendar para reservas de espacios comunes`
- Haz clic en **"Crear y continuar"**

**Paso 2 - Otorgar acceso (OPCIONAL):**
- Puedes dejar esto en blanco por ahora
- Haz clic en **"Continuar"**

**Paso 3 - Crear clave:**
- Haz clic en **"Crear clave"**
- Selecciona **"JSON"** (es la opción más común)
- Se descargará un archivo JSON automáticamente

### 5. Guardar el archivo JSON

1. La descarga se guardará como algo como `reservas-condominio-XXXX.json`
2. Guarda este archivo en la raíz de tu proyecto con este nombre:
   ```
   google-service-account-key.json
   ```

### 6. Agregar el JSON al .gitignore

El archivo `.gitignore` debe incluir:
```
google-service-account-key.json
*.json  # o solo este archivo
```

---

## 📋 Contenido del archivo JSON

Tu archivo JSON descargado se verá así:

```json
{
  "type": "service_account",
  "project_id": "mi-proyecto-12345",
  "private_key_id": "abcdef123456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7...\n-----END PRIVATE KEY-----\n",
  "client_email": "reservas-condominio@mi-proyecto-12345.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
}
```

**IMPORTANTE:** Este archivo contiene credenciales privadas. **NUNCA** lo compartas ni lo subas a GitHub.

---

## 🔗 Dar acceso a los Calendarios

Una vez tengas el archivo JSON, debes **compartir los calendarios de Google** con el email de la cuenta de servicio:

1. Abre cada calendario en [Google Calendar](https://calendar.google.com/)
   - Multicancha
   - Quincho
   - Sala de Eventos

2. PARA CADA UNO DE LOS CALENDARIOS:
   - Haz clic en los **3 puntos** junto al nombre del calendario
   - Selecciona **"Configuración"**
   - Ve a **"Acceso y compartir"**
   - Busca **"Compartir con usuarios específicos"**
   - Pega el email: `reservas-condominio@proyecto-condominio-475400.iam.gserviceaccount.com`
   - Dale permisos de **"Cambiar eventos"** o **"Ver todos los detalles"**
   - Guarda

---

## ⚙️ Actualizar variables de entorno

Una vez tengas el archivo JSON, actualiza tu `.env`:

```env
# Google Calendar API - Usando Cuenta de Servicio
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=google-service-account-key.json
GOOGLE_CALENDAR_ID_MULTICANCHA=multicancha@grupo.calendar.google.com
GOOGLE_CALENDAR_ID_QUINCHO=quincho@grupo.calendar.google.com
GOOGLE_CALENDAR_ID_SALA_EVENTOS=sala-eventos@grupo.calendar.google.com
```

---

## 🔄 Alternativa: Si YA tienes una API Key

Si ya tienes una **API Key** (no cuenta de servicio):

- La API Key funciona, pero es **menos segura** (puedes exponerla accidentalmente)
- La Cuenta de Servicio es **más recomendada** para backends
- Si ya está funcionando, puedes seguir usándola por ahora

---

## ✅ Checklist Final

- [ ] Habilité Google Calendar API en Google Cloud Console
- [ ] Creé una Cuenta de Servicio
- [ ] Descargué el archivo JSON
- [ ] Guardé el archivo en la raíz como `google-service-account-key.json`
- [ ] Agregué el archivo al `.gitignore`
- [ ] Compartí los 3 calendarios con el email de la cuenta de servicio
- [ ] Obtuve los IDs de los 3 calendarios
- [ ] Actualicé el archivo `.env`

Una vez hayas completado esto, avísame para actualizar el código del backend. 🚀
