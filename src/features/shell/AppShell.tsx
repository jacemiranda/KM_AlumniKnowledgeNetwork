import { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/use-auth'
import { NotificationsDropdown } from '../notifications/NotificationsDropdown'
import { SearchBar } from '../search/SearchBar'
import { Logo } from '../../components/Logo'
const baseLinks = [
  { to: '/', label: 'Feed' },
  { to: '/alumni', label: 'Alumni' },
  { to: '/leaderboard', label: 'Leaderboard' },
]

export function AppShell() {
  const { session, profile, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const headerRef = useRef<HTMLElement | null>(null)
  const mainRef = useRef<HTMLElement | null>(null)
  const [isScrolledPast, setIsScrolledPast] = useState(false)
  const [isFloatingVisible, setIsFloatingVisible] = useState(false)
  const [floatingStyle, setFloatingStyle] = useState<{ left: number; width: number } | null>(null)
  const [mainStyle, setMainStyle] = useState<{ left: number; width: number } | null>(null)
  const [prevPathname, setPrevPathname] = useState(location.pathname)

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname)
    setIsMobileMenuOpen(false)
  }

  const role = session?.user?.role
  const shellLinks = role === 'admin' || role === 'moderator'
    ? [...baseLinks, { to: '/admin', label: 'Admin' }]
    : baseLinks

  useEffect(() => {
    function updateScrollState() {
      const el = headerRef.current
      if (!el) {
        setIsScrolledPast(false)
        setFloatingStyle(null)
        setMainStyle(null)
        return
      }

      const rect = el.getBoundingClientRect()
      const pageYOffset = window.scrollY || window.pageYOffset
      const threshold = rect.bottom + pageYOffset
      const scrolledPastNow = pageYOffset > threshold
      setIsScrolledPast(scrolledPastNow)

      // Calculate floating left and width to match inline header
      const left = rect.left
      const width = rect.width
      setFloatingStyle({ left: Math.max(0, left), width: Math.max(0, width) })

      // Measure main feed column to constrain overlays and trigger zone
      const mainEl = mainRef.current
      if (mainEl) {
        const mainRect = mainEl.getBoundingClientRect()
        setMainStyle({ left: Math.max(0, mainRect.left), width: Math.max(0, mainRect.width) })
      }
    }

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      window.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  if (!session) {
    return null
  }

  function renderTopBarContent() {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex items-center gap-4 cursor-pointer transition hover:opacity-75"
        >
          {profile?.profilePictureUrl ? (
            <img
              src={profile.profilePictureUrl}
              alt={session?.user.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10 transition hover:ring-emerald-300/50"
            />
          ) : (
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 ring-2 ring-white/10 transition hover:ring-emerald-300/50">
              <span className="text-xl font-bold uppercase">{session?.user.name.charAt(0)}</span>
            </div>
          )}
          <div className="text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">{session?.user.userType ?? 'pending'}</p>
            <p className="mt-1 text-xl font-black tracking-tight text-white">{session?.user.name}</p>
            <p className="text-sm text-slate-300">
              {session?.user.email}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <NotificationsDropdown />
        </div>
      </div>
    )
  }

  function renderFloatingHeaderContent() {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex items-center gap-4 cursor-pointer transition hover:opacity-75"
        >
          {profile?.profilePictureUrl ? (
            <img
              src={profile.profilePictureUrl}
              alt={session?.user.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10 transition hover:ring-emerald-300/50"
            />
          ) : (
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 ring-2 ring-white/10 transition hover:ring-emerald-300/50">
              <span className="text-xl font-bold uppercase">{session?.user.name.charAt(0)}</span>
            </div>
          )}
          <div className="text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">{session?.user.userType ?? 'pending'}</p>
            <p className="mt-1 text-xl font-black tracking-tight text-white">{session?.user.name}</p>
            <p className="text-sm text-slate-300">
              {session?.user.email}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <NotificationsDropdown />
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-clip bg-ink-950 px-4 pb-24 pt-6 text-slate-100 md:px-6 md:pb-8 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-10 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-liquid backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/40 hover:shadow-2xl hover:shadow-emerald-900/20 md:sticky md:top-6 md:block md:h-[calc(100vh-3rem)] overflow-y-auto overscroll-contain">
          <div className="border-b border-white/10 pb-5">
            <Logo className="h-10" />
          </div>

          {/* Sidebar Search */}
          <div className="mt-4">
            <SearchBar compact navigateOnSubmit placeholder="Quick search..." />
          </div>

          <nav aria-label="Primary" className="mt-4 grid gap-2">
            {shellLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-2xl border border-emerald-300/40 bg-emerald-300/15 px-4 py-3 text-sm font-bold text-emerald-100'
                    : 'rounded-2xl border border-transparent bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:border-white/10 hover:text-slate-100 cursor-pointer'
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 border-t border-white/10 pt-4">
            <button
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm font-bold text-slate-300 transition hover:border-white/30 hover:bg-white/10 hover:text-white cursor-pointer"
              onClick={signOut}
              type="button"
            >
              Sign out
            </button>
          </div>
        </aside>

        <main ref={mainRef} className="flex flex-col gap-5">
          {location.pathname === '/' && (
            <>
              {/* Inline header (original document flow) */}
              <header ref={headerRef} className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-liquid backdrop-blur-2xl sm:p-5">
                {renderTopBarContent()}
              </header>

              {/* Trigger zone (appears only after header scrolls past) */}
              {isScrolledPast && mainStyle && (
                <div
                  onMouseEnter={() => setIsFloatingVisible(true)}
                  onMouseLeave={() => setIsFloatingVisible(false)}
                  className="fixed top-0 h-12 z-40"
                  style={{ left: `${mainStyle.left}px`, width: `${mainStyle.width}px` }}
                  aria-hidden
                />
              )}

              {/* Floating header revealed on hover of trigger zone */}
              {isScrolledPast && floatingStyle && (
                <div
                  onMouseEnter={() => setIsFloatingVisible(true)}
                  onMouseLeave={() => setIsFloatingVisible(false)}
                  className={`pointer-events-auto fixed top-6 z-50 transform transition-transform duration-300 ease-out ${
                    isFloatingVisible ? 'translate-y-0' : '-translate-y-[150%]'
                  }`}
                  style={{ left: `${floatingStyle.left}px`, width: `${floatingStyle.width}px` }}
                >
                  <div className="rounded-3xl border border-white/10 bg-[#131b2e]/80 backdrop-blur-2xl p-4 sm:p-5" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)' }}>
                    {renderFloatingHeaderContent()}
                  </div>
                </div>
              )}

              {/* Edge blur overlays to focus center posts while scrolling */}
            </>
          )}

          <section>
            <Outlet />
          </section>
        </main>
      </div>

      <nav className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 gap-1 border-t border-white/10 bg-ink-950/95 p-2 backdrop-blur md:hidden`}>
        {[{ to: '/', label: 'Feed' }, { to: '/search', label: 'Search' }, { to: '/notifications', label: 'Alerts' }].map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              isActive
                ? 'rounded-xl bg-emerald-300/20 py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-100'
                : 'rounded-xl py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 transition hover:text-slate-200'
            }
          >
            {link.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`rounded-xl py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.12em] transition cursor-pointer ${
            isMobileMenuOpen ? 'bg-emerald-300/20 text-emerald-100' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Menu
        </button>
      </nav>

      {/* Mobile Menu Bottom Sheet */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-ink-950/60 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute bottom-16 left-0 right-0 rounded-t-3xl border-t border-white/10 bg-ink-950 p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-300">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-full bg-white/5 p-2 text-slate-400 hover:text-white cursor-pointer transition">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="grid gap-2">
              {shellLinks.filter(l => !['/', '/search', '/notifications'].includes(l.to)).map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    isActive
                      ? 'rounded-2xl border border-emerald-300/40 bg-emerald-300/15 px-4 py-3 text-sm font-bold text-emerald-100'
                      : 'rounded-2xl border border-transparent bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:border-white/10 hover:text-slate-100 cursor-pointer'
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="my-2 border-t border-white/10" />
              <button
                className="w-full rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-left text-sm font-bold text-red-300 transition hover:bg-red-400/10 cursor-pointer"
                onClick={signOut}
                type="button"
              >
                Sign out
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
