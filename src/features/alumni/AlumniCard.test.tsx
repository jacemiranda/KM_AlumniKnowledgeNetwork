import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AlumniCard } from './AlumniCard'

const mockUseUserBadges = vi.fn()

vi.mock('../badges/use-badges', () => ({
  useUserBadges: (userId: string) => mockUseUserBadges(userId),
}))

function renderAlumniCard() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={
            <AlumniCard
              alumni={{
                id: 'alumni-1',
                name: 'Avery Alumni',
                profile_picture_url: null,
                bio: 'Frontend mentor',
                field: { id: 'field-1', name: 'Software Development' },
                skills: [
                  { id: 'skill-1', name: 'React' },
                  { id: 'skill-2', name: 'UX Writing' },
                ],
                authority_score: 5,
                post_count: 18,
              }}
            />
          }
        />
        <Route path="/search" element={<div>Search page</div>} />
        <Route path="/profile/:userId" element={<div>Profile page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('AlumniCard', () => {
  beforeEach(() => {
    mockUseUserBadges.mockReturnValue({ data: [], isLoading: false })
  })

  it('renders card content and navigates to profile on click', async () => {
    renderAlumniCard()

    expect(screen.getByRole('heading', { name: /avery alumni/i })).toBeInTheDocument()
    expect(screen.getByText('Frontend mentor')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: /avery alumni/i }))

    expect(screen.getByText('Profile page')).toBeInTheDocument()
  })
})
