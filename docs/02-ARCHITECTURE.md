# 🏗️ Arquitectura y Estructura del Proyecto

## Visión General

Este es un proyecto **Full Stack** con arquitectura cliente-servidor:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Navegador Web                              │
│                    (localhost:3000)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │
┌─────────────────────────────────────────────────────────────────┐
│                     Vite Dev Server                              │
│                    (React + Tailwind)                            │
│            Proxy → http://api:8000 (Docker)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              │
┌─────────────────────────────────────────────────────────────────┐
│                     FastAPI Backend                              │
│                    (localhost:8000)                              │
│           SQLAlchemy ORM + PostgreSQL                           │
│         + Google Calendar Integration                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL 16                                 │
│                    (localhost:5432)                              │
└─────────────────────────────────────────────────────────────────┘
```

## Stack Tecnológico

### Frontend (src/)
- **Framework:** React 18 + Vite
- **Estilos:** Tailwind CSS 3 con soporte Dark Mode
- **Routing:** React Router v6
- **Estado:** Context API (AuthContext, ThemeContext)
- **HTTP:** Fetch API nativa
- **Componentes:** Funcionales con Hooks

### Backend (backend/)
- **Framework:** FastAPI + Uvicorn
- **ORM:** SQLAlchemy 2
- **Base de datos:** PostgreSQL 16
- **Autenticación:** JWT (mock en desarrollo)
- **CORS:** Habilitado para localhost:3000, localhost:3001
- **Integración:** Google Calendar Service Account

### Infraestructura
- **Containerización:** Docker + Docker Compose
- **Servicios:** 3 contenedores (app, api, db)
- **Redes:** Docker network para comunicación interna
- **Health Checks:** En todos los servicios

## Estructura de Directorios

```
sistema_de_gestion_condominio/
│
├── 📄 Configuración de Proyecto
│   ├── docker-compose.yml       ← Orquestación de contenedores
│   ├── Dockerfile               ← Imagen del frontend
│   ├── vite.config.js           ← Configuración de Vite + Proxy
│   ├── tailwind.config.js       ← Estilos Tailwind
│   ├── postcss.config.js        ← Post-procesamiento de CSS
│   ├── package.json             ← Dependencias de frontend
│   ├── .env.example             ← Template de variables
│   ├── .gitignore               ← Archivos ignorados en Git
│   └── index.html               ← Punto de entrada HTML
│
├── 📁 Frontend (src/)
│   ├── main.jsx                 ← Punto de entrada React
│   ├── index.css                ← Estilos globales
│   ├── App.jsx                  ← Componente raíz
│   │
│   ├── 🎨 components/
│   │   ├── LoginScreen.jsx      ← Pantalla de login
│   │   ├── MainApp.jsx          ← Layout principal con Sidebar
│   │   ├── Sidebar.jsx          ← Navegación principal
│   │   ├── ToastContainer.jsx   ← Notificaciones
│   │   │
│   │   └── 📄 pages/
│   │       ├── Dashboard.jsx    ← Página principal
│   │       ├── Residentes.jsx   ← Gestión de residentes
│   │       ├── Usuarios.jsx     ← Gestión de usuarios
│   │       ├── Condominios.jsx  ← Configuración de espacios
│   │       ├── Reservas.jsx     ← Sistema de reservas
│   │       ├── Pagos.jsx        ← Estado de pagos
│   │       ├── Gastos.jsx       ← Registro de gastos
│   │       ├── Morosidad.jsx    ← Control de morosidad
│   │       └── Perfil.jsx       ← Perfil del usuario
│   │
│   ├── 🔌 context/
│   │   ├── AuthContext.jsx      ← Autenticación y usuario
│   │   └── ThemeContext.jsx     ← Tema (light/dark)
│   │
│   └── 📡 services/
│       ├── pagosService.js      ← Cliente API para pagos
│       └── ufService.js         ← Cliente API para UF
│
├── 🐍 Backend (backend/)
│   ├── requirements.txt         ← Dependencias Python
│   ├── Dockerfile               ← Imagen del backend
│   │
│   └── 📁 app/
│       ├── main.py              ← Aplicación FastAPI
│       │
│       ├── 🔧 api/v1/
│       │   ├── router.py        ← Registro de rutas
│       │   │
│       │   └── 📄 routes/
│       │       ├── auth.py      ← Endpoints de autenticación
│       │       ├── gastos.py    ← Endpoints de gastos
│       │       ├── pagos.py     ← Endpoints de pagos
│       │       └── reservas.py  ← Endpoints de reservas
│       │
│       ├── 📊 db/
│       │   ├── session.py       ← Configuración de BD
│       │   └── deps.py          ← Dependencias (ej: SessionLocal)
│       │
│       ├── 🗄️ models/
│       │   └── models.py        ← Modelos SQLAlchemy
│       │
│       └── ⚙️ core/
│           └── config.py        ← Configuración global
│
├── 💾 SQL (sql/)
│   ├── 001_schema_residente.sql ← Esquema base de datos
│   ├── 002_seed_residente.sql   ← Datos de ejemplo
│   └── 003_add_cargo_fijo_uf.sql← Migraciones
│
├── 📚 Documentation (docs/)
│   ├── 00-QUICK_START.md        ← Guía de inicio rápido
│   ├── 01-GOOGLE_CALENDAR_SETUP.md ← Configuración de Google Calendar
│   └── 02-ARCHITECTURE.md       ← Este archivo
│
├── README.md                    ← Documentación principal
└── .env.example                 ← Template de variables
```

## Flujo de Datos Clave

### 1. Autenticación

```
LoginScreen
    ↓ (credenciales)
AuthContext (local state)
    ↓ (JWT mock)
App (redirige a Dashboard)
```

### 2. Reserva de Espacio

```
Reservas.jsx
    ↓ (selecciona espacio, fecha, hora)
/api/v1/reservas (POST)
    ↓
Backend: Valida disponibilidad
    ↓
GoogleCalendarService: Crea evento
    ↓
Base de datos: Almacena reserva
    ↓
Frontend: Recibe confirmación
```

### 3. Consulta de Pagos

```
Pagos.jsx
    ↓ (user_id)
/api/v1/pagos/residente/{user_id} (GET)
    ↓
Backend: Consulta BD
    ↓
Viviendas, Cargo Fijo, Gastos, Multas
    ↓
Frontend: Renderiza tabla de pagos
```

## Comunicación Entre Servicios

### Desde Frontend a Backend

**Configuración:** `vite.config.js`
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://api:8000',  // 🔑 Nombre de servicio Docker
      changeOrigin: true
    }
  }
}
```

**¡IMPORTANTE!** Dentro de Docker:
- ✅ Use `http://api:8000` (service name)
- ❌ NO use `http://127.0.0.1:8000` (container localhost)
- ❌ NO use `http://localhost:8000` (host localhost)

### Desde Backend a Base de Datos

**Configuración:** `backend/app/db/session.py`
```python
DATABASE_URL = "postgresql://condouser:condopass@db:5432/condominio"
```

**Convención:** 
- Host: `db` (nombre del servicio Docker)
- Puerto: `5432` (puerto estándar PostgreSQL)

## Modelos de Base de Datos

```sql
viviendas
├── id
├── numero_vivienda
├── propietario_id (FK → usuarios)
└── ...

usuarios
├── id
├── email
├── password_hash
├── nombre
├── rol (admin, residente)
└── ...

reservas
├── id
├── usuario_id (FK → usuarios)
├── espacio (multicancha | quincho | sala_eventos)
├── fecha_hora_inicio
├── fecha_hora_fin
├── estado
├── gcal_event_id (event_id de Google Calendar)
└── ...

pagos
├── id
├── vivienda_id (FK → viviendas)
├── monto
├── mes
├── año
├── estado (pagado | pendiente)
└── ...

gastos_comunes
├── id
├── vivienda_id (FK → viviendas)
├── monto
├── descripción
└── ...

multas
├── id
├── vivienda_id (FK → viviendas)
├── monto
├── fecha_aplicada
└── ...
```

## Configuración de Variables de Entorno

```env
# Frontend
VITE_API_URL=http://localhost:8000/api

# Backend - Base de Datos
DB_HOST=db
DB_PORT=5432
DB_USER=condouser
DB_PASSWORD=condopass
DB_NAME=condominio

# Backend - Google Calendar
GOOGLE_CALENDAR_ID_MULTICANCHA=...@group.calendar.google.com
GOOGLE_CALENDAR_ID_QUINCHO=...@group.calendar.google.com
GOOGLE_CALENDAR_ID_SALA_EVENTOS=...@group.calendar.google.com

# Aplicación
ENVIRONMENT=development
DEBUG=true
```

## Ciclo de Vida de Contenedores

### Startup (docker-compose up -d)

```
1. db (PostgreSQL)
   ├── Espera a que esté listo (health check)
   ├── Ejecuta sql/001_schema_residente.sql
   ├── Ejecuta sql/002_seed_residente.sql
   └── ✅ Listo en puerto 5432

2. api (FastAPI)
   ├── Espera a db
   ├── Conecta a PostgreSQL
   ├── Lee .env
   ├── Inicializa rutas
   └── ✅ Listo en puerto 8000

3. app (Vite)
   ├── Espera a api
   ├── Instala dependencias
   ├── Inicia dev server
   ├── Proxy configurado → http://api:8000
   └── ✅ Listo en puerto 3000
```

## Errores Comunes y Causas

| Error | Causa | Solución |
|-------|-------|----------|
| `Connection refused` en pagos | Proxy no alcanza backend | Verificar `vite.config.js` usa `http://api:8000` |
| `Database connection error` | Backend no alcanza BD | Verificar `db` está ejecutándose: `docker ps` |
| `GOOGLE_CALENDAR_API_KEY not found` | .env no está en raíz | Crear `.env` desde `.env.example` |
| `Port 3000 already in use` | Otro proceso usa el puerto | `docker-compose down` y reintentar |
| `Module not found` en imports | Dependencias no instaladas | `docker-compose up -d --build` |

## Best Practices para Desarrollo

### Frontend
1. Componentes funcionales con Hooks
2. Estado global con Context API (solo cuando sea necesario)
3. Estilos con Tailwind (no CSS separado)
4. Eventos a través de servicios centralizados

### Backend
1. Rutas organizadas por módulos (`routes/`)
2. Validación con Pydantic
3. Logging detallado para debugging
4. Transacciones de BD cuando sea necesario

### Docker
1. Siempre usar nombres de servicios (`api`, `db`) internamente
2. No confiar en localhost dentro de contenedores
3. Health checks en servicios críticos
4. Volumes para data persistente

## Testing

```bash
# Frontend - Tests con Vitest (cuando esté configurado)
npm test

# Backend - Tests con pytest
docker exec sistema_de_gestion_condominio-master-api-1 pytest
```

## Deployment

Ver `README.md` sección "Deployment" para opciones:
- AWS ECS
- Digital Ocean App Platform
- Railway
- Render
