import { getSupabaseClient } from '../../lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────

export type LeaderboardEntry = {
  id: string
  name: string
  bio: string | null
  profile_picture_url: string | null
  user_type: 'student' | 'alumni' | null
  field: { id: string; name: string } | null
  authority_score: number
  post_count: number
  comment_count: number
  badge_count: number
  rank: number
}

export type LeaderboardFilters = {
  fieldId?: string
  page?: number
  limit?: number
}

// ── Queries ────────────────────────────────────────────────────────────

export async function fetchLeaderboard(
  filters: LeaderboardFilters = {},
): Promise<{ entries: LeaderboardEntry[]; total: number }> {
  const supabase = getSupabaseClient()
  const { fieldId, page = 1, limit = 20 } = filters

  // Step 1: Fetch active profiles with field join
  let query = supabase
    .from('profiles')
    .select(`
      id,
      name,
      bio,
      profile_picture_url,
      user_type,
      field:fields!profiles_field_id_fkey ( id, name )
    `, { count: 'exact' })
    .eq('status', 'active')
    .not('user_type', 'is', null)

  if (fieldId) {
    query = query.eq('field_id', fieldId)
  }

  query = query.order('name', { ascending: true })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error, count } = await query as { data: any[] | null; error: any; count: number | null }

  if (error) {
    throw new Error(error.message)
  }

  const profiles = data ?? []
  const profileIds = profiles.map((p) => p.id as string)

  if (profileIds.length === 0) {
    return { entries: [], total: 0 }
  }

  // Step 2: Bulk fetch metrics
  const [scores, postCounts, commentCounts, badgeCounts] = await Promise.all([
    fetchBulkScores(profileIds),
    fetchBulkCounts('posts', 'author_id', profileIds),
    fetchBulkCounts('comments', 'author_id', profileIds),
    fetchBulkBadgeCounts(profileIds),
  ])

  // Step 3: Build entries with composite score and sort
  let entries: LeaderboardEntry[] = profiles.map((p) => {
    const authority = scores.get(p.id) ?? 0
    return {
      id: p.id,
      name: p.name,
      bio: p.bio,
      profile_picture_url: p.profile_picture_url,
      user_type: p.user_type,
      field: Array.isArray(p.field) ? p.field[0] ?? null : p.field ?? null,
      authority_score: authority,
      post_count: postCounts.get(p.id) ?? 0,
      comment_count: commentCounts.get(p.id) ?? 0,
      badge_count: badgeCounts.get(p.id) ?? 0,
      rank: 0,
    }
  })

  // Sort by authority_score desc, then post_count desc, then comment_count desc
  entries.sort((a, b) => {
    if (b.authority_score !== a.authority_score) return b.authority_score - a.authority_score
    if (b.post_count !== a.post_count) return b.post_count - a.post_count
    return b.comment_count - a.comment_count
  })

  // Assign ranks (1-indexed, with ties)
  let currentRank = 1
  for (let i = 0; i < entries.length; i++) {
    if (
      i > 0 &&
      entries[i].authority_score === entries[i - 1].authority_score &&
      entries[i].post_count === entries[i - 1].post_count &&
      entries[i].comment_count === entries[i - 1].comment_count
    ) {
      entries[i].rank = entries[i - 1].rank
    } else {
      entries[i].rank = currentRank
    }
    currentRank++
  }

  // Step 4: Paginate
  const total = entries.length
  const start = (page - 1) * limit
  entries = entries.slice(start, start + limit)

  return { entries, total: count ?? total }
}

// ── Helpers ────────────────────────────────────────────────────────────

async function fetchBulkScores(ids: string[]): Promise<Map<string, number>> {
  const m = new Map<string, number>()
  if (ids.length === 0) return m
  const supabase = getSupabaseClient()
  const { data } = await supabase.from('votes').select('target_id, value').in('target_id', ids)
  for (const r of data ?? []) {
    m.set(r.target_id, (m.get(r.target_id) ?? 0) + r.value)
  }
  return m
}

async function fetchBulkCounts(
  tableName: 'posts' | 'comments',
  column: string,
  ids: string[],
): Promise<Map<string, number>> {
  const m = new Map<string, number>()
  if (ids.length === 0) return m
  const supabase = getSupabaseClient()
  const { data } = await supabase
    .from(tableName)
    .select(column)
    .in(column, ids)
    .eq('status', 'published')
  for (const r of data ?? []) {
    const id = (r as unknown as Record<string, string>)[column]
    m.set(id, (m.get(id) ?? 0) + 1)
  }
  return m
}

async function fetchBulkBadgeCounts(ids: string[]): Promise<Map<string, number>> {
  const m = new Map<string, number>()
  if (ids.length === 0) return m
  const supabase = getSupabaseClient()
  const { data } = await supabase
    .from('user_badges')
    .select('profile_id')
    .in('profile_id', ids)
  for (const r of data ?? []) {
    m.set(r.profile_id, (m.get(r.profile_id) ?? 0) + 1)
  }
  return m
}
