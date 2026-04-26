import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/use-auth'

const shellLinks = [
  { to: '/', label: 'Feed' },
  { to: '/profile', label: 'Profile' },
  { to: '/alumni', label: 'Alumni' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/notifications', label: 'Notifications' },
]

export function AppShell() {
  const { session, signOut } = useAuth()

  if (!session) {
    return null
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 px-4 pb-24 pt-6 text-slate-100 md:px-6 md:pb-8 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-10 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-liquid backdrop-blur-2xl md:sticky md:top-6 md:block md:h-[calc(100vh-3rem)]">
          <div className="border-b border-white/10 pb-5">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Alumni Knowledge Network</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white">EraLink Feed Shell</h1>
            <p className="mt-3 text-sm text-slate-300">
              OAuth entry, profile setup, and feed-first navigation for Sprint 1.
            </p>
          </div>

          <nav aria-label="Primary" className="mt-6 grid gap-2">
            {shellLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-2xl border border-emerald-300/40 bg-emerald-300/15 px-4 py-3 text-sm font-bold text-emerald-100'
                    : 'rounded-2xl border border-transparent bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:border-white/10 hover:text-slate-100'
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <button className="mt-6 w-full rounded-full border border-emerald-300/40 bg-emerald-300/15 px-4 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-100">
            Create Post
          </button>
        </aside>

        <main className="grid gap-5">
          <header className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-liquid backdrop-blur-2xl sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Authenticated</p>
                <p className="mt-1 text-xl font-black tracking-tight text-white">{session.user.name}</p>
                <p className="text-sm text-slate-300">
                  {session.user.userType ?? 'profile pending'} - {session.user.email}
                </p>
              </div>

              <button
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-200 transition hover:border-white/30 hover:bg-white/10"
                onClick={signOut}
                type="button"
              >
                Sign out
              </button>
            </div>
          </header>

          <section>
            <Outlet />
          </section>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 gap-1 border-t border-white/10 bg-ink-950/95 p-2 backdrop-blur md:hidden">
        {shellLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              isActive
                ? 'rounded-xl bg-emerald-300/20 py-2 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-100'
                : 'rounded-xl py-2 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
