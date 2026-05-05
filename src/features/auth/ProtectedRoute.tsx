import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './use-auth'

export function ProtectedRoute() {
  const { session, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return null
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
