# Sistema de Gestión de Condominio

Sistema web desarrollado con React + Vite para la gestión de condominios.

## 🚀 Setup para Desarrollo

### Prerrequisitos
- Docker Desktop
- Git

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Cliptap/sistema_de_gestion_condominio.git
   cd sistema_de_gestion_condominio
   ```

2. **Levantar con Docker (Frontend + API + Postgres)**
   ```bash
   docker-compose up -d
   ```

3. **Acceder a la aplicación, API y BD**
   - Frontend (Vite): http://localhost:3000
   - Backend (FastAPI): http://localhost:8000 (health: /healthz)
   - Postgres: localhost:5432 (DB: condominio, User: condouser, Pass: condopass)
   - Esquema DB: se aplica automáticamente desde `sql/*.sql` al primer arranque del contenedor

### Comandos Útiles

```bash
# Levantar el entorno
docker-compose up -d

# Ver logs
docker-compose logs -f

# Rebuild si hay cambios en package.json
docker-compose down && docker-compose up --build

# Parar todo
docker-compose down
```

### Backend FastAPI (endpoints MVP)

Base URL: `http://localhost:8000`

Endpoints (MVP, algunos mock para avanzar rápido):

```bash
# Health
curl http://localhost:8000/healthz

# Login (mock: acepta cualquier password y retorna token mock)
curl -X POST http://localhost:8000/api/v1/auth/login \
   -H "Content-Type: application/json" \
   -d '{"email":"residente@example.com","password":"cualquiera"}'

# Gastos por vivienda (IDs de ejemplo del seed)
curl http://localhost:8000/api/v1/gastos/vivienda/1

# Reservas por usuario (IDs de ejemplo del seed)
curl http://localhost:8000/api/v1/reservas/usuario/1

# Desglose de pagos del residente (vivienda, cargo fijo UF, gastos, multas, reservas)
curl http://localhost:8000/api/v1/pagos/residente/1
```

Notas:
- Los endpoints de gastos/reservas devolverán datos mock hasta conectar a la DB.
- El login es mock por ahora (sin verificar hash) y devuelve un token de prueba.

### Base de datos PostgreSQL (SQL)

Los scripts de `sql/` se aplican automáticamente al primer arranque del contenedor de Postgres.
Si deseas ejecutarlos manualmente:

```bash
# Verificar que la BD está arriba
docker ps

# Ejecutar esquema
docker exec -i condominio_db psql -U condouser -d condominio -f /docker-entrypoint-initdb.d/001_schema_residente.sql

# Ejecutar seed de desarrollo
docker exec -i condominio_db psql -U condouser -d condominio -f /docker-entrypoint-initdb.d/002_seed_residente.sql

# Listar tablas
docker exec -i condominio_db psql -U condouser -d condominio -c "\\dt"

### Nota de migración: 003_add_cargo_fijo_uf.sql

Si tu volumen de Postgres ya existía antes de agregar la columna `cargo_fijo_uf`, ejecuta manualmente la migración 003 dentro del contenedor:

```bash
docker exec -i condominio_db psql -U condouser -d condominio -f /docker-entrypoint-initdb.d/003_add_cargo_fijo_uf.sql

# Verificar columna
docker exec -i condominio_db psql -U condouser -d condominio -c "\\d+ public.viviendas"
```
```

### Variables de entorno (UF - CMF)

Crear archivo `.env` (no se sube al repo) con:

```
VITE_CMF_API_KEY=<tu_api_key_cmf>
VITE_CMF_API_PROXY_PATH=/cmf/uf
```

El proxy de Vite redirige `/cmf/uf` a la CMF y evita CORS en desarrollo.
Después de cambiar `.env`, reinicia el servidor de Vite para que tome los valores.

## 🛠️ Desarrollo Local (sin Docker)

Si prefieres trabajar sin Docker:

```bash
npm install
npm run dev
```

## 📝 Estructura del Proyecto

```
├── src/                    # Código fuente React
│   ├── components/         # Componentes React
│   ├── context/            # Context API
│   ├── index.css           # Estilos globales
│   ├── main.jsx            # Entrada de la app
│   └── App.jsx             # Componente principal
├── index.html              # Entrada Vite
├── docker-compose.yml      # Configuración Docker (Frontend + API + Postgres)
├── Dockerfile              # Imagen Docker (frontend)
├── backend/                # FastAPI (API)
│   ├── app/
│   │   ├── main.py
│   │   ├── api/v1/routes/ (auth, gastos, reservas)
│   │   └── core/db/... (config y session)
│   └── requirements.txt
├── sql/                    # DDL + seeds para Postgres
└── .gitignore
```

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request