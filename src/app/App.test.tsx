import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import type { ProfileRow } from '../features/auth/profile-service'

let currentSession: { user: { id: string; email: string } } | null = null
let currentProfile: ProfileRow | null = null

vi.mock('../lib/supabase', () => ({
  getSupabaseClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: currentSession },
        error: null,
      }),
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      })),
      signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: vi.fn((table: string) => ({
      select: vi.fn(() => {
        if (table === 'profiles') {
          return {
            eq: vi.fn(() => ({
              maybeSingle: vi.fn().mockResolvedValue({
                data: currentProfile,
                error: null,
              }),
            })),
          }
        }

        return {
          order: vi.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }
      }),
    })),
  }),
}))

function profile(profileCompleted: boolean): ProfileRow {
  return {
    id: 'user-1',
    email: 'casey@example.com',
    role: 'end_user',
    user_type: 'student',
    status: 'active',
    is_first_time_setup_complete: profileCompleted,
    name: 'Casey Diaz',
    bio: null,
    profile_picture_url: null,
    field_id: profileCompleted ? 'field-1' : null,
  }
}

describe('App Supabase auth flow', () => {
  beforeEach(() => {
    currentSession = null
    currentProfile = null
  })

  it('shows the Google-only login experience when no Supabase session is present', async () => {
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: /sign in to alumni knowledge network/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /sign in with google/i }),
    ).toBeInTheDocument()
  })

  it('lands completed profiles on the feed shell', async () => {
    currentSession = { user: { id: 'user-1', email: 'casey@example.com' } }
    currentProfile = profile(true)

    render(<App />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/share a practical insight/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/casey diaz/i)).toBeInTheDocument()
  })

  it('routes incomplete profiles to first-time setup', async () => {
    currentSession = { user: { id: 'user-1', email: 'casey@example.com' } }
    currentProfile = profile(false)

    render(<App />)

    expect(
      await screen.findByRole('heading', { name: /complete your profile/i }),
    ).toBeInTheDocument()
  })
})
