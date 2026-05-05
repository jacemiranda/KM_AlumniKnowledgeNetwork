import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './use-auth'

export function ProtectedRoute() {
  const { session, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <div className="min-h-screen bg-ink-950 p-6 text-slate-100">Loading session...</div>
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
