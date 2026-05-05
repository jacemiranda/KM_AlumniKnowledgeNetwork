import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/use-auth'
import { useComments, useCreateComment, useDeleteComment } from './use-comments'
import { useCastCommentVote, useRemoveCommentVote } from './use-votes'
import type { CommentWithAuthor } from './comment-service'
import type { VoteValue } from './vote-service'
import { RoleBadge } from '../../components/RoleBadge'

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function VoteIcon({ direction }: { direction: 'up' | 'down' }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      {direction === 'up' ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75 12 8.25l7.5 7.5" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      )}
    </svg>
  )
}

function CommentItem({
  comment,
  currentUserId,
  onDelete,
}: {
  comment: CommentWithAuthor
  currentUserId: string | null
  onDelete: (id: string) => void
}) {
  const author = comment.author
  const isOwner = currentUserId === comment.author_id

  const castVote = useCastCommentVote()
  const removeVote = useRemoveCommentVote()
  const votePending = castVote.isPending || removeVote.isPending

  function handleVote(value: VoteValue) {
    if (comment.my_vote === value) {
      removeVote.mutate(comment.id)
      return
    }
    castVote.mutate({ commentId: comment.id, value })
  }

  return (
    <div className="flex gap-3 rounded-2xl bg-ink-900/40 p-3">
      <Link to={`/profile/${author?.id}`} className="shrink-0 rounded-full h-8 w-8 transition hover:ring-2 hover:ring-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-300/50">
        {author?.profile_picture_url ? (
          <img
            src={author.profile_picture_url}
            alt={author.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-300/20 text-xs font-bold text-emerald-200">
            {author?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
        )}
      </Link>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${author?.id}`} className={`text-sm font-bold transition hover:underline focus:outline-none ${
            author?.role === 'admin' ? 'text-amber-200 hover:text-amber-100 focus:text-amber-100' :
            author?.role === 'moderator' ? 'text-cyan-200 hover:text-cyan-100 focus:text-cyan-100' :
            'text-white hover:text-emerald-300 focus:text-emerald-300'
          }`}>
            {author?.name ?? 'Unknown'}
          </Link>
          {author?.role && <RoleBadge role={author.role} />}
          <span className="text-xs text-slate-500">{timeAgo(comment.created_at)}</span>
        </div>
        <p className="mt-1 text-sm text-slate-300">{comment.content}</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleVote(1)}
              disabled={votePending}
              aria-pressed={comment.my_vote === 1}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-bold text-emerald-200 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                comment.my_vote === 1
                  ? 'border-emerald-300/60 bg-emerald-300/20'
                  : 'border-emerald-300/30 bg-emerald-300/10 hover:bg-emerald-300/20'
              }`}
            >
              <VoteIcon direction="up" />
              <span className="ml-0.5">{comment.upvote_count}</span>
            </button>
            <button
              onClick={() => handleVote(-1)}
              disabled={votePending}
              aria-pressed={comment.my_vote === -1}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-bold text-red-200 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                comment.my_vote === -1
                  ? 'border-red-300/60 bg-red-300/20'
                  : 'border-red-300/30 bg-red-300/10 hover:bg-red-300/20'
              }`}
            >
              <VoteIcon direction="down" />
              <span className="ml-0.5">{comment.downvote_count}</span>
            </button>
          </div>
          {isOwner && (
            <button
              type="button"
              onClick={() => onDelete(comment.id)}
              className="text-xs text-red-400 transition hover:text-red-300"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

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
