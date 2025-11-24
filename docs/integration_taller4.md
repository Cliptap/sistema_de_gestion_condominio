# Documento de Integración: App Móvil y Backend

## 1. Arquitectura General

El sistema se compone de tres partes principales:

1.  **Backend (FastAPI)**: API REST que gestiona la lógica de negocio y la base de datos MySQL.
2.  **Frontend Web (React)**: Panel de administración web.
3.  **App Móvil (React Native/Expo)**: Aplicación para residentes y conserjes.

### Diagrama de Componentes

```mermaid
graph TD
    User[Usuario Móvil] -->|Interactúa| App[App React Native]
    App -->|Auth (Google)| Firebase[Firebase Auth]
    Firebase -->|ID Token| App
    App -->|POST /firebase-login (ID Token)| Backend[Backend FastAPI]
    Backend -->|Verifica Token| FirebaseAdmin[Firebase Admin SDK]
    FirebaseAdmin -->|OK + Email| Backend
    Backend -->|Genera JWT Interno| App
    App -->|Requests + JWT| Backend
    Backend -->|Queries| DB[(MySQL)]
```

## 2. Flujo de Autenticación Social

El sistema utiliza un enfoque híbrido para la seguridad:

1.  **Autenticación (Identidad)**: Delegada a Firebase Authentication. El usuario se loguea con Google/Facebook en la app móvil. Firebase emite un `ID Token`.
2.  **Autorización (Permisos)**: Gestionada por el Backend. La app envía el `ID Token` al backend.
3.  **Intercambio de Tokens**:
    -   El backend recibe el `ID Token`.
    -   Verifica la firma y validez con `firebase-admin`.
    -   Extrae el email del usuario.
    -   Busca el usuario en la base de datos local.
    -   Si existe (o se crea), emite un `Access Token` (JWT) propio del sistema.
4.  **Sesión**: La app almacena el `Access Token` y lo usa para todas las peticiones subsiguientes (ej: `GET /anuncios`).

## 3. Endpoints Clave

### Autenticación
-   `POST /api/v1/auth/firebase-login`: Recibe `{ id_token: "..." }`, retorna `{ access_token: "...", user: {...} }`.

### Funcionalidad (Paridad)
-   `GET /api/v1/anuncios/activos`: Lista anuncios visibles para el usuario.
-   `POST /api/v1/anuncios/`: Crea un nuevo anuncio (requiere rol adecuado).

## 4. Consideraciones de Seguridad

-   **CORS**: Se debe permitir el origen del móvil (o `*` en desarrollo) en el backend.
-   **Variables de Entorno**: Las credenciales de Firebase (`google-services.json`) no se incluyen en el repositorio por seguridad.
-   **Validación**: El backend nunca confía ciegamente en el cliente; siempre verifica el token con Firebase.
