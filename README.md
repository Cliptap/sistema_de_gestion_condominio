# EspacioAdmin - Sistema de Gestión de Condominios

**Sistema completo de gestión de condominios** con backend **FastAPI**, frontend web **React + Vite**, aplicación móvil **React Native + Expo**, base de datos **PostgreSQL** y autenticación social **Firebase**.

---

## 🚀 Inicio Rápido

### Con Docker Compose (Recomendado)

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd sistema_de_gestion_condominio

# 2. Crear .env en la raíz
cp .env.example .env

# 3. Iniciar servicios
docker-compose up -d

# 4. Acceder a:
# Backend API: http://localhost:8000
# Swagger Docs: http://localhost:8000/docs
# Frontend: http://localhost:3000 (si está configurado)
```

### Sin Docker (Desarrollo Local)

#### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend Web
```bash
cd frontend
npm install
npm run dev
```

#### App Móvil
```bash
cd mobile
npm install
npm start --web  # Para Expo Web (desarrollo)
# O: eas build --platform android  # Para compilar APK
```

---

## 📋 Tabla de Contenidos

1. [Características](#-características)
2. [Requisitos](#-requisitos)
3. [Instalación Detallada](#-instalación-detallada)
4. [Configuración](#-configuración)
5. [Uso](#-uso)
6. [Autenticación](#-autenticación)
7. [API Endpoints](#-api-endpoints)
8. [Estructura del Proyecto](#-estructura-del-proyecto)
9. [Aplicación Móvil](#-aplicación-móvil)
10. [Troubleshooting](#-troubleshooting)

---

## ✨ Características

### Backend
- ✅ **FastAPI** con Swagger automático
- ✅ **PostgreSQL** como BD relacional
- ✅ **JWT** para autenticación segura
- ✅ **Firebase Admin SDK** para verificar Google Sign-In
- ✅ **SQLAlchemy ORM** para manejo de datos
- ✅ **CORS** configurado para múltiples orígenes

### Frontend Web
- ✅ **React 18+** con hooks
- ✅ **Vite** como bundler rápido
- ✅ **Tailwind CSS** para diseño responsivo
- ✅ **React Router** para navegación
- ✅ **Axios** para peticiones HTTP

### Aplicación Móvil
- ✅ **React Native + Expo** para iOS/Android
- ✅ **Expo Web** para versión web
- ✅ **Firebase Auth** con Google Sign-In
- ✅ **expo-secure-store** para tokens seguros
- ✅ **EAS Build** para compilación de APK

### Funcionalidades
- ✅ **Autenticación:** Email/contraseña + Google Sign-In
- ✅ **Dashboard personalizado** según rol
- ✅ **Gestión de gastos comunes**
- ✅ **Gestión de pagos y multas**
- ✅ **Reserva de espacios comunes**
- ✅ **Sistema de anuncios**
- ✅ **Control de acceso por roles**

---

## 🔧 Requisitos

- **Python 3.11+**
- **Node.js 18+** con npm
- **PostgreSQL 14+** (o Docker)
- **Git**
- **Cuenta Firebase** (para Google Sign-In)
- **Expo CLI:** `npm install -g eas-cli expo-cli`

---

## 💻 Instalación Detallada

### 1. Backend

```bash
cd backend

# Crear entorno virtual
python -m venv .venv

# Activar (Windows)
.venv\Scripts\activate
# O (Linux/Mac)
source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar .env en la raíz del proyecto
# (Ver sección de Configuración)

# Iniciar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Acceder a:** http://localhost:8000
- **Swagger:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### 2. Frontend Web

```bash
cd frontend

# Instalar dependencias
npm install

# Crear .env.local (opcional)
# VITE_API_URL=http://localhost:8000/api/v1

# Iniciar desarrollo
npm run dev
```

**Acceder a:** http://localhost:3000 o el puerto que indique Vite

### 3. Aplicación Móvil

```bash
cd mobile

# Instalar dependencias
npm install

# Opción A: Expo Web (desarrollo rápido)
npm start --web
# Acceder a: http://localhost:19000

# Opción B: Emulador Android
npm start
# Presionar 'a' en terminal para abrir emulador

# Opción C: Dispositivo físico
npm start
# Escanear código QR con Expo Go app

# Opción D: Compilar APK
eas build --platform android --profile preview
# Descargar desde https://expo.dev/builds
```

---

## ⚙️ Configuración

### Variables de Entorno (.env en raíz del proyecto)

```env
# DATABASE
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=condominio_db

# JWT
JWT_SECRET_KEY=tu-clave-secreta-CAMBIAR-EN-PRODUCCION
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440

# FIREBASE (opcional, solo si usas Google Sign-In)
FIREBASE_PROJECT_ID=espacioadmin
FIREBASE_PRIVATE_KEY_ID=xxx
FIREBASE_PRIVATE_KEY=xxx
FIREBASE_CLIENT_EMAIL=xxx@iam.gserviceaccount.com
FIREBASE_CLIENT_ID=xxx
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

### Firebase Setup (Para Google Sign-In)

1. Ir a https://console.firebase.google.com
2. Crear proyecto "espacioadmin"
3. Habilitar "Google Sign-In"
4. OAuth 2.0 Client IDs:
   - Tipo: Aplicación de navegador web
   - URIs autorizados:
     - `http://localhost:3000`
     - `http://localhost:19000`
     - `https://auth.expo.io/@cliptap/mobile`
5. Android OAuth Client ID:
   - Package: `com.espacioadmin.mobile`
   - SHA-1: (obtener de EAS Build)
6. Copiar credenciales a archivos de config

---

## 📖 Uso

### Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@test.com | password123 | Administrador |
| conserje@test.com | password123 | Conserje |
| residente@test.com | password123 | Residente |

O registrarse directamente en la aplicación.

### Flujo de Login

1. **Opción 1: Email y Contraseña**
   - Ingresar email y contraseña
   - Tomar token JWT del backend
   - Guardar en SecureStore (móvil) o localStorage (web)

2. **Opción 2: Google Sign-In**
   - Tomar OAuth 2.0 de Google
   - Obtener Firebase ID Token
   - Enviar a `/api/v1/auth/firebase-login`
   - Backend verifica con Firebase Admin SDK
   - Backend crea/busca usuario en BD
   - Emite JWT propio y lo devuelve
   - App guarda JWT

---

## 🔐 Autenticación

### Endpoints de Auth

```
POST   /api/v1/auth/register          - Registrar usuario
POST   /api/v1/auth/login             - Login email/pwd
POST   /api/v1/auth/firebase-login    - Login Google/Firebase
GET    /api/v1/auth/me                - Usuario actual (requiere token)
```

### Roles y Permisos

| Rol | Dashboard | Gastos | Pagos | Multas | Reservas | Anuncios |
|-----|-----------|--------|-------|--------|----------|----------|
| Residente | Propio | - | Propios | Propias | CRUD propias | Ver |
| Conserje | Básico | - | Todos | Ver/Crear | Ver todas | - |
| Directiva | Todo | Ver | - | Ver todas | - | CRUD |
| Admin | Todo | CRUD | Todos | CRUD | Todos | CRUD |

---

## 🔌 API Endpoints Principales

```
# Autenticación
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/firebase-login
GET    /api/v1/auth/me

# Dashboard
GET    /api/v1/dashboard/stats/{usuario_id}

# Gastos
GET    /api/v1/gastos/vivienda/{vivienda_id}
GET    /api/v1/gastos/usuario/{usuario_id}

# Pagos
GET    /api/v1/pagos/residente/{usuario_id}
GET    /api/v1/pagos/todos

# Multas
GET    /api/v1/multas/residente/{usuario_id}
GET    /api/v1/multas/todas
POST   /api/v1/multas/

# Reservas
GET    /api/v1/reservas/espacios
GET    /api/v1/reservas/espacios/{espacio}/disponibilidad
POST   /api/v1/reservas/
GET    /api/v1/reservas/usuario/{usuario_id}
DELETE /api/v1/reservas/{reserva_id}

# Anuncios
GET    /api/v1/anuncios/activos
POST   /api/v1/anuncios/
PUT    /api/v1/anuncios/{anuncio_id}
DELETE /api/v1/anuncios/{anuncio_id}
```

**Nota:** Todos requieren `Authorization: Bearer <token>` excepto login y register.

---

## 📱 Aplicación Móvil

### Características

- **Dual authentication:** Email/contraseña y Google Sign-In
- **Tokens seguros:** Almacenados en expo-secure-store (encriptado)
- **Multiplataforma:** iOS, Android, Web
- **Responsive:** Optimizado para móvil, tablet y web

### Ejecutar en Desarrollo

**Expo Web** (más rápido):
```bash
cd mobile
npm start --web
# Acceder a: http://localhost:19000
```

**Emulador Android:**
```bash
cd mobile
npm start
# Presionar 'a' en terminal
```

**Dispositivo Físico:**
```bash
cd mobile
npm start
# Escanear QR con Expo Go (App Store / Google Play)
```

### Compilar APK

```bash
cd mobile
eas build --platform android --profile preview
```

Descargar desde: https://expo.dev/builds

**Requisitos:**
- Cuenta en https://expo.dev (gratis)
- Ejecutar `eas init` una vez

### Estructura de Rutas (Expo Router)

```
app/
├── login.js                 # Pantalla login
├── _layout.js              # Layout principal
├── (tabs)/
│   ├── home.js            # Inicio
│   ├── perfil.js          # Perfil de usuario
│   └── ...
└── ...
```

---

## 📁 Estructura del Proyecto

```
sistema_de_gestion_condominio/
│
├── backend/                 # FastAPI + PostgreSQL
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── router.py
│   │   │   └── routes/
│   │   │       ├── auth.py
│   │   │       ├── dashboard.py
│   │   │       ├── gastos.py
│   │   │       ├── pagos.py
│   │   │       ├── multas.py
│   │   │       ├── reservas.py
│   │   │       ├── anuncios.py
│   │   │       └── ...
│   │   ├── core/
│   │   │   ├── auth.py    # Dependencias JWT
│   │   │   ├── security.py # Bcrypt + JWT
│   │   │   └── config.py  # Variables entorno
│   │   ├── db/
│   │   │   ├── session.py
│   │   │   └── deps.py
│   │   ├── models/
│   │   │   └── models.py  # SQLAlchemy
│   │   ├── schemas/
│   │   │   └── *.py       # Pydantic
│   │   └── main.py        # FastAPI app
│   ├── requirements.txt
│   ├── Dockerfile
│   └── start.sh
│
├── frontend/               # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Gastos.jsx
│   │   │   │   ├── Pagos.jsx
│   │   │   │   ├── Multas.jsx
│   │   │   │   ├── Reservas.jsx
│   │   │   │   ├── Anuncios.jsx
│   │   │   │   └── ...
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── MainApp.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── mobile/                 # React Native + Expo
│   ├── app/
│   │   ├── login.js       # Login screen
│   │   ├── _layout.js
│   │   └── (tabs)/
│   │       ├── home.js
│   │       ├── perfil.js
│   │       └── ...
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── components/
│   ├── firebaseConfig.js
│   ├── app.json
│   ├── eas.json
│   └── package.json
│
├── database/
│   └── condominio_db.sql  # Script SQL inicial
│
├── docs/                  # Documentación
│   ├── DOCUMENTO_INTEGRACION_MOBILE.md
│   ├── 02-ARCHITECTURE.md
│   ├── 03-DEVELOPMENT.md
│   └── ...
│
├── docker-compose.yml
├── docker-compose-aws.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🗄️ Base de Datos

### Motor: PostgreSQL

**Tablas principales:**
- `usuario` - Usuarios del sistema
- `vivienda` - Viviendas del condominio
- `gasto_comun` - Gastos compartidos
- `pago` - Pagos realizados
- `multa` - Multas aplicadas
- `espacio_comun` - Espacios comunes
- `reserva` - Reservas de espacios
- `anuncio` - Anuncios

**Inicialización automática:**
SQLAlchemy crea las tablas al iniciar la app. Para datos iniciales:

```bash
psql -U postgres -d condominio_db < database/condominio_db.sql
```

---

## 🐳 Docker

### Iniciar con Docker Compose

```bash
docker-compose up -d
```

**Servicios:**
- Backend en puerto 8000
- PostgreSQL en puerto 5432
- Frontend en puerto 3000 (opcional)

### Comandos Útiles

```bash
# Ver logs
docker-compose logs -f backend
docker-compose logs -f db

# Detener
docker-compose down

# Reconstruir
docker-compose build --no-cache

# Acceder a bash
docker-compose exec backend bash
```

---

## 🔧 Troubleshooting

### "Cannot connect to database"
```bash
# Verificar que PostgreSQL esté corriendo
# Si usas Docker: docker-compose up -d db
# Si es local: asegúrate que el servicio esté activo
```

### "ModuleNotFoundError" en backend
```bash
cd backend
pip install -r requirements.txt
```

### "CORS error" en frontend
- El backend ya soporta `localhost:3000`, `localhost:19000`
- Para otro puerto, agregar en `backend/app/main.py`

### "Something went wrong trying to finish signing in" (Expo Web)
```bash
# Limpiar cache
npm cache clean --force

# Reiniciar Expo
npm start --web
```

### Google Sign-In no funciona en APK Android
1. Verificar SHA-1 en Google Cloud Console
2. Verificar package name es `com.espacioadmin.mobile`
3. Verificar Firebase Project ID en `firebaseConfig.js`

### App móvil no se conecta al backend
- Verificar URL en `mobile/src/services/api.js`
- En desarrollo: usar `ngrok` para exponer backend
- En producción: usar URL HTTPS del servidor real

---

## 📚 Documentación Adicional

- **API Swagger:** http://localhost:8000/docs
- **API ReDoc:** http://localhost:8000/redoc
- **Integración Mobile:** `/docs/DOCUMENTO_INTEGRACION_MOBILE.md`
- **Arquitectura:** `/docs/02-ARCHITECTURE.md`
- **Desarrollo:** `/docs/03-DEVELOPMENT.md`

---

## 🔒 Seguridad

### En Producción

1. ✅ **Cambiar `JWT_SECRET_KEY`** en `.env`
2. ✅ **Usar HTTPS** (no HTTP)
3. ✅ **Configurar CORS** específicamente
4. ✅ **Rate limiting** para prevenir abuso
5. ✅ **Backups regulares** de PostgreSQL
6. ✅ **Mantener dependencias actualizadas**
7. ✅ **Variables de entorno** para secretos (no en código)

---

## 📝 Scripts Disponibles

### Backend
```bash
uvicorn app.main:app --reload      # Desarrollo
gunicorn app.main:app --workers 4  # Producción
```

### Frontend
```bash
npm run dev      # Desarrollo
npm run build    # Compilar producción
npm run preview  # Vista previa producción
```

### Mobile
```bash
npm start --web              # Expo Web
npm start                    # Desarrollo
eas build --platform android # Compilar APK
```

---

## 💡 Tips

1. **Desarrollo rápido móvil:** Usa Expo Web, no necesitas compilar APK
2. **Debugging:** Abre Swagger http://localhost:8000/docs para probar endpoints
3. **Firebase:** Asegúrate de que OAuth URIs estén autorizados
4. **Tokens:** Se almacenan en SecureStore (móvil) y localStorage (web)
5. **API:** Todos los endpoints protegidos requieren header `Authorization: Bearer <token>`

---

## 📞 Soporte

Para problemas:
1. Revisar `/docs` para documentación detallada
2. Revisar logs: `docker-compose logs backend`
3. Consultar Swagger: http://localhost:8000/docs
4. Revisar console en navegador (browser DevTools)

---

**Desarrollado con ❤️ para la gestión eficiente de condominios**

Última actualización: **Noviembre 2025**  
Versión: **1.0.0**
