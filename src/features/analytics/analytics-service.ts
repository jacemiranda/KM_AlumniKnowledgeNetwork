import { getSupabaseClient } from '../../lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────

export type PlatformAnalytics = {
  total_students: number
  total_alumni: number
  total_posts: number
  total_comments: number
  recently_active: number
  total_badges_awarded: number
}

// ── Queries ────────────────────────────────────────────────────────────

/**
 * Fetch platform-wide analytics.
 * Uses the platform_analytics() DB function for efficiency.
 */
export async function fetchPlatformAnalytics(): Promise<PlatformAnalytics> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.rpc('platform_analytics')

  if (error) {
    throw new Error(error.message)
  }

  const result = data as PlatformAnalytics | null

  return result ?? {
    total_students: 0,
    total_alumni: 0,
    total_posts: 0,
    total_comments: 0,
    recently_active: 0,
    total_badges_awarded: 0,
  }
}
