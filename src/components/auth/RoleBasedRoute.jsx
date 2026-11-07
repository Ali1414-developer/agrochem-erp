import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RoleBasedRoute({ allowedRoles, fallbackPath }) {
  const { currentUser, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="animate-pulse">Loading...</p>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  const hasAccess = allowedRoles.includes(currentUser.role)
  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />
  }

  return <Outlet />
}
