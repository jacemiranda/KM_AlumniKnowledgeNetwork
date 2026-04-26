import { act, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from './auth-context'
import { useAuth } from './use-auth'
import type { ProfileRow } from './profile-service'

const completedProfile: ProfileRow = {
  id: 'user-1',
  email: 'casey@example.com',
  role: 'end_user',
  user_type: 'student',
  status: 'active',
  is_first_time_setup_complete: true,
  name: 'Casey Diaz',
  bio: null,
  profile_picture_url: null,
  field_id: 'field-1',
}

function createAuthClient(profile: ProfileRow | null) {
  const signInWithOAuth = vi.fn().mockResolvedValue({ error: null })
  const signOut = vi.fn().mockResolvedValue({ error: null })
  const maybeSingle = vi.fn().mockResolvedValue({ data: profile, error: null })
  const eq = vi.fn(() => ({ maybeSingle }))
  const select = vi.fn(() => ({ eq }))

  return {
    signInWithOAuth,
    signOut,
    client: {
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: {
            session: {
              user: {
                id: 'user-1',
                email: 'casey@example.com',
              },
            },
          },
          error: null,
        }),
        onAuthStateChange: vi.fn(() => ({
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        })),
        signInWithOAuth,
        signOut,
      },
      from: vi.fn(() => ({ select })),
    },
  }
}

function AuthConsumer() {
  const auth = useAuth()

  return (
    <div>
      <p>Status: {auth.status}</p>
      <p>Profile: {auth.profile?.name ?? 'none'}</p>
      <p>Complete: {auth.profile?.isFirstTimeSetupComplete ? 'yes' : 'no'}</p>
      <button type="button" onClick={() => void auth.signInWithGoogle()}>
        Google
      </button>
      <button type="button" onClick={() => void auth.signOut()}>
        Sign out
      </button>
    </div>
  )
}

describe('AuthProvider', () => {
  it('loads the Supabase session and current profile', async () => {
    const { client } = createAuthClient(completedProfile)

    render(
      <AuthProvider client={client}>
        <AuthConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Status: authenticated')).toBeInTheDocument()
    })

    expect(screen.getByText('Profile: Casey Diaz')).toBeInTheDocument()
    expect(screen.getByText('Complete: yes')).toBeInTheDocument()
  })

  it('starts Google OAuth through Supabase only', async () => {
    const { client, signInWithOAuth } = createAuthClient(null)

    render(
      <AuthProvider client={client}>
        <AuthConsumer />
      </AuthProvider>,
    )

    await act(async () => {
      screen.getByRole('button', { name: 'Google' }).click()
    })

    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
  })

  it('signs out through Supabase', async () => {
    const { client, signOut } = createAuthClient(completedProfile)

    render(
      <AuthProvider client={client}>
        <AuthConsumer />
      </AuthProvider>,
    )

    await act(async () => {
      screen.getByRole('button', { name: /sign out/i }).click()
    })

    expect(signOut).toHaveBeenCalled()
  })
})
