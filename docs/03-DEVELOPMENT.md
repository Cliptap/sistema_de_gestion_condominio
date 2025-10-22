# 👨‍💻 Guía de Desarrollo y Contribución

## Configuración del Entorno de Desarrollo

### Requisitos

- **OS:** Windows, Mac, o Linux
- **Docker Desktop:** v4.0+
- **Git:** v2.30+
- **Node.js:** v16+ (opcional, para desarrollo local sin Docker)
- **Python:** v3.10+ (opcional, para backend local)

### Setup Inicial

```bash
# 1. Clonar el repositorio
git clone https://github.com/Cliptap/sistema_de_gestion_condominio.git
cd sistema_de_gestion_condominio

# 2. Crear rama de desarrollo
git checkout -b develop
git pull origin develop

# 3. Copiar variables de entorno
cp .env.example .env

# 4. Iniciar servicios
docker-compose up -d

# 5. Verificar que todo está listo
docker-compose ps
```

## Flujo de Trabajo (Git Flow)

### Ramas

```
main
  ├── Versiones estables solamente
  └── Tag releases (v1.0.0, v1.1.0, etc)

develop
  ├── Rama de integración
  ├── Código funcional pero en desarrollo
  └── Base para nuevas features

feature/*
  ├── Ramas locales para nuevas funcionalidades
  ├── Branch from: develop
  ├── Nombre: feature/nombre-descriptivo
  └── PR to: develop

hotfix/*
  ├── Arreglos urgentes para producción
  ├── Branch from: main
  ├── Nombre: hotfix/descripcion-breve
  └── PR to: main y develop
```

### Workflow Típico

```bash
# 1. Traer cambios del repositorio remoto
git fetch origin
git checkout develop
git pull origin develop

# 2. Crear rama de feature
git checkout -b feature/nueva-funcionalidad

# 3. Hacer cambios
# ... editar archivos ...

# 4. Commit con mensajes descriptivos
git add .
git commit -m "feat: agregar nueva funcionalidad X

Descripción detallada del cambio. Por qué se hace.

Closes #123"

# 5. Push a remoto
git push origin feature/nueva-funcionalidad

# 6. Abrir Pull Request en GitHub
# - Ir a https://github.com/Cliptap/sistema_de_gestion_condominio/pulls
# - Click "New Pull Request"
# - Compare: develop ← feature/nueva-funcionalidad
# - Completar descripción

# 7. Esperar revisión y aprobación
# 8. Mergear a develop
# 9. Eliminar rama local
git checkout develop
git branch -d feature/nueva-funcionalidad
```

## Convención de Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Tipos

- **feat:** Nueva funcionalidad
- **fix:** Corrección de bug
- **docs:** Cambios en documentación
- **style:** Formato, espacios, sintaxis (sin cambios de lógica)
- **refactor:** Restructuración de código sin cambiar funcionalidad
- **perf:** Mejoras de performance
- **test:** Agregar o actualizar tests
- **chore:** Cambios en build, CI/CD, dependencias

### Ejemplos

```bash
# Agregar nueva funcionalidad
git commit -m "feat(reservas): permitir cancelación de reservas
- Agregar endpoint DELETE /api/v1/reservas/{id}
- Actualizar Google Calendar al cancelar
- Avisar al usuario por email"

# Corregir bug
git commit -m "fix(pagos): corregir cálculo de intereses
Closes #456"

# Actualizar documentación
git commit -m "docs: agregar guía de Google Calendar"
```

## Desarrollo del Frontend

### Estructura de Componentes

```bash
# Crear nuevo componente
src/components/NuevoComponente.jsx
```

**Template:**
```javascript
import React from 'react';

const NuevoComponente = ({ prop1, prop2 }) => {
  return (
    <div className="p-4">
      {/* contenido */}
    </div>
  );
};

export default NuevoComponente;
```

### Estilos

Usar Tailwind CSS clases en JSX:

```javascript
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Click me
</button>
```

**NO** crear archivos CSS separados. Tailwind maneja todo.

### Testing Componentes

```bash
# Crear test file junto al componente
src/components/NuevoComponente.test.jsx
```

```javascript
import { render, screen } from '@testing-library/react';
import NuevoComponente from './NuevoComponente';

describe('NuevoComponente', () => {
  it('renderiza correctamente', () => {
    render(<NuevoComponente />);
    expect(screen.getByText(/contenido/)).toBeInTheDocument();
  });
});
```

### Hot Reload

Vite automáticamente recarga:
1. Cambios en archivos JSX
2. Cambios en estilos CSS/Tailwind
3. Cambios en contextos

Simplemente guarda el archivo (Ctrl+S).

### Debugging

En Chrome DevTools:
1. Abre DevTools (F12)
2. Ve a "Console" para logs
3. Ve a "Application" → "Local Storage" para datos persistentes
4. Ve a "Network" para ver llamadas API

## Desarrollo del Backend

### Crear Nuevo Endpoint

**Archivo:** `backend/app/api/v1/routes/nuevo.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db

router = APIRouter()

@router.get("/items")
def get_items(db: Session = Depends(get_db)):
    """Obtener todos los items"""
    items = db.query(Item).all()
    return {"items": items}

@router.post("/items")
def create_item(data: ItemSchema, db: Session = Depends(get_db)):
    """Crear nuevo item"""
    item = Item(**data.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
```

**Registrar en:** `backend/app/api/v1/router.py`

```python
from app.api.v1.routes import nuevo

api_router.include_router(
    nuevo.router,
    prefix="/items",
    tags=["items"]
)
```

### Crear Nuevo Modelo

**Archivo:** `backend/app/models/models.py` (agregar)

```python
class NuevoModelo(Base):
    __tablename__ = "nuevo_modelo"
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
```

**Crear migración SQL:**
```sql
CREATE TABLE nuevo_modelo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Testing Backend

```bash
# Ver logs en tiempo real
docker logs sistema_de_gestion_condominio-master-api-1 -f

# Conectar a BD
docker exec -it sistema_de_gestion_condominio-master-db-1 psql \
  -U condouser -d condominio

# Ejecutar migraciones
docker exec -it sistema_de_gestion_condominio-master-api-1 \
  python -m alembic upgrade head
```

### Validación de Datos

Usar Pydantic schemas:

```python
from pydantic import BaseModel, EmailStr, validator

class UserCreate(BaseModel):
    email: EmailStr
    nombre: str
    password: str
    
    @validator('password')
    def password_length(cls, v):
        if len(v) < 6:
            raise ValueError('Password debe tener al menos 6 caracteres')
        return v
```

## Testing

### Frontend (Jest + React Testing Library)

```bash
# Ejecutar tests
npm test

# Con coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Backend (pytest)

```bash
# Ejecutar todos los tests
docker exec sistema_de_gestion_condominio-master-api-1 pytest

# Tests específicos
docker exec sistema_de_gestion_condominio-master-api-1 pytest tests/test_pagos.py -v

# Con coverage
docker exec sistema_de_gestion_condominio-master-api-1 pytest --cov=app tests/
```

## Performance y Optimización

### Frontend

```javascript
// ✅ BIEN: Memoization para prevenir re-renders
const MiComponente = React.memo(({ prop }) => {
  return <div>{prop}</div>;
});

// ✅ BIEN: useCallback para funciones estables
const handleClick = useCallback(() => {
  // hacer algo
}, []);

// ✅ BIEN: Lazy loading de componentes
const ReservasPage = lazy(() => import('./pages/Reservas'));

// ❌ EVITAR: Crear objetos en el render
const estilo = { color: 'red' }; // Se recrea cada render

// ❌ EVITAR: Funciones arrow en JSX
<button onClick={() => handleClick()}>Click</button>
```

### Backend

```python
# ✅ BIEN: Usar .only() para campos específicos
usuarios = db.query(Usuario).filter_by(activo=True).options(
    load_only('id', 'nombre', 'email')
).all()

# ✅ BIEN: Paginar resultados grandes
items = db.query(Item).offset(0).limit(10).all()

# ✅ BIEN: Usar índices en BD
class Usuario(Base):
    __tablename__ = "usuarios"
    email = Column(String, unique=True, index=True)

# ❌ EVITAR: N+1 queries
for usuario in usuarios:
    print(usuario.vivienda.numero)  # Query por cada usuario

# ✅ MEJOR: Eager loading
usuarios = db.query(Usuario).options(
    joinedload(Usuario.vivienda)
).all()
```

## Debugging

### Frontend

```javascript
// Logs con contexto
console.log('DEBUG: usuario =', usuario);
console.table(usuarios);
console.time('operacion');
// ... código ...
console.timeEnd('operacion');

// Breakpoints en DevTools
debugger; // El ejecutor se detiene aquí en DevTools abierto
```

### Backend

```python
# Logging detallado
import logging
logger = logging.getLogger(__name__)

logger.debug(f"DEBUG: usuario = {usuario}")
logger.info(f"Se creó reserva #{reserva.id}")
logger.warning("Advertencia: espacio casi lleno")
logger.error(f"Error al crear evento: {str(e)}")

# Ver en logs
docker logs -f sistema_de_gestion_condominio-master-api-1 | grep "ERROR"
```

## Code Review Checklist

Antes de hacer PR, verifica:

- [ ] Código sigue convención de nombres (camelCase en JS, snake_case en Python)
- [ ] Commits tienen mensajes descriptivos (Conventional Commits)
- [ ] Tests pasan (si aplica)
- [ ] No hay console.log/print statements en producción
- [ ] Documentación actualizada
- [ ] No hay conflictos con develop
- [ ] .env no está commiteado
- [ ] Tailwind/estilos están correctos

## Documentación

### Actualizar Documentación

1. Modificar archivos en `docs/`
2. Actualizar `README.md` si es necesario
3. Hacer commit: `git commit -m "docs: actualizar..."`

### Documentar Cambios

En cada commit que cambie funcionalidad:
- Actualizar docstrings de funciones
- Agregar comentarios sobre lógica compleja
- Actualizar README si afecta setup o uso

## Recursos

### Documentación Oficial

- [FastAPI Docs](https://fastapi.tiangolo.com)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [SQLAlchemy](https://docs.sqlalchemy.org)
- [PostgreSQL](https://www.postgresql.org/docs)

### Git Learning

- [Git Official Tutorial](https://git-scm.com/doc)
- [GitHub Skills](https://skills.github.com)

## Soporte

¿Problemas?

1. Revisa logs: `docker-compose logs`
2. Revisa GitHub Issues
3. Crea un nuevo Issue con:
   - Descripción del problema
   - Pasos para reproducir
   - Logs relevantes
   - SO y versiones de software

¡Gracias por contribuir! 🎉
