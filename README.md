# 🏢 Sistema de Gestión de Condominio

**Versión:** 1.0.0 | **Estado:** ✅ Production Ready  
**Repositorio:** https://github.com/Cliptap/sistema_de_gestion_condominio

---

## 📋 Descripción General

Sistema web integral para la **gestión y administración de condominios** desarrollado con tecnologías modernas y respaldado por una API REST robusta.

### ✨ Funcionalidades Principales

- 📅 **Reserva de espacios comunes** con integración automática a Google Calendar
- 💰 **Gestión de pagos** - Desglose de cargo fijo, gastos comunes, multas
- 👥 **Administración de residentes** - Registro y asignación de viviendas
- 📊 **Panel de control** - Estadísticas y reportes del condominio
- 🌙 **Tema oscuro/claro** - Interfaz adaptativa y responsive
- 🔐 **Autenticación segura** - JWT tokens y validación en backend

---

## 🚀 Inicio Rápido (5 minutos)

### Requisitos
- **Docker Desktop** v4.0+ (con Docker Compose)
- **Git**
- Cuenta **Google** (para Google Calendar - opcional pero recomendado)

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/Cliptap/sistema_de_gestion_condominio.git
cd sistema_de_gestion_condominio

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Iniciar servicios (Frontend + Backend + Base de datos)
docker-compose up -d

# 4. Acceder a la aplicación
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
# Base de datos: localhost:5432
```

### Credenciales de Prueba

```
Email: residente@example.com
Password: 123456
```

---

## 🌐 API REST - Documentación Completa

**Base URL:** `http://localhost:8000`  
**Documentación interactiva:** `http://localhost:8000/docs` (Swagger UI)

### 1. Health Check

Verificar que el API está funcionando.

```bash
GET /healthz

# Respuesta (200 OK)
{
  "status": "healthy",
  "timestamp": "2025-01-22T15:30:45.123Z"
}
```

---

### 2. Autenticación

#### Login

```bash
POST /api/v1/auth/login

# Body (JSON)
{
  "email": "residente@example.com",
  "password": "123456"
}

# Respuesta (200 OK)
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "residente@example.com",
    "nombre": "Juan Pérez",
    "rol": "residente"
  }
}
```

#### Logout

```bash
POST /api/v1/auth/logout
Authorization: Bearer <token>

# Respuesta (200 OK)
{
  "message": "Logout successful"
}
```

---

### 3. Reservas de Espacios

Gestión de reservas para Multicancha, Quincho y Sala de Eventos.

#### Listar Espacios Disponibles

```bash
GET /api/v1/reservas/espacios/multicancha/disponibilidad?fecha_inicio=2025-10-20&fecha_fin=2025-10-31

# Parámetros
# - espacio: multicancha | quincho | sala_eventos (en URL)
# - fecha_inicio: YYYY-MM-DD (query)
# - fecha_fin: YYYY-MM-DD (query)

# Respuesta (200 OK)
{
  "espacio": "multicancha",
  "slots": [
    {
      "fecha": "2025-10-20",
      "hora_inicio": "08:00",
      "hora_fin": "09:00",
      "disponible": true
    },
    {
      "fecha": "2025-10-20",
      "hora_inicio": "09:00",
      "hora_fin": "10:00",
      "disponible": false,
      "reservado_por": "usuario_123"
    }
  ]
}
```

#### Crear Reserva

```bash
POST /api/v1/reservas/?usuario_id=1
Authorization: Bearer <token>
Content-Type: application/json

# Body
{
  "espacio": "multicancha",
  "fecha_hora_inicio": "2025-10-25T10:00:00",
  "fecha_hora_fin": "2025-10-25T11:00:00"
}

# Parámetros
# - usuario_id: ID del usuario (query)
# - espacio: multicancha | quincho | sala_eventos (body)
# - fecha_hora_inicio: ISO 8601 format (body)
# - fecha_hora_fin: ISO 8601 format (body)

# Respuesta (201 Created)
{
  "id": 42,
  "usuario_id": 1,
  "espacio": "multicancha",
  "fecha_hora_inicio": "2025-10-25T10:00:00",
  "fecha_hora_fin": "2025-10-25T11:00:00",
  "estado": "confirmado",
  "gcal_event_id": "abc123def456",
  "created_at": "2025-01-22T15:30:45.123Z"
}
```

#### Obtener Reservas del Usuario

```bash
GET /api/v1/reservas/usuario/1
Authorization: Bearer <token>

# Parámetros
# - usuario_id: ID del usuario (en URL)

# Respuesta (200 OK)
{
  "usuario_id": 1,
  "reservas": [
    {
      "id": 42,
      "espacio": "multicancha",
      "fecha_hora_inicio": "2025-10-25T10:00:00",
      "fecha_hora_fin": "2025-10-25T11:00:00",
      "estado": "confirmado",
      "gcal_event_id": "abc123def456"
    }
  ]
}
```

#### Cancelar Reserva

```bash
DELETE /api/v1/reservas/42
Authorization: Bearer <token>

# Parámetros
# - reserva_id: ID de la reserva (en URL)

# Respuesta (200 OK)
{
  "message": "Reserva cancelada exitosamente",
  "reserva_id": 42,
  "gcal_event_deleted": true
}
```

---

### 4. Pagos

Información de pagos por residente con desglose detallado.

#### Obtener Estado de Pagos

```bash
GET /api/v1/pagos/residente/1
Authorization: Bearer <token>

# Parámetros
# - usuario_id: ID del residente (en URL)

# Respuesta (200 OK)
{
  "usuario_id": 1,
  "viviendas": [
    {
      "id": 5,
      "numero": "101",
      "cargo_fijo_uf": 2.5
    }
  ],
  "desglose": {
    "cargo_fijo": {
      "monto_total": 250000,
      "estado": "pendiente",
      "vencimiento": "2025-02-28"
    },
    "gastos_comunes": [
      {
        "id": 1,
        "descripcion": "Mantención área verde",
        "monto": 50000,
        "mes": 1,
        "año": 2025,
        "estado": "pendiente"
      }
    ],
    "multas": [
      {
        "id": 1,
        "monto": 25000,
        "fecha_aplicada": "2025-01-15",
        "estado": "pendiente"
      }
    ],
    "reservas": [
      {
        "id": 42,
        "espacio": "multicancha",
        "monto": 15000,
        "estado": "pagado"
      }
    ]
  },
  "totales": {
    "por_pagar": 325000,
    "pagado": 15000,
    "saldo": 325000
  }
}
```

---

### 5. Gastos Comunes

Gastos asociados a una vivienda.

#### Obtener Gastos por Vivienda

```bash
GET /api/v1/gastos/vivienda/5
Authorization: Bearer <token>

# Parámetros
# - vivienda_id: ID de la vivienda (en URL)

# Respuesta (200 OK)
{
  "vivienda_id": 5,
  "gastos": [
    {
      "id": 1,
      "descripcion": "Mantención área verde",
      "monto": 50000,
      "mes": 1,
      "año": 2025,
      "estado": "pendiente",
      "created_at": "2025-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "descripcion": "Reparación ascensor",
      "monto": 120000,
      "mes": 1,
      "año": 2025,
      "estado": "pagado",
      "created_at": "2025-01-10T08:15:00Z"
    }
  ],
  "total_pendiente": 50000,
  "total_pagado": 120000
}
```

---

## 🏛️ Justificación de la API

### ¿Por qué esta API es importante?

#### 1. **Integración Google Calendar (Sincronización Automática)**
- Las reservas se crean automáticamente en Google Calendar
- Evita sobrebooking de espacios
- Los residentes ven sus reservas en su calendario personal
- Notificaciones automáticas por correo

**Implementación:** `backend/app/services/google_calendar_service.py`

#### 2. **Separación Frontend-Backend (Arquitectura Moderna)**
- Frontend (React) es independiente del Backend (FastAPI)
- Permite desarrollo paralelo del equipo
- Fácil de escalar y mantener
- Posibilidad de múltiples clientes (web, mobile, desktop)

#### 3. **Gestión Integral de Pagos**
- Desglose detallado por usuario y vivienda
- Cálculo automático de totales
- Seguimiento de estado de pagos
- Base para futuras integraciones de pagos en línea

#### 4. **Validación en Backend (Seguridad)**
- Toda la lógica de negocio está protegida
- Validación de disponibilidad antes de crear reserva
- Prevención de fraude y modificación no autorizada
- Autenticación JWT para cada endpoint

#### 5. **Base de Datos Relacional (PostgreSQL)**
- Garantiza integridad referencial
- Consultas complejas y reportes
- Respaldos automáticos
- Escalabilidad para miles de residentes

---

## 🗄️ Estructura de Base de Datos

### Tablas Principales

```sql
-- Usuarios del sistema
usuarios
├── id (PRIMARY KEY)
├── email (UNIQUE)
├── password_hash
├── nombre
├── rol (admin | residente)
└── created_at

-- Viviendas del condominio
viviendas
├── id (PRIMARY KEY)
├── numero_vivienda (UNIQUE)
├── cargo_fijo_uf (valor en UF)
└── created_at

-- Relación usuario-vivienda
residentes_viviendas
├── usuario_id (FK → usuarios)
├── vivienda_id (FK → viviendas)
└── estado (activo | inactivo)

-- Reservas con sincronización Google Calendar
reservas
├── id (PRIMARY KEY)
├── usuario_id (FK → usuarios)
├── espacio (multicancha | quincho | sala_eventos)
├── fecha_hora_inicio
├── fecha_hora_fin
├── estado (pendiente | confirmado | cancelado)
├── gcal_event_id (ID en Google Calendar para sincronización)
└── created_at

-- Gastos compartidos entre viviendas
gastos_comunes
├── id (PRIMARY KEY)
├── vivienda_id (FK → viviendas)
├── monto
├── descripción
├── mes
├── año
└── created_at

-- Multas a residentes
multas
├── id (PRIMARY KEY)
├── vivienda_id (FK → viviendas)
├── monto
├── fecha_aplicada
└── created_at

-- Pagos realizados
pagos
├── id (PRIMARY KEY)
├── vivienda_id (FK → viviendas)
├── monto
├── mes | año
├── estado (pendiente | pagado)
└── fecha_pago
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Descripción |
|------|-----------|-------------|
| **Frontend** | React 18 + Vite | Interfaz web moderna con HMR |
| **Frontend** | Tailwind CSS 3 | Estilos responsive y oscuro |
| **Frontend** | React Router v6 | Navegación entre páginas |
| **Backend** | FastAPI | API REST con validación automática |
| **Backend** | SQLAlchemy 2 | ORM para manejo de BD |
| **Backend** | Uvicorn | Servidor ASGI de alto rendimiento |
| **BD** | PostgreSQL 16 | Base de datos relacional |
| **Integración** | Google Calendar API | Sincronización de eventos |
| **DevOps** | Docker Compose | Orquestación de contenedores |

---

## 📝 Ejemplos de Uso Completos

### Caso 1: Crear una Reserva

```bash
# 1. Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "residente@example.com",
    "password": "123456"
  }' > response.json

# Extraer token
TOKEN=$(jq -r '.access_token' response.json)

# 2. Crear reserva
curl -X POST "http://localhost:8000/api/v1/reservas/?usuario_id=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "espacio": "multicancha",
    "fecha_hora_inicio": "2025-10-25T10:00:00",
    "fecha_hora_fin": "2025-10-25T11:00:00"
  }'

# 3. Verificar en Google Calendar
# ➜ La reserva aparece automáticamente en el calendario "Multicancha"
```

### Caso 2: Consultar Estado de Pagos

```bash
# Con token autenticado
curl -X GET "http://localhost:8000/api/v1/pagos/residente/1" \
  -H "Authorization: Bearer $TOKEN"

# Resultado:
# - Cargo fijo mensual: $250.000
# - Gastos comunes: $50.000
# - Multas: $25.000
# - Total por pagar: $325.000
```

### Caso 3: Cancelar Reserva

```bash
curl -X DELETE "http://localhost:8000/api/v1/reservas/42" \
  -H "Authorization: Bearer $TOKEN"

# Resultado:
# - Reserva cancelada en BD
# - Evento eliminado de Google Calendar
# - Usuario no puede volver a usar ese horario
```

---

## 🐳 Comandos Docker

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver estado de servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Logs específicos de un servicio
docker-compose logs -f api

# Reconstruir imágenes (después de cambios)
docker-compose up -d --build

# Parar servicios (sin eliminar datos)
docker-compose down

# Eliminar todo (BD, volúmenes, etc)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart api
```

---

## 🔧 Configuración (Variables de Entorno)

Copiar `.env.example` a `.env` y configurar:

```env
# Google Calendar (obligatorio para sincronización)
GOOGLE_CALENDAR_ID_MULTICANCHA=...@group.calendar.google.com
GOOGLE_CALENDAR_ID_QUINCHO=...@group.calendar.google.com
GOOGLE_CALENDAR_ID_SALA_EVENTOS=...@group.calendar.google.com

# Base de datos
DB_HOST=db
DB_PORT=5432
DB_USER=condouser
DB_PASSWORD=condopass
DB_NAME=condominio

# Aplicación
ENVIRONMENT=development
DEBUG=true
```

---

## ❌ Troubleshooting

### Error: "Connection refused" en pagos

**Problema:** API retorna error de conexión desde Vite proxy

**Causa:** El proxy de Vite está usando `127.0.0.1` en lugar del nombre del servicio Docker

**Solución:** En `vite.config.js`, cambiar:
```javascript
// ❌ INCORRECTO (127.0.0.1 es localhost del contenedor)
target: 'http://127.0.0.1:8000'

// ✅ CORRECTO (api es el nombre del servicio)
target: 'http://api:8000'
```

### Error: "Port 3000 already in use"

```bash
# Encontrar proceso
netstat -ano | findstr :3000

# Matar proceso (Windows)
taskkill /PID <PID> /F

# O cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"
```

### Google Calendar no sincroniza

```bash
# Ver logs del API
docker logs -f sistema_de_gestion_condominio-master-api-1

# Verificar variables de entorno
docker exec -it sistema_de_gestion_condominio-master-api-1 env | grep GOOGLE

# Verificar credenciales
cat google-service-account-key.json
```

---

## 🚀 Deployment

### Opciones Recomendadas

1. **Railway.app** - Deploy automático desde GitHub
2. **Render.com** - Soporte nativo para Docker Compose
3. **Digital Ocean App Platform** - Escalable y confiable
4. **AWS ECS** - Con RDS para PostgreSQL

### Checklist Pre-Deploy

- [ ] Cambiar credenciales de BD
- [ ] Configurar variables de producción
- [ ] Habilitar HTTPS
- [ ] Configurar backups automáticos
- [ ] Revisar logs y monitoring
- [ ] Testear endpoints críticos

---

## 📞 Soporte y Documentación

- **GitHub:** https://github.com/Cliptap/sistema_de_gestion_condominio
- **API Docs (Swagger):** http://localhost:8000/docs
- **Problemas/Issues:** https://github.com/Cliptap/sistema_de_gestion_condominio/issues

---

## 📄 Licencia

Proyecto educativo. Todos los derechos reservados © 2025.

---

**Última actualización:** 22-01-2025  
**Desarrollado por:** Equipo de Desarrollo  
**Versión:** 1.0.0 ✅ Production Ready
