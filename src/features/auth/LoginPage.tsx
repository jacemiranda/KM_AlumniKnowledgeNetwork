import { Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'
import { Logo } from '../../components/Logo'

export function LoginPage() {
  const { error, session, signInWithGoogle, status } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

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
        <div className="flex justify-center mb-6">
          <Logo className="h-16" />
        </div>
        <h1 className="mt-2 text-center text-3xl font-black uppercase tracking-[0.1em] text-emerald-200/90">
          Sign In
        </h1>

        {status === 'error' && error ? (
          <div className="mt-7 rounded-2xl border border-rose-300/35 bg-rose-400/10 p-3 text-sm text-rose-100" role="alert">
            {error}
          </div>
        ) : null}

        <button
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500 px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-ink-950 shadow-[0_10px_24px_rgba(70,222,163,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(70,222,163,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
          disabled={status === 'loading'}
          onClick={() => void signInWithGoogle()}
          type="button"
        >
          <span className="text-base">G</span>
          <span>{status === 'loading' ? 'Checking Session...' : 'Continue with Google'}</span>
        </button>

        <p className="mt-6 text-center text-xs text-slate-400">
          By signing in, you agree to the platform{' '}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-[#4edea3] transition-colors hover:text-emerald-300 underline underline-offset-2 decoration-emerald-400/30 hover:decoration-emerald-400"
          >
            terms and privacy policy
          </button>
          .
        </p>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#131b2e]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl w-[90%] max-w-2xl p-8 relative scale-95 animate-[scaleIn_0.2s_ease-out_forwards]">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-emerald-200/90">Terms of Service & Privacy Policy</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-2"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4 text-sm text-[#bbcabf] space-y-4">
              <p><strong>1. Acceptance of Terms</strong><br/>By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
              <p><strong>2. Privacy Policy</strong><br/>We respect your privacy and are committed to protecting it. Our Privacy Policy governs the processing of all personal data collected from you in connection with your use of the platform.</p>
              <p><strong>3. User Conduct</strong><br/>You agree to use our platform only for lawful purposes. You agree not to take any action that might compromise the security of the site, render the site inaccessible to others or otherwise cause damage to the site or the Content.</p>
              <p><strong>4. Intellectual Property</strong><br/>All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of the platform or its content suppliers and protected by international copyright laws.</p>
              <p><strong>5. Limitation of Liability</strong><br/>In no event shall we be liable for any direct, indirect, punitive, incidental, special or consequential damages arising out of or in any way connected with the use of this platform.</p>
              <p><strong>6. Modifications</strong><br/>We reserve the right to modify these terms at any time. Your continued use of the platform following the posting of changes will mean you accept those changes.</p>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500 px-6 py-2.5 text-sm font-bold text-ink-950 shadow-lg transition hover:-translate-y-0.5 hover:shadow-emerald-500/25"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
