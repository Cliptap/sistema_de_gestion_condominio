# Fase 2: Endpoints Backend para Reservas - COMPLETADA

## ✅ Cambios Realizados

### 1. **Esquemas Pydantic** (`backend/app/schemas/reservas.py`)
Creados modelos de validación para:
- `EspacioComunResponse` - Datos de espacios comunes
- `SlotDisponible` - Horarios disponibles
- `DisponibilidadResponse` - Respuesta de disponibilidad
- `ReservaCreate` - Datos para crear reserva
- `ReservaResponse` - Respuesta completa de reserva
- `ReservaListResponse` - Listado de reservas
- `ErrorResponse` - Respuestas de error estandarizadas

### 2. **Rutas de la API** (`backend/app/api/v1/routes/reservas.py`)

#### Endpoints Implementados:

**1. Listar Espacios Comunes**
```
GET /api/v1/reservas/espacios
```
- Retorna lista de espacios disponibles (Multicancha, Quincho, Sala de Eventos)
- Datos incluyen nombre, descripción, si requiere pago y precio

**2. Obtener Disponibilidad**
```
GET /api/v1/reservas/espacios/{espacio}/disponibilidad
```
- Parámetros query:
  - `fecha_inicio` (datetime): Inicio de búsqueda
  - `fecha_fin` (datetime): Fin de búsqueda
  - `duracion_minutos` (int): Duración del evento (default: 60)
- Retorna slots disponibles de Google Calendar
- Valida que el espacio sea válido

**3. Crear Reserva**
```
POST /api/v1/reservas/
```
- Body:
  ```json
  {
    "espacio": "multicancha",
    "fecha_hora_inicio": "2025-10-25T18:00:00",
    "fecha_hora_fin": "2025-10-25T19:00:00"
  }
  ```
- Validaciones:
  - Espacio válido
  - Usuario existe
  - Hora fin > hora inicio
  - Disponibilidad en Google Calendar
- Crea evento en Google Calendar
- Crea registro en BD
- Retorna datos de la reserva creada

**4. Listar Reservas del Usuario**
```
GET /api/v1/reservas/usuario/{usuario_id}
```
- Retorna todas las reservas del usuario
- Ordenadas por fecha descendente
- Incluye información del espacio

**5. Cancelar Reserva**
```
DELETE /api/v1/reservas/{reserva_id}
```
- Validaciones:
  - Reserva existe
  - Usuario es propietario
- Elimina evento de Google Calendar
- Elimina registro de BD

### 3. **Modelo de BD Actualizado**
- Agregado campo `google_event_id` a tabla `reservas`
- Permite sincronizar con Google Calendar

### 4. **Script SQL de Migración**
- `sql/004_add_google_event_id_reservas.sql`
- Agrega columna y crea índice

## 🔌 Integración con Google Calendar

El backend automáticamente:
1. Verifica disponibilidad en Google Calendar
2. Crea eventos en Google Calendar
3. Almacena el ID del evento para sincronización
4. Elimina eventos al cancelar

## 🧪 Validaciones Implementadas

✅ Espacios válidos
✅ Usuarios existentes
✅ Fechas lógicas (fin > inicio)
✅ Disponibilidad en Google Calendar
✅ Permisos de usuario (solo puede cancelar sus propias reservas)
✅ Errores HTTP apropiados con mensajes claros

## 📝 Manejo de Errores

- `400 Bad Request`: Datos inválidos, espacio no válido
- `403 Forbidden`: Usuario no tiene permiso
- `404 Not Found`: Recurso no existe
- `409 Conflict`: No hay disponibilidad
- `500 Internal Server Error`: Error del servidor

## 🚀 Próximos Pasos (Fase 3)

Crear servicio React para consumir estos endpoints:
- `src/services/reservasService.js`
- Métodos para:
  - Obtener espacios
  - Obtener disponibilidad
  - Crear reserva
  - Listar reservas
  - Cancelar reserva
