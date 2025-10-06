import React, { useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useAuth } from '../../context/AuthContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Dashboard() {
  const { currentUser } = useAuth()

  // Mock data for charts
  const chartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ingresos',
        data: [65000, 59000, 80000, 81000, 56000, 75000],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Gastos',
        data: [45000, 49000, 60000, 71000, 46000, 65000],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Resumen Financiero Mensual',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString()
          }
        }
      }
    }
  }

  // Mock stats based on user role
  const getStatsForRole = () => {
    const baseStats = [
      { title: 'Residentes Activos', value: '245', change: '+12%', icon: UsersIcon, color: 'blue' },
      { title: 'Pagos del Mes', value: '$1,234,567', change: '+8.2%', icon: MoneyIcon, color: 'green' },
      { title: 'Reservas Activas', value: '18', change: '+3', icon: CalendarIcon, color: 'purple' },
      { title: 'Morosidad', value: '8.3%', change: '-2.1%', icon: WarningIcon, color: 'red' },
    ]

    if (currentUser.role === 'residente') {
      return [
        { title: 'Mi Saldo', value: '$45,230', change: 'Al día', icon: MoneyIcon, color: 'green' },
        { title: 'Mis Reservas', value: '2', change: 'Activas', icon: CalendarIcon, color: 'purple' },
        { title: 'Anuncios', value: '5', change: 'Nuevos', icon: BellIcon, color: 'blue' },
        { title: 'Multas', value: '0', change: 'Pendientes', icon: WarningIcon, color: 'green' },
      ]
    }

    return baseStats
  }

  const stats = getStatsForRole()

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Bienvenido, {currentUser.name}. Aquí tienes un resumen de la actividad del condominio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') || stat.change === 'Al día' ? 'text-green-600 dark:text-green-400' : stat.change.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Chart */}
        {(currentUser.role === 'admin' || currentUser.role === 'super_admin' || currentUser.role === 'directiva') && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumen Financiero</h3>
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {[
              { action: 'Nuevo pago registrado', user: 'Juan Pérez - Depto 201', time: 'Hace 2 horas', type: 'payment' },
              { action: 'Reserva de quincho', user: 'María González - Depto 305', time: 'Hace 4 horas', type: 'reservation' },
              { action: 'Multa aplicada', user: 'Carlos Silva - Depto 102', time: 'Hace 6 horas', type: 'fine' },
              { action: 'Pago de gastos comunes', user: 'Ana Martín - Depto 408', time: 'Hace 1 día', type: 'payment' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className={`p-2 rounded-full ${activity.type === 'payment' ? 'bg-green-100 dark:bg-green-900' : activity.type === 'reservation' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-red-100 dark:bg-red-900'}`}>
                  {activity.type === 'payment' ? (
                    <MoneyIcon className={`w-4 h-4 ${activity.type === 'payment' ? 'text-green-600 dark:text-green-400' : ''}`} />
                  ) : activity.type === 'reservation' ? (
                    <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <WarningIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.user}</p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentUser.role !== 'residente' && (
            <>
              <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow focus-outline">
                <MoneyIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Registrar Pago</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow focus-outline">
                <WarningIcon className="w-8 h-8 text-red-600 dark:text-red-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Nueva Multa</span>
              </button>
            </>
          )}
          <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow focus-outline">
            <CalendarIcon className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Nueva Reserva</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow focus-outline">
            <BellIcon className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Nuevo Anuncio</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Icon components
function UsersIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  )
}

function MoneyIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function WarningIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  )
}

function BellIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5-5-5h5V3h0z" />
    </svg>
  )
}