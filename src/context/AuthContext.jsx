import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)

  // Simulación de la función login original
  const login = (email) => {
    // Mock users - basado en el código original
    const mockUsers = {
      'super@admin.com': { email: 'super@admin.com', name: 'Super Admin', role: 'super_admin' },
      'admin@condo.com': { email: 'admin@condo.com', name: 'Administrador', role: 'admin' },
      'conserje@condo.com': { email: 'conserje@condo.com', name: 'Conserje', role: 'conserje' },
      'directiva@condo.com': { email: 'directiva@condo.com', name: 'Directiva', role: 'directiva' },
      'residente@condo.com': { email: 'residente@condo.com', name: 'Residente', role: 'residente' }
    }

    const user = mockUsers[email]
    if (user) {
      setCurrentUser(user)
      return { success: true }
    }
    return { success: false, message: 'Usuario no encontrado. Emails válidos: super@admin.com, admin@condo.com, conserje@condo.com, directiva@condo.com, residente@condo.com' }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}