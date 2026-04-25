import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App scaffold auth flow', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('shows the login experience when no session is present', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /sign in to alumni knowledge network/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /sign in with google/i }),
    ).toBeInTheDocument()
  })

  it('restores a completed profile session and lands on the feed shell', () => {
    window.localStorage.setItem(
      'akn.mock-session',
      JSON.stringify({
        user: {
          id: 'dev-alumni',
          name: 'Jordan Reyes',
          email: 'jordan@example.com',
          role: 'end_user',
          userType: 'alumni',
          profileCompleted: true,
        },
      }),
    )

    render(<App />)

    expect(screen.getByPlaceholderText(/share a practical insight/i)).toBeInTheDocument()
    expect(screen.getByText(/jordan reyes/i)).toBeInTheDocument()
  })

  it('routes incomplete profile sessions to first-time setup', () => {
    window.localStorage.setItem(
      'akn.mock-session',
      JSON.stringify({
        user: {
          id: 'dev-student',
          name: 'Casey Diaz',
          email: 'casey@example.com',
          role: 'end_user',
          userType: 'student',
          profileCompleted: false,
        },
      }),
    )

    render(<App />)

    expect(
      screen.getByRole('heading', { name: /complete your profile/i }),
    ).toBeInTheDocument()
  })
})
