# Documento de Integración Full-Stack
## Aplicación Móvil EspacioAdmin en React Native

**Asignatura:** Desarrollo Web y Móvil  
**Taller:** 4 - Integración Full-Stack con Aplicación Móvil en React Native  
**Grupo:** Cliptap  
**Fecha:** Noviembre 2025

---

## 1. Introducción

Este documento describe la arquitectura técnica, flujos de autenticación e integración entre los componentes de la solución completa del sistema de gestión de condominios **EspacioAdmin**, que incluye:

- **Backend REST API:** FastAPI + PostgreSQL
- **Frontend Web:** React + Vite
- **Aplicación Móvil:** React Native + Expo
- **Autenticación Social:** Firebase Authentication + JWT

La solución implementa un patrón de autenticación híbrido que combina Firebase Authentication (autenticación) con JWT interno (autorización), permitiendo a usuarios autenticarse mediante redes sociales (Google Sign-In) en la aplicación móvil, manteniendo compatibilidad con el backend existente.

---

## 2. Arquitectura General del Sistema

### 2.1 Componentes Principales

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE MÓVIL                            │
│  React Native + Expo + Firebase Auth                        │
│  (iOS/Android via EAS Build)                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                ┌───────▼────────┐
                │  Google OAuth  │
                │   (Google)     │
                └───────┬────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
    ┌────────────────────────────────────────┐
    │ Firebase Authentication                │
    │ (ID Token Generation)                  │
    │ ID Token: {email, aud, iat, exp}      │
    └────────────────┬───────────────────────┘
                     │
                     │ ID Token Exchange
                     │
    ┌────────────────▼───────────────────────┐
    │  Backend API (FastAPI)                 │
    │  POST /api/v1/auth/firebase-login      │
    │  • Verifies Firebase ID Token          │
    │  • Creates/Updates User in DB          │
    │  • Returns JWT (Internal)              │
    │  JWT: {sub, iat, exp, permissions}     │
    └────────────────┬───────────────────────┘
                     │
                     │ JWT (Subsequent Requests)
                     │
    ┌────────────────▼───────────────────────┐
    │ Protected API Endpoints                │
    │ /api/v1/usuarios (GET)                 │
    │ /api/v1/reservas (POST/PUT)            │
    │ /api/v1/gastos (GET/POST)              │
    └────────────────────────────────────────┘
```

### 2.2 Tecnologías Utilizadas

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| **Backend** | FastAPI | 0.104+ |
| **Database** | PostgreSQL | 14+ |
| **ORM** | SQLAlchemy | 2.0+ |
| **Auth Backend** | Python-jose | 3.3+ |
| **Auth Social** | Firebase Admin SDK | 6.3+ |
| **Mobile Framework** | React Native | 0.73+ |
| **Mobile CLI** | Expo | 51+ |
| **Mobile Build** | EAS Build | - |
| **Mobile Auth** | expo-auth-session | 5+ |
| **Mobile Auth** | Firebase Web SDK | 10.7+ |
| **API Client** | Axios | 1.6+ |
| **State Mgmt** | React Context API | - |
| **Secure Storage** | expo-secure-store | 12+ |

---

## 3. Flujo de Autenticación Social (Firebase + JWT)

### 3.1 Diagrama de Secuencia

```
┌──────────────────┐         ┌─────────────┐        ┌──────────────┐       ┌──────────────┐
│   App Móvil      │         │  Google     │        │ Firebase     │       │   Backend    │
│  (React Native)  │         │             │        │              │       │  (FastAPI)   │
└────────┬─────────┘         └─────────────┘        └──────────────┘       └──────────────┘
         │                                                                         │
         │  1. Pulse botón "Google Login"                                         │
         │──────────────────────────────────────────────────────────────────────>│
         │                                                                         │
         │  2. Abre Chrome Custom Tabs con Google Consent Screen                  │
         │  (expo-auth-session maneja esto)                                       │
         ├──────────────────────────────────────────────────────────────>         │
         │                                                                         │
         │  3. Usuario selecciona cuenta y autoriza                               │
         │                         (Google Server)                                │
         │<──────────────────────────────────────────────────────────────         │
         │                                                                         │
         │  4. Google retorna ID Token y Authorization Code                       │
         │<──────────────────────────────────────────────────────────             │
         │                                                                         │
         │  5. expo-auth-session captura respuesta (deeplink)                     │
         │  y extrae ID Token                                                     │
         │                                                                         │
         │  6. Crea credencial Firebase (GoogleAuthProvider.credential)           │
         │                                                                         │
         │  7. signInWithCredential(auth, credential)                             │
         ├──────────────────────────────────────────────────────>                │
         │                                                              (Firebase │
         │                                                               Validates │
         │                                                               Google ID │
         │                                                               Token)   │
         │  8. Firebase retorna Firebase User Session                            │
         │<──────────────────────────────────────────────────────                │
         │                                                                         │
         │  9. Obtiene Firebase ID Token: getIdToken()                            │
         │  Firebase ID Token: {                                                  │
         │    "iss": "https://securetoken.google.com/espacioadmin",               │
         │    "aud": "espacioadmin",                                              │
         │    "auth_time": 1700000000,                                            │
         │    "user_id": "abc123xyz",                                             │
         │    "sub": "abc123xyz",                                                 │
         │    "iat": 1700000000,                                                  │
         │    "exp": 1700003600,                                                  │
         │    "email": "user@gmail.com",                                          │
         │    "email_verified": true,                                             │
         │    "firebase": {                                                       │
         │      "identities": {"google.com": ["..."]},                            │
         │      "sign_in_provider": "google.com"                                  │
         │    }                                                                   │
         │  }                                                                     │
         │                                                                         │
         │  10. POST /api/v1/auth/firebase-login                                  │
         │      { "id_token": "<firebase_id_token>" }                             │
         ├─────────────────────────────────────────────────────────────────────>│
         │                                                                         │
         │                                                                 [Backend Verifies │
         │                                                                 Firebase Token │
         │                                                                 Using Firebase │
         │                                                                 Admin SDK]│
         │                                                                         │
         │  11. Backend extrae email del token                                   │
         │      Busca/crea usuario en PostgreSQL                                 │
         │      Emite JWT interno del sistema:                                   │
         │      JWT: {                                                            │
         │        "sub": 42,                      [User ID interno]               │
         │        "iat": 1700000010,                                              │
         │        "exp": 1700086410,              [24 horas]                     │
         │      }                                                                 │
         │                                                                         │
         │  12. Retorna TokenResponse con JWT                                     │
         │<──────────────────────────────────────────────────────────────────────│
         │      {                                                                  │
         │        "access_token": "<jwt_interno>",                                │
         │        "token_type": "bearer",                                         │
         │        "expires_in": 86400,                                            │
         │        "user": {                                                       │
         │          "id": 42,                                                     │
         │          "email": "user@gmail.com",                                    │
         │          "nombre_completo": "Usuario Nombre",                          │
         │          "rol": "residente"                                            │
         │        }                                                               │
         │      }                                                                 │
         │                                                                         │
         │  13. Almacena JWT en SecureStore (ou localStorage en web)             │
         │      Almacena datos de usuario                                        │
         │      Actualiza contexto AuthContext                                   │
         │      Redirige a pantalla principal (/home)                            │
         │                                                                         │
         │  14. Solicitudes posteriores usan JWT:                                 │
         │      GET /api/v1/usuarios                                              │
         │      Authorization: Bearer <jwt_interno>                              │
         ├─────────────────────────────────────────────────────────────────────>│
         │                                                                         │
         │                                                                 [Backend Verifica │
         │                                                                  JWT con │
         │                                                                  get_current_user]│
         │                                                                         │
         │  15. Retorna datos solicitados                                         │
         │<──────────────────────────────────────────────────────────────────────│
         │
```

### 3.2 Estados de Autenticación

La aplicación móvil maneja tres estados de autenticación:

```
┌─────────────────────────────────────────────────────────┐
│  ESTADO 1: No Autenticado                               │
├─────────────────────────────────────────────────────────┤
│ • user === null                                         │
│ • Pantalla visible: LoginScreen                         │
│ • Opciones:                                             │
│   - Email/Contraseña → POST /auth/login                 │
│   - Google Sign-In → Google OAuth → /auth/firebase-login│
└─────────────────────────────────────────────────────────┘
                          │
            ┌─────────────▼──────────────┐
            │   Usuario se autentica    │
            │   exitosamente            │
            └─────────────┬──────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│  ESTADO 2: Autenticado                                  │
├─────────────────────────────────────────────────────────┤
│ • user !== null                                         │
│ • token almacenado en SecureStore                       │
│ • Pantalla visible: AppLayout (tabs/home, etc)         │
│ • Toda solicitud incluye: Authorization: Bearer <jwt>  │
└─────────────────────────────────────────────────────────┘
                          │
            ┌─────────────▼──────────────┐
            │   Usuario toca Logout     │
            │   o token expira          │
            └─────────────┬──────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│  ESTADO 3: Cargando                                     │
├─────────────────────────────────────────────────────────┤
│ • isLoading === true                                    │
│ • Se muestra splash screen o loading indicator          │
│ • Verificando si hay sesión guardada al iniciar app    │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Implementación Técnica

### 4.1 Componente: LoginScreen (`mobile/app/login.js`)

**Responsabilidades:**
- Presentar interfaz de login con dos opciones
- Manejar flujo OAuth con Google
- Manejar login tradicional con email/contraseña
- Validar credenciales y mostrar errores

**Flujo de Google Login (líneas clave):**

```javascript
// 1. Solicitar código de autorización a Google
const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '814872090434-7n5b0pkmo2131mg9et37knd7d11kee2k.apps.googleusercontent.com',
    androidClientId: '814872090434-ml8bv2jkv4pdj1rdnrmfikbrabm7l5n0.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@cliptap/mobile',
});

// 2. Usuario toca botón, abre navegador de Google
await promptAsync();

// 3. Extraer ID Token de Google
const idToken = result.params.id_token;

// 4. Crear credencial Firebase
const credential = GoogleAuthProvider.credential(idToken);

// 5. Autenticar en Firebase
const userCredential = await signInWithCredential(auth, credential);

// 6. Obtener Firebase ID Token
const firebaseIdToken = await firebaseUser.getIdToken(true);

// 7. Intercambiar por JWT del backend
await login(firebaseIdToken);  // Llamada a AuthContext
```

**Características de UX:**
- Indicadores de carga durante OAuth
- Mensajes de error claros y legibles
- Logging detallado (con emojis) para debugging
- Validación de campos en tiempo real

### 4.2 Contexto: AuthContext (`mobile/src/context/AuthContext.js`)

**Responsabilidades:**
- Gestionar estado global de autenticación
- Almacenar tokens en SecureStore (nativo) o localStorage (web)
- Proporcionar métodos login/logout a toda la app
- Verificar sesión al iniciar la app

**Métodos principales:**

```javascript
// 1. login(firebaseIdToken)
// Intercambia Firebase ID Token por JWT interno del backend
// Almacena JWT y datos de usuario
// Actualiza estado global

// 2. loginWithEmailPassword(email, password)
// Autentica con credenciales tradicionales
// Retorna { success, message }

// 3. logout()
// Limpia tokens del almacenamiento seguro
// Redirige a LoginScreen

// 4. checkLoginStatus() (automático al iniciar)
// Verifica si hay sesión guardada
// Restaura usuario y continúa navegación
```

**Almacenamiento Seguro:**

```javascript
// En dispositivos Android/iOS: expo-secure-store (encriptado)
// En web: localStorage (demostración)
storage.setItem('userToken', access_token);
storage.setItem('userData', JSON.stringify(user));
```

### 4.3 Configuración Firebase (`mobile/firebaseConfig.js`)

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB8RhtBf4OrPXP9FkJspZEioS9Dr7bIxME",
  authDomain: "espacioadmin.firebaseapp.com",
  projectId: "espacioadmin",
  storageBucket: "espacioadmin.firebasestorage.app",
  messagingSenderId: "814872090434",
  appId: "1:814872090434:web:4d90571bea94da2da39adb"
};
```

**Requisitos en Firebase Console:**
- ✅ Proyecto "espacioadmin" creado
- ✅ Google Sign-In habilitado
- ✅ Android OAuth Client ID registrado con SHA-1 correcto
- ✅ Web OAuth Client ID registrado
- ✅ Redirect URIs autorizados en ambos

### 4.4 Backend: Endpoint `/auth/firebase-login` (FastAPI)

**Ubicación:** `backend/app/api/v1/routes/auth.py`

**Responsabilidades:**
1. Recibir Firebase ID Token
2. Verificar firma del token con Firebase Admin SDK
3. Extraer identidad del usuario (email)
4. Buscar usuario en PostgreSQL por email
5. Si no existe, crear usuario automáticamente
6. Emitir JWT interno del sistema
7. Retornar acceso_token + datos del usuario

**Código simplificado:**

```python
@router.post("/firebase-login", response_model=TokenResponse)
async def firebase_login(payload: FirebaseLoginRequest, db: Session = Depends(get_db)):
    """
    Intercambia un ID Token de Firebase por un JWT interno del sistema.
    """
    try:
        # Verificar token con Firebase Admin SDK
        from firebase_admin import auth
        decoded_token = auth.verify_id_token(payload.id_token, clock_skew_seconds=60)
        
        # Extraer email del token
        email = decoded_token.get("email")
        
        # Buscar usuario existente
        usuario = db.query(Usuario).filter(Usuario.email == email).first()
        
        # Si no existe, crear automáticamente
        if not usuario:
            usuario = Usuario(
                email=email,
                password_hash="firebase_social_auth",  # No se usa
                nombre_completo=decoded_token.get("name", email.split("@")[0]),
                rol="Residente",  # Rol por defecto
                is_active=True,
                notificaciones_email=True,
                notificaciones_push=True,
            )
            db.add(usuario)
            db.commit()
            db.refresh(usuario)
        
        # Emitir JWT interno
        return _build_token_response(usuario)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido: {str(e)}"
        )
```

**Response Model:**

```python
class TokenResponse(BaseModel):
    access_token: str          # JWT interno (firmar peticiones)
    token_type: str = "bearer"
    expires_in: int            # Segundos (86400 = 24h)
    user: TokenUser            # {id, email, nombre_completo, rol}
```

### 4.5 Backend: Protección de Endpoints (JWT)

**Dependencia:** `backend/app/core/auth.py`

```python
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Usuario:
    """
    Extrae y valida JWT de header Authorization: Bearer <token>
    Retorna Usuario o HTTPException 401
    """
    # Decodificar JWT
    subject = get_token_subject(token)  # Extrae "sub" (user_id)
    
    # Buscar usuario en DB
    user = db.query(Usuario).filter(Usuario.id == int(subject)).first()
    
    return user
```

**Uso en endpoints:**

```python
@router.get("/usuarios")
async def listar_usuarios(
    current_user: Usuario = Depends(get_current_active_user)
):
    """Endpoint protegido: solo usuarios autenticados y activos"""
    # current_user es automáticamente inyectado
```

### 4.6 Cliente HTTP: Configuración Axios (`mobile/src/services/api.js`)

```javascript
const API_URL = Platform.select({
    web: 'http://localhost:8000/api/v1',
    default: 'https://rhoda-unsolicitous-cythia.ngrok-free.dev/api/v1',
});

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    }
});

// Interceptor para incluir JWT en todas las peticiones
api.interceptors.request.use(async (config) => {
    const token = await storage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

---

## 5. Características Implementadas

### 5.1 Autenticación

- ✅ **Email/Contraseña:**
  - POST `/auth/login`
  - Validación con bcrypt
  - JWT emitido al backend

- ✅ **Google Sign-In:**
  - OAuth 2.0 con Google
  - Firebase Authentication
  - Creación automática de usuarios

- ✅ **Persistencia de Sesión:**
  - SecureStore en dispositivos nativos
  - localStorage en web
  - Verificación automática al iniciar app

- ✅ **Logout:**
  - Eliminación de tokens del almacenamiento
  - Redirección a LoginScreen

### 5.2 Operaciones CRUD

- ✅ **GET /usuarios** - Listar residentes/propietarios
- ✅ **POST /reservas** - Crear reserva de espacio común
- ✅ **GET /reservas** - Listar reservas del usuario
- ✅ **POST /gastos** - Reportar gasto de condominio
- ✅ **GET /gastos** - Listar gastos

### 5.3 Experiencia de Usuario

- ✅ **Indicadores de Carga:** ActivityIndicator durante peticiones
- ✅ **Manejo de Errores:** Mensajes claros en pantalla
- ✅ **Validación:** Campos requeridos, formato email
- ✅ **Logging Detallado:** Debugging con console.log (emojis)
- ✅ **Navegación:** expo-router (tabs, stack navigation)

---

## 6. Seguridad

### 6.1 Prácticas Implementadas

| Aspecto | Implementación |
|--------|-----------------|
| **Almacenamiento de Tokens** | SecureStore (encriptado en iOS/Android) |
| **Transmisión de Credenciales** | HTTPS (Ngrok en desarrollo, HTTPS en producción) |
| **JWT Signature** | HS256 o RS256 según configuración |
| **Expiración de Token** | 24 horas, renovable con refresh token |
| **Verificación Firebase** | Admin SDK con clock_skew_seconds=60 |
| **CORS** | Configurado en FastAPI |
| **Validación de Email** | Pydantic EmailStr |
| **Validación de Contraseña** | Mínimo 6 caracteres, máximo 128 |
| **Hash de Contraseña** | bcrypt (salted) |

### 6.2 Consideraciones Importantes

⚠️ **NO se debe mezclar tokens:**
- Firebase ID Token ≠ JWT interno del backend
- Firebase autentica la identidad
- Backend autoriza las acciones
- Siempre intercambiar Firebase token por JWT interno

⚠️ **Credenciales en código:**
- Firebase config contiene apiKey (intencional, config pública)
- Credenciales sensibles en `.env` (no en repositorio)
- Firebase Admin SDK key almacenada en servidor seguro

⚠️ **Ngrok en desarrollo:**
- No usar en producción
- Exposición de localhost a internet
- Cambiar a HTTPS en servidor real

---

## 7. Flujos de Negocio

### 7.1 Crear Reserva (Espacio Común)

**Requisitos:**
- Usuario autenticado
- Rol: Residente, Directiva, Conserje, Admin

**Flujo:**

```
1. Usuario toca "Crear Reserva"
2. Pantalla muestra calendario
3. Selecciona fecha, hora y espacio
4. POST /api/v1/reservas
   {
     "fecha_inicio": "2025-11-27T10:00:00Z",
     "fecha_fin": "2025-11-27T12:00:00Z",
     "espacio_id": 1,
     "descripcion": "Reunión directiva"
   }
5. Backend valida disponibilidad (sin conflictos)
6. Crea reserva en BD
7. Retorna 201 Created con datos de reserva
8. App muestra confirmación y actualiza lista
```

### 7.2 Reportar Gasto

**Requisitos:**
- Usuario autenticado
- Rol: Conserje, Directiva, Admin

**Flujo:**

```
1. Usuario accede a "Reportar Gasto"
2. Completa formulario:
   - Concepto (ej: "Reparación ascensor")
   - Monto (ej: 150.000)
   - Fecha
   - Archivo (foto de factura)
3. POST /api/v1/gastos
   {
     "concepto": "Reparación ascensor",
     "monto": 150000,
     "fecha": "2025-11-27",
     "estado": "pendiente_aprobacion"
   }
4. Backend registra gasto
5. Notifica a directiva para aprobación
6. App muestra confirmación
```

---

## 8. Compilación y Distribución (APK)

### 8.1 Compilación con EAS Build

**Requisitos previos:**
- Cuenta en expo.dev
- Proyecto vinculado (`eas init`)
- Firebase config completa

**Comando:**

```bash
cd mobile
eas build --platform android --profile preview
```

**Perfiles disponibles:** (`eas.json`)
- `preview` - APK sin firma, para testing
- `production` - APK firmado, para distribución

**Salida:** APK descargable desde https://expo.dev/builds

### 8.2 Distribución

**Opciones:**

1. **Enlace directo:** https://expo.dev/builds/[BUILD_ID]
   - Usuarios descargan e instalan manualmente
   - Sin validación de firma

2. **Google Play Store:**
   - Requiere firma de app
   - Revisión de Google (~24-48h)
   - Distribución automática a usuarios

3. **Firebase App Distribution:**
   - Distribución a testers
   - Notificaciones automáticas de nuevas versiones
   - Control de acceso granular

---

## 9. Diagrama de Base de Datos

**Tablas principales:**

```
┌─────────────────────┐
│ usuario             │
├─────────────────────┤
│ id (PK)             │
│ email (UNIQUE)      │
│ password_hash       │
│ nombre_completo     │
│ rol                 │
│ is_active           │
│ created_at          │
│ last_login          │
└─────────────────────┘
         │
         ├──────────────────┬─────────────────┐
         │                  │                 │
         ▼                  ▼                 ▼
    ┌──────────┐    ┌──────────────┐  ┌─────────────┐
    │ reserva  │    │ gasto        │  │ notificacion│
    ├──────────┤    ├──────────────┤  ├─────────────┤
    │ id (PK)  │    │ id (PK)      │  │ id (PK)     │
    │ usuario_ │    │ usuario_id   │  │ usuario_id  │
    │ id (FK)  │    │ (FK)         │  │ (FK)        │
    │ espacio_ │    │ concepto     │  │ tipo        │
    │ id (FK)  │    │ monto        │  │ titulo      │
    │ fecha_in │    │ estado       │  │ cuerpo      │
    │ inicio   │    │ created_at   │  │ leido       │
    │ fecha_fin│    └──────────────┘  │ created_at  │
    │ estado   │                      └─────────────┘
    │ created_ │
    │ at       │
    └──────────┘
```

---

## 10. Conclusión

La solución EspacioAdmin Mobile integra exitosamente:

✅ **Autenticación moderna** (Firebase + OAuth)  
✅ **Backend robusto** (FastAPI + PostgreSQL)  
✅ **App nativa compilada** (Expo EAS)  
✅ **Seguridad de nivel empresarial** (JWT, HTTPS, encriptación)  
✅ **UX profesional** (diseño responsive, manejo de errores)  

Cumple con todos los requerimientos del Taller 4 y proporciona una base sólida para futuras extensiones (notificaciones push, Google Maps, calendarios, etc.).

---

## 11. Referencias

- [Expo Auth Session Documentation](https://docs.expo.dev/guides/authentication/)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Mobile Security Testing Guide](https://owasp.org/www-project-mobile-security-testing-guide/)

---

**Documento generado:** Noviembre 2025  
**Versión:** 1.0  
**Estado:** Completo
