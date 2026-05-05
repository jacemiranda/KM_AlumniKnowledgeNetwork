import { getSupabaseClient } from '../../lib/supabase'

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
  my_vote: null
}

type QueryError = {
  message: string
}

export async function fetchProfileMetrics(
  profileId: string,
  _viewerId?: string | null,
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

  const [authorityScore, postCount, taggedCount, commentCount] = await Promise.all([
    fetchAuthorityScore(profileId),
    countRows('posts', 'author_id', profileId),
    countRows('posts', 'tagged_alumni_id', profileId),
    countRows('comments', 'author_id', profileId),
  ])

  return {
    ...normalizeProfile(data),
    authority_score: authorityScore,
    post_count: postCount,
    posts_tagged_in: taggedCount,
    comment_count: commentCount,
    my_vote: null,
  }
}

async function fetchAuthorityScore(profileId: string): Promise<number> {
  const supabase = getSupabaseClient()
  
  // Sum votes from post_votes where the post's author is the profile
  const { data: postVotes } = await supabase
    .from('post_votes')
    .select('value, post:posts(author_id)')
    .eq('post.author_id', profileId) as { data: Array<{ value: number; post: { author_id: string } | null }> | null }

  let postVotesSum = 0
  for (const v of postVotes ?? []) {
    if (v.post) postVotesSum += v.value
  }

  // Sum votes from comment_votes where the comment's author is the profile
  const { data: commentVotes } = await supabase
    .from('comment_votes')
    .select('value, comment:comments(author_id)')
    .eq('comment.author_id', profileId) as { data: Array<{ value: number; comment: { author_id: string } | null }> | null }

  let commentVotesSum = 0
  for (const v of commentVotes ?? []) {
    if (v.comment) commentVotesSum += v.value
  }

  return postVotesSum + commentVotesSum
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
