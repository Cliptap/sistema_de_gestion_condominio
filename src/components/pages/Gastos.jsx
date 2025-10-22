import React, { useState } from 'react'
import { showToast } from '../ToastContainer'

export default function Gastos() {
  const [gastos, setGastos] = useState([
    { id: 1, concepto: 'Limpieza Áreas Comunes', monto: 450000, fecha: '2023-10-01', estado: 'pagado' },
    { id: 2, concepto: 'Mantenimiento Ascensores', monto: 280000, fecha: '2023-10-01', estado: 'pendiente' },
    { id: 3, concepto: 'Electricidad Áreas Comunes', monto: 125000, fecha: '2023-10-01', estado: 'pagado' },
    { id: 4, concepto: 'Agua Potable', monto: 89000, fecha: '2023-10-01', estado: 'pagado' },
    { id: 5, concepto: 'Seguridad', monto: 650000, fecha: '2023-10-01', estado: 'pendiente' },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingGasto, setEditingGasto] = useState(null)
  const [formData, setFormData] = useState({
    concepto: '',
    monto: '',
    fecha: '',
    estado: 'pendiente'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingGasto) {
      setGastos(prev => prev.map(g => 
        g.id === editingGasto.id 
          ? { ...editingGasto, ...formData, monto: parseFloat(formData.monto) }
          : g
      ))
      showToast('Gasto actualizado correctamente', 'success')
    } else {
      const newGasto = {
        id: Date.now(),
        ...formData,
        monto: parseFloat(formData.monto)
      }
      setGastos(prev => [...prev, newGasto])
      showToast('Gasto registrado correctamente', 'success')
    }
    
    setShowModal(false)
    setEditingGasto(null)
    setFormData({ concepto: '', monto: '', fecha: '', estado: 'pendiente' })
  }

  const handleEdit = (gasto) => {
    setEditingGasto(gasto)
    setFormData({
      concepto: gasto.concepto,
      monto: gasto.monto.toString(),
      fecha: gasto.fecha,
      estado: gasto.estado
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      setGastos(prev => prev.filter(g => g.id !== id))
      showToast('Gasto eliminado correctamente', 'success')
    }
  }

  const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0)
  const gastosPendientes = gastos.filter(g => g.estado === 'pendiente').length

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gastos Comunes</h1>
          <p className="text-gray-600 dark:text-gray-300">Gestión de gastos del condominio</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium focus-outline"
        >
          + Nuevo Gasto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Gastos</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalGastos.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Gastos Pendientes</h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{gastosPendientes}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Gastos Pagados</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{gastos.length - gastosPendientes}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Concepto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {gastos.map((gasto) => (
                <tr key={gasto.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {gasto.concepto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${gasto.monto.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(gasto.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      gasto.estado === 'pagado' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {gasto.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(gasto)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(gasto.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingGasto ? 'Editar Gasto' : 'Nuevo Gasto'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Concepto
                </label>
                <input
                  type="text"
                  required
                  value={formData.concepto}
                  onChange={(e) => setFormData(prev => ({ ...prev, concepto: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monto
                </label>
                <input
                  type="number"
                  required
                  value={formData.monto}
                  onChange={(e) => setFormData(prev => ({ ...prev, monto: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  required
                  value={formData.fecha}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="pagado">Pagado</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingGasto(null)
                    setFormData({ concepto: '', monto: '', fecha: '', estado: 'pendiente' })
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus-outline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus-outline"
                >
                  {editingGasto ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}