import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  computeAuthorityScore,
  fetchProfileMetrics,
  type ProfileVoteRow,
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

  it('sums vote values into an authority score', () => {
    const votes: ProfileVoteRow[] = [
      { target_id: 'profile-1', value: 1 },
      { target_id: 'profile-1', value: 1 },
      { target_id: 'profile-1', value: -1 },
    ]

    expect(computeAuthorityScore(votes)).toBe(1)
  })

  it('loads profile identity, contribution metrics, and current viewer vote', async () => {
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

      if (table === 'votes') {
        return {
          select: () => ({
            eq: (column: string) => {
              if (column === 'target_id') {
                return queryResult([
                  { target_id: 'profile-1', value: 1 },
                  { target_id: 'profile-1', value: -1 },
                  { target_id: 'profile-1', value: 1 },
                ])
              }

              return {
                eq: () => ({
                  maybeSingle: () => queryResult({ value: -1 }),
                }),
              }
            },
          }),
        }
      }

      if (table === 'posts') {
        return {
          select: () => ({
            eq: (column: string) => {
              if (column === 'author_id') {
                return {
                  eq: () => queryResult([{ id: 'post-1' }, { id: 'post-2' }]),
                }
              }

              return {
                eq: () => queryResult([{ id: 'post-3' }]),
              }
            },
          }),
        }
      }

      if (table === 'comments') {
        return {
          select: () => ({
            eq: () => ({
              eq: () => queryResult([{ id: 'comment-1' }, { id: 'comment-2' }]),
            }),
          }),
        }
      }

      throw new Error(`Unexpected table ${table}`)
    })

    const profile = await fetchProfileMetrics('profile-1', 'viewer-1')

    expect(profile).toMatchObject({
      id: 'profile-1',
      name: 'Avery Alumni',
      user_type: 'alumni',
      authority_score: 1,
      post_count: 2,
      posts_tagged_in: 1,
      comment_count: 2,
      my_vote: -1,
    })
    expect(profile.skills.map((skill) => skill.name)).toEqual(['React', 'Career Coaching'])
  })
})
