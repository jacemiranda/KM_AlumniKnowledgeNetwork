import { Navigate } from 'react-router-dom'
import { useAuth } from './use-auth'

export function LoginPage() {
  const { session, signInWithMockGoogle } = useAuth()

  if (session) {
    return <Navigate to={session.user.profileCompleted ? '/' : '/setup'} replace />
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-10 text-slate-100 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-28 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-16 right-0 h-96 w-96 rounded-full bg-amber-300/15 blur-3xl" />
      </div>

      <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-7 shadow-liquid backdrop-blur-2xl sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-emerald-600 text-ink-950 shadow-[0_10px_30px_rgba(55,235,172,0.35)]">
          <span className="text-3xl font-black tracking-tight">E</span>
        </div>
        <p className="mt-6 text-center text-3xl uppercase tracking-[0.28em] text-emerald-200/90">
          EraLink
        </p>
        <p className="mt-3 text-center text-sm text-slate-300 sm:text-base">
          Connect to the future of seamless integration.
        </p>

        <div className="mt-7 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-3 text-sm text-amber-100" role="status">
          Dev mode note: this uses a local mock session for PR-02 UI validation.
        </div>

        <button
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500 px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-ink-950 shadow-[0_10px_24px_rgba(70,222,163,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(70,222,163,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
          onClick={signInWithMockGoogle}
          type="button"
        >
          <span className="text-base">G</span>
          <span>Sign in with Google</span>
        </button>

        <p className="mt-6 text-center text-xs text-slate-400">
          By signing in, you agree to the platform terms and privacy policy.
        </p>
      </section>
    </main>
  )
}
