import React, { useState } from "react"
import EspaciosSelector from "../Reservas/EspaciosSelector"
import CalendarioDisponibilidad from "../Reservas/CalendarioDisponibilidad"
import ReservasService from "../../services/reservasService"
import { FiArrowLeft, FiCheck } from "react-icons/fi"

// Alias para acceder a métodos estáticos de la clase ReservasService
const ReservasServiceStatic = ReservasService.constructor

/**
 * Componente principal para reservar espacios comunes
 * Implementa flujo de 3 pasos:
 * 1. Seleccionar espacio (Multicancha, Quincho, Sala de Eventos)
 * 2. Seleccionar fecha/hora (calendario con disponibilidad)
 * 3. Confirmar reserva
 */
export default function Reservas() {
  // ─────────────────────────────────────────────────────────────
  // ESTADOS
  // ─────────────────────────────────────────────────────────────
  const [paso, setPaso] = useState(1)
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null)
  const [slotSeleccionado, setSlotSeleccionado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reservaCreada, setReservaCreada] = useState(false)

  // ─────────────────────────────────────────────────────────────
  // FUNCIONES DE MANEJO
  // ─────────────────────────────────────────────────────────────

  /**
   * Cuando el usuario selecciona un espacio en paso 1
   */
  const handleSelectEspacio = (espacio) => {
    setEspacioSeleccionado(espacio)
    setSlotSeleccionado(null)
    setError(null)
    setPaso(2)
  }

  /**
   * Cuando el usuario selecciona un slot en paso 2
   */
  const handleSelectSlot = (slot) => {
    setSlotSeleccionado(slot)
    setError(null)
    setPaso(3)
  }

  /**
   * Confirmar la reserva y enviarla al backend
   */
  const handleConfirmarReserva = async () => {
    if (!slotSeleccionado || !espacioSeleccionado) {
      setError("Faltan datos de la reserva")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Obtener el usuario_id del localStorage o del contexto de autenticación
      const usuarioId = localStorage.getItem("usuario_id") || "1"

      // Convertir las fechas de string ISO a Date objects
      const fechaInicio = typeof slotSeleccionado.inicio === 'string' 
        ? new Date(slotSeleccionado.inicio) 
        : slotSeleccionado.inicio
      const fechaFin = typeof slotSeleccionado.fin === 'string' 
        ? new Date(slotSeleccionado.fin) 
        : slotSeleccionado.fin

      // Crear la reserva
      const response = await ReservasService.crearReserva(
        espacioSeleccionado,
        fechaInicio,
        fechaFin,
        usuarioId
      )

      if (response.success) {
        setReservaCreada(true)
        // Limpiar después de 2 segundos y volver al paso 1
        setTimeout(() => {
          setReservaCreada(false)
          setPaso(1)
          setEspacioSeleccionado(null)
          setSlotSeleccionado(null)
        }, 2000)
      } else {
        setError(response.error || "Error al crear la reserva")
      }
    } catch (err) {
      setError(err.message || "Error desconocido al crear la reserva")
      console.error("Error al confirmar reserva:", err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Volver al paso anterior
   */
  const handleBack = () => {
    if (paso === 1) return
    if (paso === 2) {
      setPaso(1)
      setEspacioSeleccionado(null)
      setSlotSeleccionado(null)
    } else if (paso === 3) {
      setPaso(2)
    }
    setError(null)
  }

  // ─────────────────────────────────────────────────────────────
  // RENDERIZACIÓN CONDICIONAL POR PASO
  // ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      {/* CONTENEDOR PRINCIPAL */}
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Reservar Espacio Común
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Selecciona un espacio y elige la fecha y hora que deseas
          </p>
        </div>

        {/* INDICADOR DE PROGRESO */}
        <div className="mb-8">
          <IndicadorProgreso paso={paso} />
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8 min-h-96">
          {/* MOSTRAR ERRORES */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}

          {/* PASO 1: SELECCIONAR ESPACIO */}
          {paso === 1 && (
            <div className="animate-fade-in">
              <EspaciosSelector
                onSelectEspacio={handleSelectEspacio}
                espacioSeleccionado={espacioSeleccionado}
                loading={loading}
              />
            </div>
          )}

          {/* PASO 2: SELECCIONAR FECHA/HORA */}
          {paso === 2 && espacioSeleccionado && (
            <div className="animate-fade-in">
              <CalendarioDisponibilidad
                espacio={espacioSeleccionado}
                onSelectSlot={handleSelectSlot}
                onBack={handleBack}
              />
            </div>
          )}

          {/* PASO 3: CONFIRMAR RESERVA */}
          {paso === 3 && slotSeleccionado && (
            <div className="animate-fade-in">
              <ResumenConfirmacion
                espacio={espacioSeleccionado}
                slot={slotSeleccionado}
                onConfirmar={handleConfirmarReserva}
                onBack={handleBack}
                loading={loading}
                reservaCreada={reservaCreada}
              />
            </div>
          )}
        </div>

        {/* BOTÓN VOLVER (SOLO EN PASOS 2 Y 3) */}
        {paso > 1 && !reservaCreada && (
          <div className="mt-6 flex justify-start">
            <button
              onClick={handleBack}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiArrowLeft size={20} />
              <span>Atrás</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Componente: Indicador de progreso de los 3 pasos
 */
function IndicadorProgreso({ paso }) {
  const pasos = [
    { numero: 1, label: "Espacios" },
    { numero: 2, label: "Disponibilidad" },
    { numero: 3, label: "Confirmación" },
  ]

  return (
    <div className="flex items-center justify-between">
      {pasos.map((p, index) => (
        <React.Fragment key={p.numero}>
          {/* CÍRCULO DEL PASO */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
              paso >= p.numero
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
            }`}
          >
            {paso > p.numero ? (
              <FiCheck size={24} />
            ) : (
              <span>{p.numero}</span>
            )}
          </div>

          {/* LÍNEA CONECTORA */}
          {index < pasos.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 transition-all ${
                paso > p.numero
                  ? "bg-blue-500"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            />
          )}
        </React.Fragment>
      ))}

      {/* LABELS */}
      <div className="absolute bottom-full mb-8 flex w-full justify-between text-sm font-medium">
        {pasos.map((p) => (
          <span
            key={p.numero}
            className={`${
              paso >= p.numero
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-500 dark:text-slate-500"
            }`}
          >
            {p.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Componente: Resumen y confirmación de la reserva
 */
function ResumenConfirmacion({
  espacio,
  slot,
  onConfirmar,
  onBack,
  loading,
  reservaCreada,
}) {
  const infoEspacio = ReservasServiceStatic.getInfoEspacio(espacio)

  if (reservaCreada) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 inline-block p-4 bg-green-100 dark:bg-green-900/20 rounded-full">
          <FiCheck className="text-green-600 dark:text-green-400" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
          ¡Reserva Confirmada!
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Tu reserva ha sido creada exitosamente
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* TARJETA DE RESUMEN */}
      <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Resumen de tu Reserva
        </h2>

        <div className="space-y-4">
          {/* ESPACIO */}
          <div className="flex items-start gap-4">
            <div className="text-2xl">{infoEspacio.icono}</div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Espacio
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {infoEspacio.nombre}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {infoEspacio.descripcion}
              </p>
            </div>
          </div>

          {/* HORA */}
          <div className="border-t border-blue-200 dark:border-blue-800 pt-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Fecha y Hora
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {ReservasServiceStatic.formatearFecha(slot.inicio)}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              hasta {ReservasServiceStatic.formatearHora(slot.fin)}
            </p>
          </div>

          {/* DURACIÓN */}
          <div className="border-t border-blue-200 dark:border-blue-800 pt-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Duración
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {slot.duracion} minutos
            </p>
          </div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Atrás
        </button>
        <button
          onClick={onConfirmar}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>Confirmando...</span>
            </>
          ) : (
            <>
              <FiCheck size={20} />
              <span>Confirmar Reserva</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

