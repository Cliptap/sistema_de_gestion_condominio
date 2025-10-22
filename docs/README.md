# 📚 Documentación - Sistema de Gestión de Condominio

## 📅 Módulo de Reservas con Google Calendar

### Guías de Configuración

1. **[00-FASE1_RESUMEN.md](00-FASE1_RESUMEN.md)** - Resumen general de la Fase 1
2. **[01-GOOGLE_CALENDAR_SETUP.md](01-GOOGLE_CALENDAR_SETUP.md)** - Configuración de Google Calendar API
3. **[02-GOOGLE_CALENDAR_CREDENCIALES_GUIA.md](02-GOOGLE_CALENDAR_CREDENCIALES_GUIA.md)** - Cómo obtener credenciales
4. **[03-FASE2_ENDPOINTS_BACKEND.md](03-FASE2_ENDPOINTS_BACKEND.md)** - Endpoints del backend implementados
5. **[04-FASE3_SERVICIO_REACT.md](04-FASE3_SERVICIO_REACT.md)** - Servicio React para consumir API
6. **[05-FASE4_COMPONENTE_ESPACIOS.md](05-FASE4_COMPONENTE_ESPACIOS.md)** - Componente selector de espacios
7. **[06-FASE5_CALENDARIO_DISPONIBILIDAD.md](06-FASE5_CALENDARIO_DISPONIBILIDAD.md)** - Calendario con slots disponibles
8. **[07-FASE5B_RESERVAS_COMPLETADO.md](07-FASE5B_RESERVAS_COMPLETADO.md)** - Corrección y Finalización de Reservas.jsx

### Estructura del Proyecto

```
docs/
├── 00-FASE1_RESUMEN.md
├── 01-GOOGLE_CALENDAR_SETUP.md
├── 02-GOOGLE_CALENDAR_CREDENCIALES_GUIA.md
├── 03-FASE2_ENDPOINTS_BACKEND.md
├── 04-FASE3_SERVICIO_REACT.md
├── 05-FASE4_COMPONENTE_ESPACIOS.md
├── 06-FASE5_CALENDARIO_DISPONIBILIDAD.md
└── README.md (este archivo)
```

### Fases de Desarrollo

#### Fase 1: ✅ Configuración (COMPLETADA)
- Configuración de Google Calendar API
- Dependencias de frontend y backend
- Servicios Python

#### Fase 2: ✅ Endpoints Backend (COMPLETADA)
- Rutas de espacios comunes
- Rutas de disponibilidad
- Rutas de reservas (crear, listar, cancelar)

#### Fase 3: ✅ Servicio React (COMPLETADA)
- Conexión con API del backend
- Métodos auxiliares para formateo
- Manejo de errores uniforme

#### Fase 4: ✅ Componentes UI - Espacios (COMPLETADA)
- Selector de espacios con toggle
- SVG icons custom
- Tarjetas interactivas

#### Fase 5: ✅ Calendario (COMPLETADA)
- FullCalendar integrado con semana y mes
- Sistema de 3 pasos (Espacios → Disponibilidad → Confirmación)
- Indicador visual de progreso
- Validación de disponibilidad en tiempo real

#### Fase 5B: ✅ Reservas.jsx (COMPLETADA)
- Limpieza de artefactos de merge
- Implementación completa del flujo multi-paso
- Manejo de errores robusto
- Integración con componentes hijos
- Dark mode y responsive design
- FullCalendar integrado
- Visualización de slots disponibles
- Sistema de pasos (Spaces → Calendar → Confirmation)

#### Fase 6: ⏳ Modal de Confirmación (EN PROGRESO)
- Confirmación de reserva mejorada
- Integración con sistema de pagos
- Validaciones robustas

#### Fase 7: ⏳ Validaciones y Errores (PENDIENTE)
- Validación de disponibilidad
- Manejo de conflictos
- Mensajes de error mejorados

---

## 🚀 Primeros Pasos

### Para Configurar Credenciales

1. Lee [02-GOOGLE_CALENDAR_CREDENCIALES_GUIA.md](02-GOOGLE_CALENDAR_CREDENCIALES_GUIA.md)
2. Obtén tus credenciales de Google Cloud
3. Sigue [01-GOOGLE_CALENDAR_SETUP.md](01-GOOGLE_CALENDAR_SETUP.md)
4. Configura tu `.env` local

### Para Entender la Arquitectura

1. Lee [03-FASE2_ENDPOINTS_BACKEND.md](03-FASE2_ENDPOINTS_BACKEND.md)
2. Lee [04-FASE3_SERVICIO_REACT.md](04-FASE3_SERVICIO_REACT.md)
3. Revisa [05-FASE4_COMPONENTE_ESPACIOS.md](05-FASE4_COMPONENTE_ESPACIOS.md)
4. Entiende [06-FASE5_CALENDARIO_DISPONIBILIDAD.md](06-FASE5_CALENDARIO_DISPONIBILIDAD.md)

---

## 📦 Archivos Clave

### Backend
- `backend/app/core/google_calendar.py` - Configuración
- `backend/app/services/google_calendar_service.py` - Servicio de Google Calendar
- `backend/app/api/v1/routes/reservas.py` - Endpoints
- `backend/app/schemas/reservas.py` - Modelos Pydantic

### Frontend
- `src/services/reservasService.js` - Servicio React
- `src/components/Reservas/EspaciosSelector.jsx` - Selector de espacios
- `src/components/Reservas/CalendarioDisponibilidad.jsx` - Calendario
- `src/components/pages/Reservas.jsx` - Componente principal

### Base de Datos
- `sql/004_add_google_event_id_reservas.sql` - Migración para tabla reservas

---

## 🔧 Configuración de Variables de Entorno

Ver `.env.example` para todas las variables disponibles.

Esencial:
- `GOOGLE_CALENDAR_API_KEY` o `GOOGLE_SERVICE_ACCOUNT_KEY_PATH`
- `GOOGLE_CALENDAR_ID_MULTICANCHA`
- `GOOGLE_CALENDAR_ID_QUINCHO`
- `GOOGLE_CALENDAR_ID_SALA_EVENTOS`

---

## 📝 API Endpoints

### Espacios
- `GET /api/v1/reservas/espacios` - Listar espacios

### Disponibilidad
- `GET /api/v1/reservas/espacios/{espacio}/disponibilidad` - Slots disponibles

### Reservas
- `POST /api/v1/reservas/` - Crear reserva
- `GET /api/v1/reservas/usuario/{usuario_id}` - Listar reservas del usuario
- `DELETE /api/v1/reservas/{reserva_id}` - Cancelar reserva

---

## ✨ Características Implementadas

✅ Integración con Google Calendar API
✅ 3 espacios comunes (Multicancha, Quincho, Sala de Eventos)
✅ Selector de espacios con toggle
✅ Calendario interactivo con slots
✅ Sistema de pasos (paso a paso)
✅ Dark mode en todos los componentes
✅ Responsive design (mobile, tablet, desktop)
✅ Manejo de errores con reintentos
✅ SVG icons custom
✅ Animaciones suaves

---

## 🔐 Seguridad

- Credenciales en variables de entorno
- `.env` no se sube a GitHub
- Token JWT en interceptor de Axios
- Validación en backend
- Solo residentes pueden ver/cambiar sus propias reservas

---

## 📞 Soporte

Para preguntas sobre configuración, revisa los archivos `.md` correspondientes.
Para errores técnicos, verifica los logs del backend y la consola del navegador.

---

**Última actualización:** Octubre 2025
