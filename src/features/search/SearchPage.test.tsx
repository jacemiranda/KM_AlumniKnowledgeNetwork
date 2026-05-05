import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SearchPage } from './SearchPage'

const mockUseSearchUsers = vi.fn()
const mockUseSearchPosts = vi.fn()

vi.mock('./use-search', () => ({
  useSearchUsers: (query: string, filters: Record<string, unknown>) => mockUseSearchUsers(query, filters),
  useSearchPosts: (query: string, filters: Record<string, unknown>) => mockUseSearchPosts(query, filters),
}))

function renderSearchPage(path = '/search?q=react') {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('SearchPage', () => {
  beforeEach(() => {
    mockUseSearchUsers.mockReturnValue({
      data: [
        {
          id: 'user-1',
          name: 'Avery Alumni',
          user_type: 'alumni',
          profile_picture_url: null,
          field: { id: 'field-1', name: 'Software Development' },
          bio: 'Frontend mentor',
          skills: [{ id: 'skill-1', name: 'React' }],
          authority_score: 4,
          post_count: 12,
        },
      ],
      isLoading: false,
      error: null,
    })

    mockUseSearchPosts.mockReturnValue({
      data: [
        {
          id: 'post-1',
          title: 'React study group',
          content: 'Sharing a practical insight for the next cohort.',
          post_type: 'question',
          field: { id: 'field-1', name: 'Software Development' },
          author: { id: 'user-1', name: 'Avery Alumni' },
          post_tags: [{ tag: { id: 'tag-1', name: 'React' } }],
        },
      ],
      isLoading: false,
      error: null,
    })
  })

  it('renders the search layout and toggles result filters', async () => {
    renderSearchPage()

    expect(screen.getByRole('heading', { name: /^search results for: "react"$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^all/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^posts/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^people/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /avery alumni/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /react study group/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^posts/i }))

    expect(screen.queryByRole('heading', { name: /avery alumni/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /react study group/i })).toBeInTheDocument()
  })
})
