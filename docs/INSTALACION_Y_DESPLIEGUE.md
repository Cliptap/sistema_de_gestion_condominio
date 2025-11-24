# 🚀 Guía de Instalación y Despliegue - Módulo de Reservas

## 📋 Pre-requisitos

- Python 3.8+
- Node.js 14+
- PostgreSQL 12+
- Git
- pip y npm

## 🛠️ Instalación Local

### Paso 1: Clonar el Repositorio

```bash
cd /ruta/al/proyecto
git clone <repositorio>
cd sistema_de_gestion_condominio-master
```

### Paso 2: Configurar Variables de Entorno

#### Backend
```bash
# En la raíz del proyecto, crear .env basado en .env.example
cp .env.example .env

# Editar .env con tus valores:
GOOGLE_CALENDAR_API_KEY=tu_api_key_aqui
GOOGLE_CALENDAR_ID_MULTICANCHA=xxx@grupo.calendar.google.com
GOOGLE_CALENDAR_ID_QUINCHO=yyy@grupo.calendar.google.com
GOOGLE_CALENDAR_ID_SALA_EVENTOS=zzz@grupo.calendar.google.com

DATABASE_URL=postgresql://usuario:password@localhost:5432/condominio
```

#### Frontend
```bash
# En la raíz del proyecto
# Crear archivo .env (si necesitas URL API diferente)
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env.local
```

### Paso 3: Instalar Dependencias Python

```bash
# Navegar a carpeta backend
cd backend

# Crear virtual environment (recomendado)
python -m venv venv

# Activar virtual environment
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Volver a raíz
cd ..
```

### Paso 4: Instalar Dependencias JavaScript

```bash
# En la raíz del proyecto
npm install
```

### Paso 5: Ejecutar Migraciones de Base de Datos

```bash
# Conectar a PostgreSQL
psql -U tu_usuario -d condominio

# Ejecutar migraciones (en la sesión psql)
\i sql/004_add_google_event_id_reservas.sql

# Salir
\q
```

### Paso 6: Iniciar Backend

```bash
# En la raíz, asegúrate que el venv esté activado
cd backend

# Iniciar servidor FastAPI
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Output esperado:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Started server process [xxxx]
```

### Paso 7: Iniciar Frontend (en otra terminal)

```bash
# En la raíz del proyecto
npm run dev
```

**Output esperado:**
```
VITE v5.4.21  ready in 502 ms
➜  Local:   http://localhost:5173/
```

## ✅ Verificación de Instalación

### Backend
```bash
# Verificar que API responda
curl http://localhost:8000/api/v1/reservas/espacios

# Respuesta esperada:
# [
#   {"id": 1, "nombre": "Multicancha", ...},
#   {"id": 2, "nombre": "Quincho", ...},
#   {"id": 3, "nombre": "Sala de Eventos", ...}
# ]
```

### Frontend
```
1. Abre http://localhost:5173/ en el navegador
2. Navega a la sección "Reservas"
3. Deberías ver el selector de espacios
```

---

## 🐳 Docker Compose (Opcional)

### Paso 1: Construir y Levantar Servicios

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

### Paso 2: Ejecutar Migraciones

```bash
# Dentro del contenedor
docker-compose exec backend bash
python -m alembic upgrade head
exit
```

### Paso 3: Acceder a la Aplicación

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Base de Datos: localhost:5432

---

## 🔍 Troubleshooting

### Error: "GOOGLE_CALENDAR_API_KEY no está configurada"
**Solución:**
1. Verifica que .env existe en la raíz
2. Verifica que contiene GOOGLE_CALENDAR_API_KEY
3. Reinicia el servidor backend

### Error: "No se puede conectar a la base de datos"
**Solución:**
1. Verifica que PostgreSQL está corriendo
2. Verifica credenciales en DATABASE_URL
3. Verifica que la BD existe

### Error: "No se encuentra módulo google-auth"
**Solución:**
```bash
pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### Error: "Cannot find module '@fullcalendar'"
**Solución:**
```bash
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid
```

### El calendario no muestra slots
**Solución:**
1. Verifica que los IDs de Google Calendar son correctos
2. Verifica que la cuenta de servicio tiene permisos
3. Revisa los logs del backend para errores

---

## 📚 Scripts Útiles

### Desarrollo

```bash
# Terminal 1: Backend
cd backend && python -m uvicorn app.main:app --reload

# Terminal 2: Frontend
npm run dev

# Terminal 3: Logs
tail -f backend/*.log
```

### Producción

```bash
# Build frontend
npm run build

# Iniciar backend (con gunicorn)
cd backend
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app

# Servir frontend (con nginx)
# Ver configuración en docker-compose.yml
```

---

## 🌐 Despliegue a Producción

### Opciones

1. **Heroku**
   ```bash
   heroku create tu-app
   git push heroku main
   ```

2. **AWS**
   - Usar Elastic Beanstalk para backend
   - Usar S3 + CloudFront para frontend

3. **DigitalOcean**
   - Crear Droplet
   - Instalar Docker
   - Usar docker-compose.yml

4. **Google Cloud Run**
   ```bash
   gcloud run deploy tu-app --source .
   ```

### Checklist Pre-Despliegue

- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Tests pasando
- [ ] Build frontend optimizado
- [ ] CORS configurado
- [ ] Certificado SSL
- [ ] Backups de BD
- [ ] Logs configurados
- [ ] Monitoreo activo

---

## 📊 Monitoreo

### Backend

```bash
# Ver logs
docker-compose logs -f backend

# Verificar salud
curl http://localhost:8000/health

# Endpoints de debug
curl http://localhost:8000/docs  # Swagger
curl http://localhost:8000/redoc # ReDoc
```

### Frontend

```bash
# Ver logs del navegador
# Abre DevTools: F12 o Ctrl+Shift+I
# Pestaña: Console
```

### Base de Datos

```bash
# Conectar a BD
psql -U usuario -d condominio

# Ver tablas
\dt

# Ver reservas recientes
SELECT * FROM reservas ORDER BY created_at DESC LIMIT 10;
```

---

## 🔒 Seguridad

### Antes de Desplegar

- [ ] Cambiar contraseñas por defecto
- [ ] Habilitar HTTPS
- [ ] Configurar CORS correctamente
- [ ] Validar todas las entradas
- [ ] Usar variables de entorno para secretos
- [ ] Implementar rate limiting
- [ ] Configurar firewall
- [ ] Hacer backup de BD
- [ ] Habilitar logging de auditoría

### Certificado SSL

```bash
# Con Let's Encrypt
certbot certonly --standalone -d tudominio.com

# Configurar en nginx/apache
# Ver documentación específica de tu servidor
```

---

## 📈 Performance

### Optimizaciones

1. **Backend**
   - Usar caché (Redis)
   - Paginar resultados grandes
   - Usar índices en BD
   - Implementar CDN para Google Calendar

2. **Frontend**
   - Build optimizado
   - Lazy loading
   - Minificación
   - Compresión gzip

3. **Base de Datos**
   - Crear índices
   - Hacer backups regulares
   - Monitorear queries lentas

---

## 🆘 Soporte

Para preguntas, consulta:
- Documentación en `docs/`
- Logs del servidor
- Stack Overflow
- Documentación oficial (FastAPI, React, Google Calendar API)

---

**¡Listo para desplegar! 🚀**
