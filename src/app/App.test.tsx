import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App scaffold auth flow', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('shows the login experience when no session is present', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /welcome to alumni knowledge network/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /continue with google \(dev mode\)/i }),
    ).toBeInTheDocument()
  })

  it('restores a stored session and lands on the feed shell', () => {
    window.localStorage.setItem(
      'akn.mock-session',
      JSON.stringify({
        user: {
          id: 'dev-alumni',
          name: 'Jordan Reyes',
          email: 'jordan@example.com',
          role: 'end_user',
          userType: 'alumni',
        },
      }),
    )

    render(<App />)

    expect(
      screen.getByRole('heading', { name: /universal feed/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/jordan reyes/i)).toBeInTheDocument()
  })
})
