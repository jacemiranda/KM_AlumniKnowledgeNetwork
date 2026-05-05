import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FeedPage } from './FeedPage'

const usePostsMock = vi.fn()

vi.mock('./use-posts', () => ({
  usePosts: (...args: unknown[]) => usePostsMock(...args),
}))

vi.mock('./FeedFilters', () => ({
  FeedFilters: () => <div data-testid="feed-filters" />,
}))

vi.mock('./PostComposer', () => ({
  PostComposer: () => <div data-testid="post-composer" />,
}))

vi.mock('./PostCard', () => ({
  PostCard: ({ post }: { post: { title: string } }) => <div data-testid="post-card">{post.title}</div>,
}))

function renderFeedPage() {
  render(
    <MemoryRouter>
      <FeedPage />
    </MemoryRouter>,
  )
}

describe('FeedPage states', () => {
  beforeEach(() => {
    usePostsMock.mockReset()
  })

  it('shows the loading state', () => {
    usePostsMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    renderFeedPage()

    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('shows the empty state', () => {
    usePostsMock.mockReturnValue({
      data: { posts: [], total: 0 },
      isLoading: false,
      error: null,
    })

    renderFeedPage()

    expect(screen.getByText(/no posts yet/i)).toBeInTheDocument()
  })

  it('shows the error state', () => {
    usePostsMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network request failed'),
    })

    renderFeedPage()

    expect(screen.getByText(/network request failed/i)).toBeInTheDocument()
  })
})