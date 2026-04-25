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
    <div className="shell-layout">
      <aside className="shell-sidebar">
        <div className="brand-lockup">
          <p className="eyebrow">Alumni Knowledge Network</p>
          <h1>Protected Shell</h1>
          <p className="sidebar-copy">
            Sprint 1 scaffold for authenticated navigation, feed-first routing,
            and app-wide layout.
          </p>
        </div>
        <nav aria-label="Primary" className="shell-nav">
          {shellLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                isActive ? 'shell-link shell-link-active' : 'shell-link'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="shell-main">
        <header className="shell-header">
          <div>
            <p className="eyebrow">Authenticated view</p>
            <p className="user-name">{session.user.name}</p>
            <p className="user-meta">
              {session.user.userType} · {session.user.email}
            </p>
          </div>
          <button className="secondary-button" onClick={signOut} type="button">
            Sign out
          </button>
        </header>

        <section className="shell-panel">
          <Outlet />
        </section>
      </main>
    </div>
  )
}
