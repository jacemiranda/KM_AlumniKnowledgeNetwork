import { getSupabaseClient } from '../../lib/supabase'
import type { VoteValue } from '../feed/vote-service'

export type ProfileVoteRow = {
  target_id: string
  value: number
}

export type ProfileMetrics = {
  id: string
  email: string
  name: string
  bio: string | null
  profile_picture_url: string | null
  user_type: 'student' | 'alumni' | null
  created_at: string
  field: { id: string; name: string } | null
  skills: Array<{ id: string; name: string }>
  authority_score: number
  post_count: number
  posts_tagged_in: number
  comment_count: number
  my_vote: VoteValue | null
}

type QueryError = {
  message: string
}

export function computeAuthorityScore(votes: ProfileVoteRow[]): number {
  return votes.reduce((score, vote) => score + vote.value, 0)
}

export async function fetchProfileMetrics(
  profileId: string,
  viewerId?: string | null,
): Promise<ProfileMetrics> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      name,
      bio,
      profile_picture_url,
      user_type,
      created_at,
      field:fields!profiles_field_id_fkey ( id, name ),
      profile_skills ( skill:skills ( id, name ) )
    `)
    .eq('id', profileId)
    .single() as { data: unknown; error: QueryError | null }

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error('Profile not found.')
  }

  const [votes, postCount, taggedCount, commentCount, myVote] = await Promise.all([
    fetchVotesForProfile(profileId),
    countRows('posts', 'author_id', profileId),
    countRows('posts', 'tagged_alumni_id', profileId),
    countRows('comments', 'author_id', profileId),
    viewerId && viewerId !== profileId ? fetchViewerVote(viewerId, profileId) : Promise.resolve(null),
  ])

  return {
    ...normalizeProfile(data),
    authority_score: computeAuthorityScore(votes),
    post_count: postCount,
    posts_tagged_in: taggedCount,
    comment_count: commentCount,
    my_vote: myVote,
  }
}

async function fetchVotesForProfile(profileId: string): Promise<ProfileVoteRow[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('votes')
    .select('target_id, value')
    .eq('target_id', profileId) as { data: ProfileVoteRow[] | null; error: QueryError | null }

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

async function fetchViewerVote(
  viewerId: string,
  profileId: string,
): Promise<VoteValue | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('votes')
    .select('value')
    .eq('voter_id', viewerId)
    .eq('target_id', profileId)
    .maybeSingle() as { data: { value: VoteValue } | null; error: QueryError | null }

  if (error) {
    throw new Error(error.message)
  }

  return data?.value ?? null
}

async function countRows(
  tableName: 'posts' | 'comments',
  column: 'author_id' | 'tagged_alumni_id',
  profileId: string,
): Promise<number> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from(tableName)
    .select('id')
    .eq(column, profileId)
    .eq('status', 'published') as { data: Array<{ id: string }> | null; error: QueryError | null }

  if (error) {
    throw new Error(error.message)
  }

  return data?.length ?? 0
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProfile(raw: any): Omit<
  ProfileMetrics,
  'authority_score' | 'post_count' | 'posts_tagged_in' | 'comment_count' | 'my_vote'
> {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    bio: raw.bio,
    profile_picture_url: raw.profile_picture_url,
    user_type: raw.user_type,
    created_at: raw.created_at,
    field: Array.isArray(raw.field) ? raw.field[0] ?? null : raw.field ?? null,
    skills: (raw.profile_skills ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((profileSkill: any) =>
        Array.isArray(profileSkill.skill) ? profileSkill.skill[0] : profileSkill.skill,
      )
      .filter(Boolean),
  }
}
