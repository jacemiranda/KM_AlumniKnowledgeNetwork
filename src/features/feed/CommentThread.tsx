import { useState } from 'react'
import { useAuth } from '../auth/use-auth'
import { useComments, useCreateComment, useDeleteComment } from './use-comments'
import { CommentThreadList, FeedSurface } from './feed-ui'

export function CommentThread({ postId }: { postId: string }) {
  const { session } = useAuth()
  const { data: comments, isLoading, error } = useComments(postId)
  const createComment = useCreateComment(postId)
  const deleteComment = useDeleteComment(postId)
  const [newComment, setNewComment] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = newComment.trim()
    if (!trimmed) return

    await createComment.mutateAsync(trimmed)
    setNewComment('')
  }

  function handleDelete(commentId: string) {
    void deleteComment.mutateAsync(commentId)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-white">
        Comments {comments ? `(${comments.length})` : ''}
      </h3>

      {/* Loading state */}
      {isLoading && (
        <p className="text-sm text-slate-400">Loading comments...</p>
      )}

      {/* Error state */}
      {error && (
        <p className="text-sm text-red-400">
          {error instanceof Error ? error.message : 'Failed to load comments.'}
        </p>
      )}

      {/* Empty state */}
      {!isLoading && !error && comments?.length === 0 && (
        <p className="text-sm text-slate-500">No comments yet. Be the first to respond.</p>
      )}

      {/* Comment list */}
      {(comments ?? []).map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={session?.user.id ?? null}
          onDelete={handleDelete}
        />
      ))}

      {/* New comment form */}
      {session && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/30 focus:outline-none"
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || createComment.isPending}
            className="rounded-full border border-emerald-300/40 bg-emerald-300/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-emerald-100 transition hover:bg-emerald-300/25 disabled:opacity-50"
          >
            {createComment.isPending ? '...' : 'Reply'}
          </button>
        </form>
      )}

      {createComment.error && (
        <p className="text-xs text-red-400">
          {createComment.error instanceof Error
            ? createComment.error.message
            : 'Failed to post comment.'}
        </p>
      )}
    </div>
  )
}
