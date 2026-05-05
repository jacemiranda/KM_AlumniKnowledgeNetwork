import { getSupabaseClient } from '../../lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────

export type SearchUserResult = {
  id: string
  name: string
  email: string
  bio: string | null
  profile_picture_url: string | null
  user_type: 'student' | 'alumni' | null
  field: { id: string; name: string } | null
  skills: Array<{ id: string; name: string }>
  authority_score: number
  post_count: number
}

export type SearchPostResult = {
  id: string
  title: string
  content: string
  post_type: 'information' | 'question'
  created_at: string
  author: { id: string; name: string; profile_picture_url: string | null; user_type: string | null }
  field: { id: string; name: string }
  post_tags: Array<{ tag: { id: string; name: string } }>
}

export type SearchFilters = {
  fieldId?: string
  userType?: 'student' | 'alumni'
  skillId?: string
  postType?: 'information' | 'question'
  tagId?: string
  limit?: number
}

// ── User Search ────────────────────────────────────────────────────────

export async function searchUsers(
  query: string,
  filters: SearchFilters = {},
): Promise<SearchUserResult[]> {
  const supabase = getSupabaseClient()
  const { fieldId, userType, limit = 20 } = filters
  const trimmed = query.trim()

  let dbQuery = supabase
    .from('profiles')
    .select(`
      id,
      name,
      email,
      bio,
      profile_picture_url,
      user_type,
      field:fields!profiles_field_id_fkey ( id, name ),
      profile_skills ( skill:skills ( id, name ) )
    `)
    .eq('status', 'active')
    .limit(limit)

  // Full-text search or ILIKE fallback
  if (trimmed) {
    const tsQuery = trimmed.split(/\s+/).map((w) => `${w}:*`).join(' & ')
    dbQuery = dbQuery.or(`search_vector.fts.${tsQuery},name.ilike.%${trimmed}%`)
  }

  if (fieldId) {
    dbQuery = dbQuery.eq('field_id', fieldId)
  }

  if (userType) {
    dbQuery = dbQuery.eq('user_type', userType)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await dbQuery as { data: any[] | null; error: any }

  if (error) {
    throw new Error(error.message)
  }

  // If filtering by skill, do it after the main query
  // since skills are in a junction table
  let results = (data ?? []).map(normalizeUserResult)

  if (filters.skillId) {
    results = results.filter((u) =>
      u.skills.some((s) => s.id === filters.skillId),
    )
  }

  // Fetch authority scores and post counts in bulk
  const profileIds = results.map((u) => u.id)
  const [scores, postCounts] = await Promise.all([
    fetchBulkAuthorityScores(profileIds),
    fetchBulkPostCounts(profileIds),
  ])

  return results.map((u) => ({
    ...u,
    authority_score: scores.get(u.id) ?? 0,
    post_count: postCounts.get(u.id) ?? 0,
  }))
}

// ── Post Search ────────────────────────────────────────────────────────

export async function searchPosts(
  query: string,
  filters: SearchFilters = {},
): Promise<SearchPostResult[]> {
  const supabase = getSupabaseClient()
  const { fieldId, postType, tagId, limit = 20 } = filters
  const trimmed = query.trim()

  let dbQuery = supabase
    .from('posts')
    .select(`
      id,
      title,
      content,
      post_type,
      created_at,
      author:profiles!posts_author_id_fkey ( id, name, profile_picture_url, user_type ),
      field:fields!posts_field_id_fkey ( id, name ),
      post_tags ( tag:tags ( id, name ) )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit)

  // Full-text search
  if (trimmed) {
    const tsQuery = trimmed.split(/\s+/).map((w) => `${w}:*`).join(' & ')
    dbQuery = dbQuery.or(`search_vector.fts.${tsQuery},title.ilike.%${trimmed}%`)
  }

  if (fieldId) {
    dbQuery = dbQuery.eq('field_id', fieldId)
  }

  if (postType) {
    dbQuery = dbQuery.eq('post_type', postType)
  }

  if (tagId) {
    const { data: postIds } = await supabase
      .from('post_tags')
      .select('post_id')
      .eq('tag_id', tagId)

    const ids = postIds?.map((row: { post_id: string }) => row.post_id) ?? []
    if (ids.length === 0) return []
    dbQuery = dbQuery.in('id', ids)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await dbQuery as { data: any[] | null; error: any }

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map(normalizePostResult)
}

// ── Combined Search ────────────────────────────────────────────────────

export async function searchAll(
  query: string,
  filters: SearchFilters = {},
): Promise<{ users: SearchUserResult[]; posts: SearchPostResult[] }> {
  const [users, posts] = await Promise.all([
    searchUsers(query, filters),
    searchPosts(query, filters),
  ])

  return { users, posts }
}

// ── Helpers ────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeUserResult(raw: any): SearchUserResult {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    bio: raw.bio,
    profile_picture_url: raw.profile_picture_url,
    user_type: raw.user_type,
    field: Array.isArray(raw.field) ? raw.field[0] ?? null : raw.field ?? null,
    skills: (raw.profile_skills ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ps: any) => (Array.isArray(ps.skill) ? ps.skill[0] : ps.skill),
    ).filter(Boolean),
    authority_score: 0,
    post_count: 0,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePostResult(raw: any): SearchPostResult {
  return {
    id: raw.id,
    title: raw.title,
    content: raw.content,
    post_type: raw.post_type,
    created_at: raw.created_at,
    author: Array.isArray(raw.author) ? raw.author[0] : raw.author,
    field: Array.isArray(raw.field) ? raw.field[0] : raw.field,
    post_tags: raw.post_tags ?? [],
  }
}

async function fetchBulkAuthorityScores(
  profileIds: string[],
): Promise<Map<string, number>> {
  const scores = new Map<string, number>()
  if (profileIds.length === 0) return scores

  const supabase = getSupabaseClient()

  // Sum votes from post_votes where the post's author is in profileIds
  const { data: postVotes, error: postError } = await supabase
    .from('post_votes')
    .select('value, post:posts(author_id)')
    .in('post.author_id', profileIds) as { data: Array<{ value: number; post: { author_id: string } | null }> | null; error: unknown }

  if (!postError) {
    for (const v of postVotes ?? []) {
      if (v.post) {
        const current = scores.get(v.post.author_id) ?? 0
        scores.set(v.post.author_id, current + v.value)
      }
    }
  }

  // Sum votes from comment_votes where the comment's author is in profileIds
  const { data: commentVotes, error: commentError } = await supabase
    .from('comment_votes')
    .select('value, comment:comments(author_id)')
    .in('comment.author_id', profileIds) as { data: Array<{ value: number; comment: { author_id: string } | null }> | null; error: unknown }

  if (!commentError) {
    for (const v of commentVotes ?? []) {
      if (v.comment) {
        const current = scores.get(v.comment.author_id) ?? 0
        scores.set(v.comment.author_id, current + v.value)
      }
    }
  }

  return scores
}

async function fetchBulkPostCounts(
  profileIds: string[],
): Promise<Map<string, number>> {
  const counts = new Map<string, number>()
  if (profileIds.length === 0) return counts

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('posts')
    .select('author_id')
    .in('author_id', profileIds)
    .eq('status', 'published')

  if (error) return counts

  for (const row of data ?? []) {
    const current = counts.get(row.author_id) ?? 0
    counts.set(row.author_id, current + 1)
  }

  return counts
}
