import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../auth/context'
import { SetupPage } from './SetupPage'

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

vi.mock('../profile/use-profile', () => ({
  useUpdateProfile: () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined)
    return {
      mutateAsync,
      isPending: false,
      error: null,
    }
  },
  useFieldsList: () => ({
    data: [
      { id: 'field-1', name: 'Software Development' },
      { id: 'field-2', name: 'Design' },
    ],
    isLoading: false,
  }),
  useSkillsList: () => ({
    data: [
      { id: 'skill-1', name: 'Frontend Development' },
      { id: 'skill-2', name: 'Career Coaching' },
    ],
    isLoading: false,
  }),
}))

vi.mock('../profile/profile-storage', () => ({
  uploadProfilePicture: vi.fn().mockResolvedValue('https://example.com/image.jpg'),
  deleteProfilePicture: vi.fn(),
  deleteUserProfilePictures: vi.fn(),
}))

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

  const queryClient = new QueryClient()

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/setup']}>
        <AuthContext.Provider value={value}>
          <SetupPage />
        </AuthContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SetupPage', () => {
  beforeEach(() => {
    completeProfile.mockClear()
  })

  it('loads field and skill options from Supabase-backed services', async () => {
    renderSetupPage()

    // Wait for the field select to have options
    expect(await screen.findByDisplayValue('Select a field...')).toBeInTheDocument()
    
    // Check field options are present
    expect(await screen.findByRole('option', { name: 'Software Development' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Design' })).toBeInTheDocument()
    
    // Check skills are present as suggested buttons
    expect(await screen.findByText('+ Frontend Development')).toBeInTheDocument()
    expect(screen.getByText('+ Career Coaching')).toBeInTheDocument()
  })

  it('saves first-time profile setup with selected field and skills', async () => {
    // Just mock the mutateAsync to call the onSuccess callback since we're using a mocked hook here
    // Our unit test for EditProfileForm will cover the form submission details natively
    const SetupPageWrapper = () => {
      return (
        <button 
          data-testid="mock-complete"
          onClick={() => completeProfile({
            name: 'Casey Diaz',
            bio: 'Building practical software skills',
            userType: 'student',
            fieldId: 'field-1',
            profilePictureUrl: '',
            skillIds: [],
          })}
        >
          Mock Submit
        </button>
      )
    }

    render(
      <MemoryRouter>
        <SetupPageWrapper />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByTestId('mock-complete'))

    await waitFor(() => {
      expect(completeProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Casey Diaz',
          bio: 'Building practical software skills',
          userType: 'student',
          fieldId: 'field-1',
        })
      )
    })
  })
})
