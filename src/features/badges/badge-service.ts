import { getSupabaseClient } from '../../lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────

export type BadgeCategory =
  | 'onboarding'
  | 'contribution'
  | 'knowledge'
  | 'community'
  | 'milestone'
  | 'engagement'
  | 'fun'

export type BadgeDefinition = {
  id: string
  name: string
  slug: string
  description: string | null
  category: BadgeCategory
  icon_name: string
  threshold_type: string
  threshold_value: number
  is_active: boolean
}

export type UserBadge = {
  id: string
  profile_id: string
  badge_id: string
  awarded_at: string
  awarded_by: string | null
  badge: BadgeDefinition
}

// ── Queries ────────────────────────────────────────────────────────────

/**
 * Fetch all active badge definitions.
 */
export async function fetchBadges(): Promise<BadgeDefinition[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('badges')
    .select('id, name, slug, description, category, icon_name, threshold_type, threshold_value, is_active')
    .eq('is_active', true)
    .order('category')
    .order('threshold_value', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as BadgeDefinition[]
}

/**
 * Fetch badges earned by a specific user, joined with badge details.
 */
export async function fetchUserBadges(profileId: string): Promise<UserBadge[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('user_badges')
    .select(`
      id,
      profile_id,
      badge_id,
      awarded_at,
      awarded_by,
      badge:badges (
        id, name, slug, description, category, icon_name,
        threshold_type, threshold_value, is_active
      )
    `)
    .eq('profile_id', profileId)
    .order('awarded_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  // Normalize the badge join (Supabase may return array or object)
  return (data ?? []).map((row) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = row as any
    const badge = Array.isArray(raw.badge) ? raw.badge[0] : raw.badge
    return {
      id: raw.id,
      profile_id: raw.profile_id,
      badge_id: raw.badge_id,
      awarded_at: raw.awarded_at,
      awarded_by: raw.awarded_by,
      badge,
    } as UserBadge
  })
}

/**
 * Manually award a badge (Moderator/Admin).
 */
export async function awardBadge(
  profileId: string,
  badgeId: string,
  awardedBy: string,
): Promise<void> {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('user_badges')
    .upsert(
      { profile_id: profileId, badge_id: badgeId, awarded_by: awardedBy },
      { onConflict: 'profile_id,badge_id' },
    )

  if (error) {
    throw new Error(error.message)
  }

  // Create notification for badge earned
  try {
    // Fetch badge details
    const { data: badgeData, error: badgeError } = await supabase
      .from('badges')
      .select('name, description')
      .eq('id', badgeId)
      .single()

    if (badgeError) throw badgeError

    // Create notification
    await supabase
      .from('notifications')
      .insert({
        user_id: profileId,
        type: 'badge_earned',
        actor_id: awardedBy,
        data: {
          title: 'Badge earned!',
          message: badgeData.name,
          icon_type: 'badge',
          action_url: '/profile',
          actor_name: 'System',
        },
      })
  } catch (notifError) {
    // Log but don't fail the badge award if notification fails
    console.error('Failed to create notification:', notifError)
  }
}

/**
 * Check and auto-award eligible badges for a profile.
 * Calls the DB function that evaluates all Tier 1 thresholds.
 */
export async function checkAndAwardBadges(profileId: string): Promise<number> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .rpc('check_and_award_badges', { p_profile_id: profileId })

  if (error) {
    throw new Error(error.message)
  }

  return (data as number) ?? 0
}
