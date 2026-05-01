import { getSupabaseClient } from '../../lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────

export type VoteValue = 1 | -1

export type VoteRow = {
  id: string
  voter_id: string
  target_id: string
  value: VoteValue
  created_at: string
}

// ── Queries ────────────────────────────────────────────────────────────

/**
 * Cast or update a vote on another user.
 * Uses upsert on the (voter_id, target_id) unique constraint.
 */
export async function castVote(
  voterId: string,
  targetId: string,
  value: VoteValue,
): Promise<void> {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('votes')
    .upsert(
      { voter_id: voterId, target_id: targetId, value },
      { onConflict: 'voter_id,target_id' },
    )

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Remove own vote on a target user.
 */
export async function removeVote(voterId: string, targetId: string): Promise<void> {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('votes')
    .delete()
    .eq('voter_id', voterId)
    .eq('target_id', targetId)

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Get the authority score (net votes) for a single profile.
 */
export async function fetchAuthorityScore(profileId: string): Promise<number> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('votes')
    .select('value')
    .eq('target_id', profileId)

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).reduce((sum: number, row: { value: number }) => sum + row.value, 0)
}

/**
 * Get the current user's vote on a specific target user, if any.
 */
export async function fetchMyVote(
  voterId: string,
  targetId: string,
): Promise<VoteValue | null> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('votes')
    .select('value')
    .eq('voter_id', voterId)
    .eq('target_id', targetId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data ? (data.value as VoteValue) : null
}
