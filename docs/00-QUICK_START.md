# 🚀 Guía de Inicio Rápido

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

## Requisitos Previos

- **Docker Desktop** instalado y ejecutándose
- **Git** para clonar el repositorio
- **Navegador web** moderno (Chrome, Firefox, Safari, Edge)

> ℹ️ **Windows:** Asegúrate de que WSL 2 está habilitado. Docker Desktop lo configurará automáticamente.

## Pasos de Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Cliptap/sistema_de_gestion_condominio.git
cd sistema_de_gestion_condominio
```

### 2. Copiar Archivo de Ejemplo

```bash
cp .env.example .env
```

### 3. Configurar Google Calendar (Opcional pero Recomendado)

Si deseas que las reservas se sincronicen automáticamente con Google Calendar:

1. Sigue la guía en `docs/GOOGLE_CALENDAR_SETUP.md`
2. Descarga el archivo `google-service-account-key.json`
3. Colócalo en la raíz del proyecto
4. Actualiza las variables en `.env`

**Sin este paso:** Las reservas funcionarán en la app, pero no se crearán eventos en Google Calendar.

### 4. Iniciar los Contenedores

```bash
docker-compose up -d
```

Esto descargará las imágenes y creará 3 contenedores:
- `app` (Frontend React en puerto 3000)
- `api` (Backend FastAPI en puerto 8000)
- `db` (PostgreSQL en puerto 5432)

### 5. Esperar a que Todo Esté Listo

```bash
docker-compose logs app
```

Busca mensajes como:
```
[...] ready in XXX ms
```

### 6. Acceder a la Aplicación

Abre tu navegador en:
```
http://localhost:3000
```

## Credenciales de Prueba

Las siguientes credenciales están disponibles en la base de datos de demostración:

### Usuario Residente
- **Email:** `residente@example.com`
- **Password:** `123456`
- **Rol:** Residente (Acceso a Reservas, Pagos, Perfil)

### Usuario Administrador
- **Email:** `admin@example.com`
- **Password:** `123456`
- **Rol:** Administrador (Acceso completo a todas las funciones)

## Verificación

Para verificar que todo está funcionando:

1. **Frontend:** Visita http://localhost:3000 y ves el login
2. **Backend:** Accede a http://localhost:8000/docs para ver la documentación de API
3. **Base de datos:** Conecta con `psql -h 127.0.0.1 -U condouser -d condominio`

## Comandos Útiles

### Ver Logs

```bash
# Logs del frontend
docker logs sistema_de_gestion_condominio-master-app-1 -f

# Logs del backend
docker logs sistema_de_gestion_condominio-master-api-1 -f

# Logs de la base de datos
docker logs sistema_de_gestion_condominio-master-db-1 -f
```

### Detener los Contenedores

```bash
docker-compose down
```

### Reconstruir los Contenedores

Si hiciste cambios en el código:

```bash
docker-compose up -d --build
```

### Limpiar Todo

Para resetear completamente (incluyendo datos):

```bash
docker-compose down -v
```

## Problemas Comunes

### Error: "Cannot connect to Docker daemon"
**Solución:** Asegúrate de que Docker Desktop está ejecutándose.

### Error: "Port 3000 is already in use"
**Solución:** Otro proceso está usando el puerto. Prueba:
```bash
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows
```

Luego mata ese proceso o cambia el puerto en `docker-compose.yml`.

### Error: "Connection refused" en pagos
**Solución:** Espera 30 segundos a que la API esté lista, luego recarga la página.

### Credenciales no funcionan
**Solución:** 
1. Asegúrate de copiar `.env.example` a `.env`
2. Reconstruye: `docker-compose up -d --build`
3. Reinicia: `docker-compose restart db`

## Documentación Completa

Para más información, consulta:
- `README.md` - Descripción general del proyecto
- `docs/GOOGLE_CALENDAR_SETUP.md` - Configuración de Google Calendar
- Backend API docs - http://localhost:8000/docs (cuando esté ejecutándose)

## ¿Necesitas Ayuda?

1. Revisa la sección de troubleshooting en `README.md`
2. Chequea los logs: `docker-compose logs`
3. Verifica que los puertos 3000, 8000, 5432 están disponibles
4. Abre un issue en GitHub si el problema persiste

¡Listo! La aplicación debería estar ejecutándose correctamente. 🎉
