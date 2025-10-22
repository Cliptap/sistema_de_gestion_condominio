import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginScreen from './components/LoginScreen'
import MainApp from './components/MainApp'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ToastContainer from './components/ToastContainer'

function AppContent() {
  const { currentUser } = useAuth()

  return (
    <div className="min-h-screen">
      <ToastContainer />
      {currentUser ? <MainApp /> : <LoginScreen />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}
