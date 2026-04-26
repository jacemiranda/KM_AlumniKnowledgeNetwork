import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './use-auth'

type SetupGuardProps = {
  allowSetupPage: boolean
}

export function SetupGuard({ allowSetupPage }: SetupGuardProps) {
  const { session, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <div className="min-h-screen bg-ink-950 p-6 text-slate-100">Loading profile...</div>
  }

  if (!session) {
    return null
  }

  const isProfileComplete = session.user.profileCompleted === true

  if (!isProfileComplete && !allowSetupPage) {
    return <Navigate to="/setup" replace state={{ from: location.pathname }} />
  }

  if (isProfileComplete && allowSetupPage) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
