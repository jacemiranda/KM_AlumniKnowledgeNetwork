import { getSupabaseClient } from '../../lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────

export type CommentRow = {
  id: string
  post_id: string
  author_id: string
  content: string
  status: 'published' | 'hidden' | 'removed'
  created_at: string
  updated_at: string
}

export type CommentWithAuthor = CommentRow & {
  author: {
    id: string
    name: string
    profile_picture_url: string | null
    user_type: string | null
  }
}

// ── Queries ────────────────────────────────────────────────────────────

const COMMENT_SELECT = `
  id,
  post_id,
  author_id,
  content,
  status,
  created_at,
  updated_at,
  author:profiles!comments_author_id_fkey ( id, name, profile_picture_url, user_type )
`

export async function fetchComments(postId: string): Promise<CommentWithAuthor[]> {
  const supabase = getSupabaseClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await supabase
    .from('comments')
    .select(COMMENT_SELECT)
    .eq('post_id', postId)
    .eq('status', 'published')
    .order('created_at', { ascending: true }) as { data: any[] | null; error: any }

  if (error) {
    throw new Error(error.message)
  }

  // Supabase returns FK joins as arrays — normalize
  return (data ?? []).map((row) => ({
    ...row,
    author: Array.isArray(row.author) ? row.author[0] : row.author,
  })) as CommentWithAuthor[]
}

export async function createComment(
  userId: string,
  postId: string,
  content: string,
): Promise<{ id: string }> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      author_id: userId,
      content,
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as { id: string }
}

export async function deleteComment(commentId: string): Promise<void> {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('comments')
    .update({ status: 'removed' as const })
    .eq('id', commentId)

  if (error) {
    throw new Error(error.message)
  }
}
