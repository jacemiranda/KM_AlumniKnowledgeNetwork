import { getSupabaseClient } from '../../lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────

export type VoteValue = 1 | -1

export type PostVoteRow = {
  id: string
  voter_id: string
  post_id: string
  value: VoteValue
  created_at: string
}

export type CommentVoteRow = {
  id: string
  voter_id: string
  comment_id: string
  value: VoteValue
  created_at: string
}

// ── Posts ────────────────────────────────────────────────────────────

export async function castPostVote(
  voterId: string,
  postId: string,
  value: VoteValue,
): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('post_votes')
    .upsert(
      { voter_id: voterId, post_id: postId, value },
      { onConflict: 'post_id,voter_id' },
    )
  if (error) throw new Error(error.message)
}

export async function removePostVote(voterId: string, postId: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('post_votes')
    .delete()
    .eq('voter_id', voterId)
    .eq('post_id', postId)
  if (error) throw new Error(error.message)
}

export async function fetchMyPostVote(
  voterId: string,
  postId: string,
): Promise<VoteValue | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('post_votes')
    .select('value')
    .eq('voter_id', voterId)
    .eq('post_id', postId)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data ? (data.value as VoteValue) : null
}

// ── Comments ─────────────────────────────────────────────────────────

export async function castCommentVote(
  voterId: string,
  commentId: string,
  value: VoteValue,
): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('comment_votes')
    .upsert(
      { voter_id: voterId, comment_id: commentId, value },
      { onConflict: 'comment_id,voter_id' },
    )
  if (error) throw new Error(error.message)
}

export async function removeCommentVote(voterId: string, commentId: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('comment_votes')
    .delete()
    .eq('voter_id', voterId)
    .eq('comment_id', commentId)
  if (error) throw new Error(error.message)
}

export async function fetchMyCommentVote(
  voterId: string,
  commentId: string,
): Promise<VoteValue | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('comment_votes')
    .select('value')
    .eq('voter_id', voterId)
    .eq('comment_id', commentId)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data ? (data.value as VoteValue) : null
}
