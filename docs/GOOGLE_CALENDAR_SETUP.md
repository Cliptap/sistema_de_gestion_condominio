# 📅 Integración con Google Calendar

Este documento explica cómo configurar Google Calendar para la sincronización automática de reservas.

## 📋 Índice

1. [Requisitos](#requisitos)
2. [Paso 1: Google Cloud Console](#paso-1-google-cloud-console)
3. [Paso 2: Crear Service Account](#paso-2-crear-service-account)
4. [Paso 3: Crear Calendarios](#paso-3-crear-calendarios)
5. [Paso 4: Configurar Permisos](#paso-4-configurar-permisos)
6. [Paso 5: Configuración Local](#paso-5-configuración-local)
7. [Verificación](#verificación)
8. [Troubleshooting](#troubleshooting)

## Requisitos

- Cuenta Google personal o corporativa
- Acceso a [Google Cloud Console](https://console.cloud.google.com)
- Acceso a [Google Calendar](https://calendar.google.com)
- El archivo `.env` configurado en la raíz del proyecto

## Paso 1: Google Cloud Console

1. Ir a https://console.cloud.google.com/
2. **Crear un nuevo proyecto:**
   - En la esquina superior izquierda, hacer clic en "Seleccionar un proyecto"
   - Clic en "NUEVO PROYECTO"
   - Nombre: `Sistema de Gestión Condominio` (o el que prefieras)
   - Crear

3. **Habilitar Google Calendar API:**
   - Ir a "APIs y servicios" → "Biblioteca"
   - Buscar "Google Calendar API"
   - Hacer clic en el resultado
   - Clic en "HABILITAR"

## Paso 2: Crear Service Account

Una Service Account es una cuenta especial que permite que tu aplicación se autentique sin necesidad de usuario interactivo.

1. En Google Cloud Console, ir a **"APIs y servicios"** → **"Credenciales"**
2. Clic en **"+ CREAR CREDENCIALES"** → **"Cuenta de servicio"**
3. Llenar el formulario:
   - **Nombre de la cuenta de servicio:** `condominio-reservas`
   - **ID de la cuenta de servicio:** (se auto-completa)
   - **Descripción:** "Service account para sincronización de reservas con Google Calendar"
   - Clic en "CREAR Y CONTINUAR"

4. En "Otorgar acceso (opcional)":
   - Rol: **"Editor"** (necesita permisos para crear/modificar eventos)
   - Clic en "CONTINUAR"

5. Clic en "CREAR CLAVE":
   - Formato: **JSON**
   - Clic en "CREAR"
   - Se descargará un archivo JSON automáticamente
   - **Guardar este archivo como `google-service-account-key.json` en la raíz del proyecto**

6. Anotar el **email del Service Account** (visible en el JSON, formato: `xxxxx@xxxxx.iam.gserviceaccount.com`)

## Paso 3: Crear Calendarios

En https://calendar.google.com:

1. En la esquina izquierda, hacer clic en **"+"** junto a "Otros calendarios"
2. Seleccionar **"Crear nuevo calendario"**
3. Llenar:
   - **Nombre:** `Multicancha`
   - **Descripción:** "Reservas de Multicancha"
   - Crear

4. Repetir para:
   - **Quincho** - "Reservas de Quincho"
   - **Sala de Eventos** - "Reservas de Sala de Eventos"

## Paso 4: Configurar Permisos

Para cada calendario creado:

1. Hacer clic derecho en el calendario → **"Configuración"**
2. En la esquina derecha, ir a **"Compartir con una persona o grupo"**
3. En el campo de email, pegar el **email del Service Account** (del JSON descargado)
4. En el dropdown de permisos, seleccionar **"Cambiar eventos"**
5. Clic en "Compartir"

**Repetir este paso para los 3 calendarios.**

## Paso 5: Configuración Local

### Obtener IDs de Calendarios

1. Para cada calendario en https://calendar.google.com:
   - Hacer clic derecho → "Configuración"
   - En la sección **"Integración del calendario"**, copiar el **"ID del calendario"**
   - Tiene formato: `xxxxx@group.calendar.google.com`

2. Abrir o crear `.env` en la raíz del proyecto:
   ```bash
   GOOGLE_CALENDAR_ID_MULTICANCHA=xxxxxxxx@group.calendar.google.com
   GOOGLE_CALENDAR_ID_QUINCHO=xxxxxxxx@group.calendar.google.com
   GOOGLE_CALENDAR_ID_SALA_EVENTOS=xxxxxxxx@group.calendar.google.com
   ```

3. Asegurarse de que el archivo `google-service-account-key.json` está en la raíz del proyecto

### Estructura del Proyecto

```
sistema_de_gestion_condominio/
├── google-service-account-key.json    ← Archivo descargado
├── .env                               ← Archivo local (NO en repo)
├── .env.example                       ← Template (SÍ en repo)
├── docker-compose.yml
├── ...
```

## Verificación

Para verificar que todo está configurado correctamente:

1. **Levantar los contenedores:**
   ```bash
   docker-compose up -d
   ```

2. **Ver los logs del API:**
   ```bash
   docker logs sistema_de_gestion_condominio-master-api-1 -f
   ```

3. **Buscar mensajes relacionados con Google Calendar:**
   ```bash
   docker logs sistema_de_gestion_condominio-master-api-1 | grep -i "google\|gcal\|calendar"
   ```

4. **Crear una reserva de prueba:**
   ```bash
   curl -X POST http://localhost:8000/api/v1/reservas/?usuario_id=1 \
     -H "Content-Type: application/json" \
     -d '{
       "espacio": "multicancha",
       "fecha_hora_inicio": "2025-10-25T10:00:00",
       "fecha_hora_fin": "2025-10-25T11:00:00"
     }'
   ```

5. **Ir a Google Calendar y verificar:**
   - El evento debería aparecer en el calendario "Multicancha"
   - Título: típicamente el espacio y horario
   - Hora: debe coincidir con la solicitud

## Troubleshooting

### Error: "PERMISSION_DENIED"
**Causa:** El Service Account no tiene permisos en los calendarios.

**Solución:**
1. Verificar que el Service Account está compartido en TODOS los calendarios
2. Verificar que tiene permiso "Cambiar eventos" (no solo "Ver")
3. Reintentar después de 5 minutos (los permisos pueden tardar en propagarse)

### Error: "NOT_FOUND"
**Causa:** El Calendar ID es incorrecto.

**Solución:**
1. Ir a Google Calendar → Configuración del calendario
2. En "Integración del calendario", copiar nuevamente el ID exacto
3. Actualizar `.env`
4. Reiniciar: `docker-compose restart api`

### Error: "invalid_grant"
**Causa:** Las credenciales de Google se han invalidado o han expirado.

**Solución:**
1. Ir a Google Cloud Console
2. Buscar la Service Account y eliminar la clave antigua
3. Crear una nueva clave JSON
4. Actualizar `google-service-account-key.json`
5. Reiniciar: `docker-compose restart api`

### Error: "No se sincroniza con Google Calendar"
**Causa:** La API no está respondiendo o hay un error en la configuración.

**Solución:**
1. Ver logs: `docker logs sistema_de_gestion_condominio-master-api-1 -f`
2. Buscar mensajes de error con "DEBUG" o "ERROR"
3. Verificar que `/api/v1/pagos/residente/1` devuelve las reservas correctamente
4. Verificar que Google Calendar API está habilitada en Google Cloud Console

### El evento aparece en Google Calendar pero no en la app
**Causa:** Posible sincronización unidireccional o caché del navegador.

**Solución:**
1. Limpiar caché del navegador (Ctrl+Shift+Del)
2. Hacer recarga forzada (Ctrl+Shift+R)
3. Verificar que la BD tiene la reserva: `docker exec -i condominio_db psql -U condouser -d condominio -c "SELECT * FROM reservas;"`

## Recursos

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Troubleshooting Google Calendar API](https://developers.google.com/calendar/api/guides/errors)
