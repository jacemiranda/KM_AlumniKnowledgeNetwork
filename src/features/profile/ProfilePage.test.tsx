import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProfilePage } from './ProfilePage'

const mockUseAuth = vi.fn()
const mockUseProfileMetrics = vi.fn()
const mockUseUserBadges = vi.fn()
const mockUseCheckBadges = vi.fn()
const mockUsePosts = vi.fn()
const mockUseUserComments = vi.fn()

vi.mock('../auth/use-auth', () => ({
  useAuth: () => mockUseAuth(),
}))

vi.mock('./use-profile-metrics', () => ({
  useProfileMetrics: (profileId: string) => mockUseProfileMetrics(profileId),
}))

vi.mock('../badges/use-badges', () => ({
  useUserBadges: () => mockUseUserBadges(),
  useCheckBadges: () => mockUseCheckBadges(),
}))

vi.mock('../feed/use-posts', () => ({
  usePosts: () => mockUsePosts(),
}))

vi.mock('../feed/use-comments', () => ({
  useUserComments: () => mockUseUserComments(),
}))

function profile(overrides = {}) {
  return {
    id: 'profile-1',
    email: 'alumni@example.com',
    name: 'Avery Alumni',
    bio: 'Frontend mentor',
    profile_picture_url: null,
    user_type: 'alumni',
    created_at: '2026-01-01T00:00:00Z',
    field: { id: 'field-1', name: 'Software Development' },
    skills: [{ id: 'skill-1', name: 'React' }],
    authority_score: 3,
    post_count: 4,
    posts_tagged_in: 2,
    comment_count: 5,
    my_vote: null,
    ...overrides,
  }
}

function renderProfile(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ProfilePage', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      session: {
        user: {
          id: 'viewer-1',
          name: 'Viewer User',
          email: 'viewer@example.com',
          role: 'end_user',
          userType: 'student',
          profileCompleted: true,
        },
      },
    })
    mockUseProfileMetrics.mockReturnValue({
      data: profile(),
      isLoading: false,
      error: null,
    })
    mockUsePosts.mockReturnValue({ data: { posts: [] }, isLoading: false })
    mockUseUserComments.mockReturnValue({ data: [], isLoading: false })
    mockUseUserBadges.mockReturnValue({ data: [], isLoading: false })
    mockUseCheckBadges.mockReturnValue({ mutate: vi.fn() })
  })

  it('uses the signed-in user id for /profile', () => {
    renderProfile('/profile')

    expect(mockUseProfileMetrics).toHaveBeenCalledWith('viewer-1')
    expect(screen.getByRole('heading', { name: /avery alumni/i })).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText(/authority score/i)).toBeInTheDocument()
  })

  it('uses the route user id for /profile/:userId', () => {
    renderProfile('/profile/profile-99')

    expect(mockUseProfileMetrics).toHaveBeenCalledWith('profile-99')
  })

  it('renders the content tabs', () => {
    renderProfile('/profile')

    expect(screen.getByRole('button', { name: /posts/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /comments/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tagged/i })).toBeInTheDocument()
  })
})
