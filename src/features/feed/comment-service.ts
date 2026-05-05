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
    role: string
  }
  authority_score: number
  upvote_count: number
  downvote_count: number
  my_vote: number
}

type CommentAuthor = CommentWithAuthor['author']

type RawCommentWithAuthor = CommentRow & {
  author: CommentAuthor | CommentAuthor[]
  comment_votes: { value: number; voter_id: string }[] | null
}

type QueryError = {
  message: string
}

// ── Error Handling ────────────────────────────────────────────────────

/**
 * Convert database constraint violations to user-friendly messages
 */
function getDbErrorMessage(error: QueryError): string {
  const msg = error.message || ''
  
  if (msg.includes('comments_content_check')) {
    return 'Please provide a comment'
  }
  if (msg.includes('post_id') && msg.includes('foreign key')) {
    return 'Post not found'
  }
  if (msg.includes('duplicate')) {
    return 'This comment already exists'
  }
  
  // Default fallback
  return 'Failed to create comment. Please try again.'
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
  author:profiles!comments_author_id_fkey ( id, name, profile_picture_url, user_type, role ),
  comment_votes ( value, voter_id )
`

export async function fetchComments(postId: string): Promise<CommentWithAuthor[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('comments')
    .select(COMMENT_SELECT)
    .eq('post_id', postId)
    .eq('status', 'published')
    .order('created_at', { ascending: true }) as {
      data: RawCommentWithAuthor[] | null
      error: QueryError | null
    }

  if (error) {
    throw new Error(error.message)
  }

  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  // Supabase returns FK joins as arrays — normalize
  return (data ?? []).map((row) => {
    const votes = row.comment_votes ?? []
    const authority_score = votes.reduce((sum, v) => sum + v.value, 0)
    const upvote_count = votes.filter((v) => v.value === 1).length
    const downvote_count = votes.filter((v) => v.value === -1).length
    const my_vote = currentUserId
      ? votes.find((v) => v.voter_id === currentUserId)?.value ?? 0
      : 0

    return {
      ...row,
      author: Array.isArray(row.author) ? row.author[0] : row.author,
      authority_score,
      upvote_count,
      downvote_count,
      my_vote,
    }
  })
}

export async function fetchUserComments(userId: string): Promise<CommentWithAuthor[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('comments')
    .select(COMMENT_SELECT)
    .eq('author_id', userId)
    .eq('status', 'published')
    .order('created_at', { ascending: false }) as {
      data: RawCommentWithAuthor[] | null
      error: QueryError | null
    }

  if (error) {
    throw new Error(error.message)
  }

  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  // Supabase returns FK joins as arrays — normalize
  return (data ?? []).map((row) => {
    const votes = row.comment_votes ?? []
    const authority_score = votes.reduce((sum, v) => sum + v.value, 0)
    const upvote_count = votes.filter((v) => v.value === 1).length
    const downvote_count = votes.filter((v) => v.value === -1).length
    const my_vote = currentUserId
      ? votes.find((v) => v.voter_id === currentUserId)?.value ?? 0
      : 0

    return {
      ...row,
      author: Array.isArray(row.author) ? row.author[0] : row.author,
      authority_score,
      upvote_count,
      downvote_count,
      my_vote,
    }
  })
}

export async function createComment(
  userId: string,
  postId: string,
  content: string,
): Promise<{ id: string }> {
  const supabase = getSupabaseClient()

  // Create the comment
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
    throw new Error(getDbErrorMessage(error))
  }

  // Get post author and commenter details for notification
  const commentId = (data as { id: string }).id

  try {
    // Fetch post author
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', postId)
      .single()

    if (postError) throw postError

    const postAuthorId = postData.author_id

    // Don't notify if commenter is the post author
    if (userId === postAuthorId) {
      return { id: commentId }
    }

    // Fetch commenter profile
    const { data: commenterData, error: commenterError } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .single()

    if (commenterError) throw commenterError

    // Create notification
    await supabase
      .from('notifications')
      .insert({
        user_id: postAuthorId,
        type: 'new_comment',
        actor_id: userId,
        related_post_id: postId,
        related_comment_id: commentId,
        data: {
          title: 'New comment on your post',
          message: content.substring(0, 100),
          icon_type: 'comment',
          action_url: `/post/${postId}#comment-${commentId}`,
          actor_name: commenterData.name,
        },
      })
  } catch (notifError) {
    // Log but don't fail the comment creation if notification fails
    console.error('Failed to create notification:', notifError)
  }

  return { id: commentId }
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
