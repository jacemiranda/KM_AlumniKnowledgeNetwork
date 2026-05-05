import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserManagementPage } from './UserManagementPage'

const mockUseAuth = vi.fn()
const mockUseIsPrivileged = vi.fn()
const mockUseAllUsers = vi.fn()
const mockUseAllFields = vi.fn()
const mockUseBlockUser = vi.fn()
const mockUseUnblockUser = vi.fn()
const mockUseUpdateRole = vi.fn()
const mockUseManagedPosts = vi.fn()
const mockUseManagedComments = vi.fn()
const mockUseModeratePost = vi.fn()
const mockUseRestorePost = vi.fn()
const mockUseModerateComment = vi.fn()
const mockUseRestoreComment = vi.fn()
const mockUseToggleField = vi.fn()
const mockUseModerationLog = vi.fn()

vi.mock('../auth/use-auth', () => ({
  useAuth: () => mockUseAuth(),
}))

vi.mock('./use-moderation', () => ({
  useAllUsers: (filters: unknown) => mockUseAllUsers(filters),
  useAllFields: () => mockUseAllFields(),
  useBlockUser: () => mockUseBlockUser(),
  useUnblockUser: () => mockUseUnblockUser(),
  useUpdateRole: () => mockUseUpdateRole(),
  useManagedPosts: (filters: unknown) => mockUseManagedPosts(filters),
  useManagedComments: (filters: unknown) => mockUseManagedComments(filters),
  useModeratePost: () => mockUseModeratePost(),
  useRestorePost: () => mockUseRestorePost(),
  useModerateComment: () => mockUseModerateComment(),
  useRestoreComment: () => mockUseRestoreComment(),
  useToggleField: () => mockUseToggleField(),
  useModerationLog: (page: number) => mockUseModerationLog(page),
  useIsPrivileged: () => mockUseIsPrivileged(),
}))

vi.mock('../analytics/AnalyticsSummary', () => ({
  AnalyticsSummary: () => <div>Analytics Summary</div>,
}))

describe('UserManagementPage', () => {
  const blockMutate = vi.fn()
  const unblockMutate = vi.fn()
  const updateRoleMutate = vi.fn()
  const moderatePostMutate = vi.fn()
  const restorePostMutate = vi.fn()
  const moderateCommentMutate = vi.fn()
  const restoreCommentMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    mockUseAuth.mockReturnValue({
      session: {
        user: {
          id: 'admin-1',
          role: 'admin',
        },
      },
    })

    mockUseIsPrivileged.mockReturnValue({ isModerator: true, isAdmin: true })

    mockUseAllUsers.mockReturnValue({
      data: {
        users: [
          {
            id: 'user-1',
            email: 'student@example.com',
            name: 'Student User',
            bio: null,
            profile_picture_url: null,
            role: 'end_user',
            user_type: 'student',
            status: 'active',
            is_first_time_setup_complete: true,
            created_at: '2026-05-01T00:00:00Z',
            post_count: 2,
            comment_count: 3,
          },
        ],
        total: 1,
      },
      isLoading: false,
    })

    mockUseManagedPosts.mockReturnValue({
      data: {
        posts: [
          {
            id: 'post-1',
            title: 'Reported post title',
            content: 'Reported post content',
            status: 'published',
            post_type: 'question',
            created_at: '2026-05-01T00:00:00Z',
            author: { id: 'user-1', name: 'Student User' },
            field: { id: 'field-1', name: 'Software Development' },
          },
        ],
        total: 1,
      },
      isLoading: false,
    })

    mockUseManagedComments.mockReturnValue({ data: { comments: [], total: 0 }, isLoading: false })
    mockUseAllFields.mockReturnValue({ data: [], isLoading: false })
    mockUseModerationLog.mockReturnValue({ data: { entries: [], total: 0 }, isLoading: false })

    mockUseBlockUser.mockReturnValue({ mutate: blockMutate, isPending: false })
    mockUseUnblockUser.mockReturnValue({ mutate: unblockMutate, isPending: false })
    mockUseUpdateRole.mockReturnValue({ mutate: updateRoleMutate, isPending: false })
    mockUseModeratePost.mockReturnValue({ mutate: moderatePostMutate, isPending: false })
    mockUseRestorePost.mockReturnValue({ mutate: restorePostMutate, isPending: false })
    mockUseModerateComment.mockReturnValue({ mutate: moderateCommentMutate, isPending: false })
    mockUseRestoreComment.mockReturnValue({ mutate: restoreCommentMutate, isPending: false })
    mockUseToggleField.mockReturnValue({ mutate: vi.fn(), isPending: false })
  })

  it('renders user management table columns and user data', () => {
    render(<UserManagementPage />)

    expect(screen.getByText(/User Management/i)).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /User/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Role/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Status/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Actions/i })).toBeInTheDocument()
    expect(screen.getByText('Student User')).toBeInTheDocument()
  })

  it('shows moderation queue approve/remove buttons and handles clicks', () => {
    render(<UserManagementPage />)

    fireEvent.click(screen.getByRole('button', { name: /Moderation Queue/i }))

    const approveButton = screen.getByRole('button', { name: /Approve post: Reported post title/i })
    const removeButton = screen.getByRole('button', { name: /Remove post: Reported post title/i })

    fireEvent.click(approveButton)
    fireEvent.click(removeButton)

    expect(restorePostMutate).toHaveBeenCalledTimes(1)
    expect(moderatePostMutate).toHaveBeenCalledTimes(1)
  })
})
