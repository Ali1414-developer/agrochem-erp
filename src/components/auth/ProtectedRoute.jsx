import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ redirectTo = '/login' }) {
  const { isAuthenticated, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="animate-pulse">Loading...</p>
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />
}
