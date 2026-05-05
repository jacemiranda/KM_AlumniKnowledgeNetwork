import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  fetchProfileMetrics,
} from './profile-service'

const mockFrom = vi.fn()

vi.mock('../../lib/supabase', () => ({
  getSupabaseClient: () => ({
    from: mockFrom,
  }),
}))

function queryResult<T>(data: T) {
  return Promise.resolve({ data, error: null })
}

describe('profile metrics service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
  })

  it('loads profile identity, contribution metrics, and authority score', async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === 'profiles') {
        return {
          select: () => ({
            eq: () => ({
              single: () =>
                queryResult({
                  id: 'profile-1',
                  email: 'alumni@example.com',
                  name: 'Avery Alumni',
                  bio: 'Frontend mentor',
                  profile_picture_url: null,
                  user_type: 'alumni',
                  created_at: '2026-01-01T00:00:00Z',
                  field: { id: 'field-1', name: 'Software Development' },
                  profile_skills: [
                    { skill: { id: 'skill-1', name: 'React' } },
                    { skill: { id: 'skill-2', name: 'Career Coaching' } },
                  ],
                }),
            }),
          }),
        }
      }

      if (table === 'post_votes') {
        return {
          select: () => ({
            eq: () => queryResult([
              { value: 1, post: { author_id: 'profile-1' } },
              { value: 1, post: { author_id: 'profile-1' } },
            ]),
          }),
        }
      }

      if (table === 'comment_votes') {
        return {
          select: () => ({
            eq: () => queryResult([
              { value: -1, comment: { author_id: 'profile-1' } },
            ]),
          }),
        }
      }

      if (table === 'posts') {
        return {
          select: () => ({
            eq: () => ({
              eq: () => queryResult([{ id: 'post-1' }, { id: 'post-2' }, { id: 'post-3' }]),
            }),
          }),
        }
      }

      if (table === 'comments') {
        return {
          select: () => ({
            eq: () => ({
              eq: () => queryResult([{ id: 'comment-1' }]),
            }),
          }),
        }
      }

      return {
        select: () => ({
          eq: () => queryResult([]),
        }),
      }
    })

    const metrics = await fetchProfileMetrics('profile-1')

    expect(metrics).toMatchObject({
      id: 'profile-1',
      name: 'Avery Alumni',
      email: 'alumni@example.com',
      authority_score: 1, // 1 + 1 - 1 = 1
      post_count: 3,
      posts_tagged_in: expect.any(Number),
      comment_count: 1,
      my_vote: null,
    })
    expect(metrics.skills.map((skill) => skill.name)).toEqual(['React', 'Career Coaching'])
  })
})
