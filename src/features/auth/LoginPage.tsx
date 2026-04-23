import { Navigate } from 'react-router-dom'
import { useAuth } from './use-auth'

export function LoginPage() {
  const { session, signInWithMockGoogle } = useAuth()

  if (session) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="auth-layout">
      <section className="auth-card">
        <p className="eyebrow">Sprint 1 PR-01 scaffold</p>
        <h1>Welcome to Alumni Knowledge Network</h1>
        <p className="auth-copy">
          This scaffold sets up the protected shell, route baseline, and a
          temporary development session while Google OAuth is implemented in
          Sprint 1 PR-03.
        </p>
        <div className="auth-banner" role="status">
          Development mode only. This sign-in button creates a local mock session
          and does not connect to Supabase yet.
        </div>
        <button className="primary-button" onClick={signInWithMockGoogle} type="button">
          Continue with Google (Dev Mode)
        </button>
      </section>
    </main>
  )
}
