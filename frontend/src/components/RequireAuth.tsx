import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { usuario, carregando } = useAuth()

  if (carregando) return null
  if (!usuario) return <Navigate to="/login" replace />

  return <>{children}</>
}