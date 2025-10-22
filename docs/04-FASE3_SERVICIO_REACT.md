# Fase 3: Servicio React para Google Calendar - COMPLETADA

## ✅ Cambios Realizados

### Archivo: `src/services/reservasService.js`

Se ha creado un servicio completo con métodos para consumir la API de reservas:

### Métodos Principales

#### 1. **Obtener Espacios**
```javascript
const resultado = await ReservasService.obtenerEspacios();
if (resultado.success) {
  const espacios = resultado.data;
}
```
- Retorna lista de espacios comunes
- Manejo de errores automático

#### 2. **Obtener Disponibilidad**
```javascript
const resultado = await ReservasService.obtenerDisponibilidad(
  'multicancha',
  new Date('2025-10-25'),
  new Date('2025-11-01'),
  60  // duración en minutos
);
```
- Parámetros opcionales para fechas
- Retorna slots disponibles de Google Calendar

#### 3. **Crear Reserva**
```javascript
const resultado = await ReservasService.crearReserva(
  'quincho',
  new Date('2025-10-25T18:00:00'),
  new Date('2025-10-25T20:00:00'),
  usuarioId
);
```
- Crea nueva reserva
- Maneja validaciones del backend

#### 4. **Listar Reservas del Usuario**
```javascript
const resultado = await ReservasService.obtenerReservasUsuario(usuarioId);
if (resultado.success) {
  const reservas = resultado.data;
}
```
- Obtiene todas las reservas del usuario
- Ordenadas por fecha

#### 5. **Cancelar Reserva**
```javascript
const resultado = await ReservasService.cancelarReserva(reservaId, usuarioId);
```
- Cancela una reserva existente
- Elimina de Google Calendar automáticamente

### Métodos Auxiliares (Utilidades)

#### `getInfoEspacio(espacio)`
```javascript
const info = ReservasService.getInfoEspacio('multicancha');
// { nombre: 'Multicancha', descripcion: '...', icono: '⚽', color: 'bg-blue-500' }
```

#### `formatearFecha(fecha)`
```javascript
const fechaFormato = ReservasService.formatearFecha('2025-10-25T18:00:00');
// "25 de octubre de 2025, 18:00"
```

#### `formatearHora(fecha)`
```javascript
const hora = ReservasService.formatearHora('2025-10-25T18:00:00');
// "18:00"
```

#### `calcularDuracion(inicio, fin)`
```javascript
const minutos = ReservasService.calcularDuracion(inicio, fin);
// 120
```

#### `esHoy(fecha)`
```javascript
if (ReservasService.esHoy(fecha)) {
  // Es hoy
}
```

### Características de Seguridad

✅ **Interceptor de Autenticación**
- Agrega token JWT automáticamente
- Busca el token en localStorage

✅ **Manejo de Errores Estandarizado**
- Todos los métodos retornan: `{ success, data/error, status }`
- Permite manejo uniforme en componentes

✅ **Validación de Entrada**
- Convierte fechas a ISO string
- Valida tipos de datos

## 🔧 Configuración

La URL base de la API se obtiene de:
```javascript
import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
```

Para configurar la URL, crear archivo `.env`:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 📝 Ejemplo de Uso en Componentes

```javascript
import ReservasService from '@/services/reservasService';

// En un componente React
const [espacios, setEspacios] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const cargarEspacios = async () => {
    setLoading(true);
    const resultado = await ReservasService.obtenerEspacios();
    if (resultado.success) {
      setEspacios(resultado.data);
    } else {
      console.error(resultado.error);
    }
    setLoading(false);
  };
  
  cargarEspacios();
}, []);
```

## 🚀 Próximos Pasos (Fase 4)

Crear componentes React para:
- Selector de espacios con toggle
- Calendario con disponibilidad
- Modal de confirmación de reserva
