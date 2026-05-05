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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-white">
        Comments {comments ? `(${comments.length})` : ''}
        </h3>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Threaded replies
        </span>
      </div>

      {/* Loading state */}
      {isLoading && (
        <FeedSurface className="p-4">
          <p className="text-sm text-slate-400">Loading comments...</p>
        </FeedSurface>
      )}

      {/* Error state */}
      {error && (
        <FeedSurface className="border border-[#ffb4ab]/30 bg-[#131b2e]/70 p-4 shadow-[0_0_0_1px_rgba(255,180,171,0.12),0_0_30px_rgba(255,180,171,0.08)]">
          <p className="text-sm text-red-300">
            {error instanceof Error ? error.message : 'Failed to load comments.'}
          </p>
        </FeedSurface>
      )}

      {/* Empty state */}
      {!isLoading && !error && comments?.length === 0 && (
        <FeedSurface className="p-5">
          <p className="text-sm text-slate-500">No comments yet. Be the first to respond.</p>
        </FeedSurface>
      )}

      {/* Active comment composer */}
      {session && (
        <FeedSurface className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Add a reply
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[96px] w-full resize-none rounded-[24px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/30 focus:outline-none"
              maxLength={2000}
            />
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={!newComment.trim() || createComment.isPending}
                className="rounded-full border border-[#ffb95f] border-t-[#ffb95f] bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-emerald-50 transition hover:brightness-110 disabled:opacity-50"
              >
                {createComment.isPending ? 'Posting...' : 'Reply'}
              </button>
            </div>
          </form>
        </FeedSurface>
      )}

      {/* Comment list */}
      <CommentThreadList
        comments={comments ?? []}
        currentUserId={session?.user.id ?? null}
        onDelete={handleDelete}
      />

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
