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

2. **Levantar con Docker**
   ```bash
   docker-compose up -d
   ```

3. **Acceder a la aplicación**
   - Frontend: http://localhost:3000

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
│   ├── contexts/          # Context API
│   └── App.jsx            # Componente principal
├── public/                # Archivos estáticos
├── docker-compose.yml     # Configuración Docker
└── Dockerfile            # Imagen Docker
```

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request