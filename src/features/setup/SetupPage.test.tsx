import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../auth/context'
import { SetupPage } from './SetupPage'
import { fetchFields, fetchSkills } from '../auth/profile-service'

vi.mock('../../lib/supabase', () => ({
  getSupabaseClient: () => ({}),
}))

vi.mock('../auth/profile-service', async () => {
  const actual = await vi.importActual<typeof import('../auth/profile-service')>(
    '../auth/profile-service',
  )

  return {
    ...actual,
    fetchFields: vi.fn(),
    fetchSkills: vi.fn(),
  }
})

const completeProfile = vi.fn().mockResolvedValue(undefined)

function renderSetupPage(authOverrides: Partial<AuthContextValue> = {}) {
  const value: AuthContextValue = {
    status: 'authenticated',
    error: null,
    profile: {
      id: 'user-1',
      email: 'casey@example.com',
      role: 'end_user',
      userType: null,
      status: 'active',
      isFirstTimeSetupComplete: false,
      name: 'Casey Diaz',
      bio: null,
      profilePictureUrl: null,
      fieldId: null,
    },
    session: {
      user: {
        id: 'user-1',
        email: 'casey@example.com',
        name: 'Casey Diaz',
        role: 'end_user',
        userType: null,
        profileCompleted: false,
      },
    },
    refreshProfile: vi.fn(),
    signInWithGoogle: vi.fn(),
    completeProfile,
    signOut: vi.fn(),
    ...authOverrides,
  }

  return render(
    <MemoryRouter initialEntries={['/setup']}>
      <AuthContext.Provider value={value}>
        <SetupPage />
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('SetupPage', () => {
  beforeEach(() => {
    completeProfile.mockClear()
    vi.mocked(fetchFields).mockResolvedValue([
      { id: 'field-1', name: 'Software Development' },
      { id: 'field-2', name: 'Design' },
    ])
    vi.mocked(fetchSkills).mockResolvedValue([
      { id: 'skill-1', name: 'Frontend Development' },
      { id: 'skill-2', name: 'Career Coaching' },
    ])
  })

  it('loads field and skill options from Supabase-backed services', async () => {
    renderSetupPage()

    expect(await screen.findByRole('option', { name: 'Software Development' })).toBeInTheDocument()
    expect(screen.getByLabelText('Frontend Development')).toBeInTheDocument()
    expect(screen.getByLabelText('Career Coaching')).toBeInTheDocument()
  })

  it('saves first-time profile setup with selected field and skills', async () => {
    renderSetupPage()

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Casey Diaz' },
    })
    fireEvent.change(await screen.findByLabelText(/academic field/i), {
      target: { value: 'field-1' },
    })
    fireEvent.change(screen.getByLabelText(/short bio/i), {
      target: { value: 'Building practical software skills' },
    })
    fireEvent.click(screen.getByRole('button', { name: /student/i }))
    fireEvent.click(await screen.findByLabelText('Frontend Development'))
    fireEvent.submit(screen.getByRole('button', { name: /complete profile/i }).closest('form')!)

    await waitFor(() => {
      expect(completeProfile).toHaveBeenCalledWith({
        name: 'Casey Diaz',
        bio: 'Building practical software skills',
        userType: 'student',
        fieldId: 'field-1',
        profilePictureUrl: '',
        skillIds: ['skill-1'],
      })
    })
  })
})
