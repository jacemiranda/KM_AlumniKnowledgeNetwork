import { getSupabaseClient } from '../../lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────

export type AlumniListItem = {
  id: string
  name: string
  bio: string | null
  profile_picture_url: string | null
  field: { id: string; name: string } | null
  skills: Array<{ id: string; name: string }>
  authority_score: number
  post_count: number
}

export type AlumniProfile = AlumniListItem & {
  email: string
  posts_tagged_in: number
  comment_count: number
  created_at: string
}

export type AlumniFilters = {
  fieldId?: string
  skillId?: string
  sortBy?: 'authority' | 'name' | 'recent'
  page?: number
  limit?: number
}

// ── Queries ────────────────────────────────────────────────────────────

export async function fetchAlumni(
  filters: AlumniFilters = {},
): Promise<{ alumni: AlumniListItem[]; total: number }> {
  const supabase = getSupabaseClient()
  const { fieldId, page = 1, limit = 20 } = filters

  let query = supabase
    .from('profiles')
    .select(`
      id,
      name,
      bio,
      profile_picture_url,
      field:fields!profiles_field_id_fkey ( id, name ),
      profile_skills ( skill:skills ( id, name ) )
    `, { count: 'exact' })
    .eq('user_type', 'alumni')
    .eq('status', 'active')
    .range((page - 1) * limit, page * limit - 1)

  if (fieldId) {
    query = query.eq('field_id', fieldId)
  }

  // Default sort by name — authority sort is done client-side after we compute scores
  query = query.order('name', { ascending: true })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error, count } = await query as { data: any[] | null; error: any; count: number | null }

  if (error) {
    throw new Error(error.message)
  }

  let results = (data ?? []).map(normalizeAlumniItem)

  // Filter by skill (junction table — post-query)
  if (filters.skillId) {
    results = results.filter((a) =>
      a.skills.some((s) => s.id === filters.skillId),
    )
  }

  // Fetch authority scores and post counts in bulk
  const profileIds = results.map((a) => a.id)
  const [scores, postCounts] = await Promise.all([
    fetchBulkScores(profileIds),
    fetchBulkPosts(profileIds),
  ])

  results = results.map((a) => ({
    ...a,
    authority_score: scores.get(a.id) ?? 0,
    post_count: postCounts.get(a.id) ?? 0,
  }))

  // Sort by the requested field
  if (filters.sortBy === 'authority') {
    results.sort((a, b) => b.authority_score - a.authority_score)
  } else if (filters.sortBy === 'recent') {
    // already sorted by DB if needed, but we could reverse
    results.reverse()
  }
  // Default: alphabetical (already sorted by name from the DB query)

  return { alumni: results, total: count ?? 0 }
}

export async function fetchAlumniProfile(
  profileId: string,
): Promise<AlumniProfile> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      name,
      email,
      bio,
      profile_picture_url,
      created_at,
      field:fields!profiles_field_id_fkey ( id, name ),
      profile_skills ( skill:skills ( id, name ) )
    `)
    .eq('id', profileId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const base = normalizeAlumniItem(data)

  // Compute metrics
  const [scores, postCounts, taggedCounts, commentCounts] = await Promise.all([
    fetchBulkScores([profileId]),
    fetchBulkPosts([profileId]),
    fetchBulkTaggedIn([profileId]),
    fetchBulkComments([profileId]),
  ])

  return {
    ...base,
    email: data.email,
    created_at: data.created_at,
    authority_score: scores.get(profileId) ?? 0,
    post_count: postCounts.get(profileId) ?? 0,
    posts_tagged_in: taggedCounts.get(profileId) ?? 0,
    comment_count: commentCounts.get(profileId) ?? 0,
  }
}

// ── Helpers ────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeAlumniItem(raw: any): AlumniListItem {
  return {
    id: raw.id,
    name: raw.name,
    bio: raw.bio,
    profile_picture_url: raw.profile_picture_url,
    field: Array.isArray(raw.field) ? raw.field[0] ?? null : raw.field ?? null,
    skills: (raw.profile_skills ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((ps: any) => (Array.isArray(ps.skill) ? ps.skill[0] : ps.skill))
      .filter(Boolean),
    authority_score: 0,
    post_count: 0,
  }
}

async function fetchBulkScores(ids: string[]): Promise<Map<string, number>> {
  const m = new Map<string, number>()
  if (ids.length === 0) return m
  const supabase = getSupabaseClient()
  const { data } = await supabase.from('votes').select('target_id, value').in('target_id', ids)
  for (const r of data ?? []) { m.set(r.target_id, (m.get(r.target_id) ?? 0) + r.value) }
  return m
}

async function fetchBulkPosts(ids: string[]): Promise<Map<string, number>> {
  const m = new Map<string, number>()
  if (ids.length === 0) return m
  const supabase = getSupabaseClient()
  const { data } = await supabase.from('posts').select('author_id').in('author_id', ids).eq('status', 'published')
  for (const r of data ?? []) { m.set(r.author_id, (m.get(r.author_id) ?? 0) + 1) }
  return m
}

async function fetchBulkTaggedIn(ids: string[]): Promise<Map<string, number>> {
  const m = new Map<string, number>()
  if (ids.length === 0) return m
  const supabase = getSupabaseClient()
  const { data } = await supabase.from('posts').select('tagged_alumni_id').in('tagged_alumni_id', ids).eq('status', 'published')
  for (const r of data ?? []) {
    if (r.tagged_alumni_id) {
      m.set(r.tagged_alumni_id, (m.get(r.tagged_alumni_id) ?? 0) + 1)
    }
  }
  return m
}

async function fetchBulkComments(ids: string[]): Promise<Map<string, number>> {
  const m = new Map<string, number>()
  if (ids.length === 0) return m
  const supabase = getSupabaseClient()
  const { data } = await supabase.from('comments').select('author_id').in('author_id', ids).eq('status', 'published')
  for (const r of data ?? []) { m.set(r.author_id, (m.get(r.author_id) ?? 0) + 1) }
  return m
}
