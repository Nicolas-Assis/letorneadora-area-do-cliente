import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuthStore } from '../../lib/store'

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, loading, checkAuth } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    )
  }

  // Se requer autenticação mas usuário não está logado
  if (requireAuth && !user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    )
  }

  // Se não requer autenticação mas usuário está logado (ex: página de login)
  if (!requireAuth && user) {
    return (
      <Navigate 
        to="/minha-conta" 
        replace 
      />
    )
  }

  return children
}

export default ProtectedRoute

