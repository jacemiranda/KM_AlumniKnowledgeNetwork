import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../auth/use-auth'
import { CommentThread } from './CommentThread'
import { useDeletePost, usePost } from './use-posts'
import { useCastVote, useMyVote, useRemoveVote } from './use-votes'
import type { VoteValue } from './vote-service'
import { FeedSurface } from './feed-ui'

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

export function PostDetail() {
  const { postId } = useParams<{ postId: string }>()
  const { session } = useAuth()
  const { data: post, isLoading, error } = usePost(postId ?? '')
  const deletePost = useDeletePost()
  const castVote = useCastVote()
  const removeVote = useRemoveVote()
  const myVote = useMyVote(post?.author_id ?? '')

  if (isLoading) {
    return (
      <FeedSurface className="p-8">
        <p className="text-sm text-slate-400">Loading post...</p>
      </FeedSurface>
    )
  }

  if (error || !post) {
    return (
      <FeedSurface className="p-8">
        <p className="text-sm text-red-400">
          {error instanceof Error ? error.message : 'Post not found.'}
        </p>
        <Link
          to="/"
          className="mt-3 inline-block text-sm text-emerald-200 transition hover:text-emerald-100"
        >
          ← Back to feed
        </Link>
      </FeedSurface>
    )
  }

  const author = post.author
  const field = post.field
  const tags = post.post_tags?.map((pt) => pt.tag) ?? []
  const isOwner = session?.user.id === post.author_id
  const canVote = session && session.user.id !== post.author_id

  async function handleDelete() {
    if (!window.confirm('Remove this post?')) return
    await deletePost.mutateAsync(post!.id)
    window.location.href = '/'
  }

  function handleVote(value: VoteValue) {
    if (!canVote) return
    if (myVote.data === value) {
      removeVote.mutate(post!.author_id)
      return
    }
    castVote.mutate({ targetId: post!.author_id, value })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Back link */}
      <Link
        to="/"
        className="inline-block text-sm text-slate-400 transition hover:text-emerald-200"
      >
        ← Back to feed
      </Link>

      {/* Post card */}
      <article className="rounded-[32px] border border-white/10 bg-[#131b2e]/60 p-5 shadow-liquid backdrop-blur-2xl md:p-6">
        {/* Author */}
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {author?.profile_picture_url ? (
              <img
                src={author.profile_picture_url}
                alt={author.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-300/20 text-base font-bold text-emerald-200">
                {author?.name?.charAt(0)?.toUpperCase() ?? '?'}
              </div>
            )}
            <div>
              <p className="text-base font-bold text-white">{author?.name ?? 'Unknown'}</p>
              <p className="text-xs text-slate-400">
                {author?.user_type
                  ? author.user_type.charAt(0).toUpperCase() + author.user_type.slice(1)
                  : ''}{' '}
                {field?.name ? `· ${field.name}` : ''} · {timeAgo(post.created_at)}
              </p>
            </div>
          </div>

          {isOwner && (
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-xs font-bold text-red-300 transition hover:bg-red-400/20"
            >
              Delete
            </button>
          )}
        </header>

        {/* Post type badge */}
        {post.post_type && (
          <span
            className={`mb-3 inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
              post.post_type === 'question'
                ? 'border-amber-300/40 bg-amber-300/15 text-amber-100'
                : 'border-emerald-300/40 bg-emerald-300/15 text-emerald-100'
            }`}
          >
            {post.post_type}
          </span>
        )}

        {/* Title */}
        <h1 className="text-2xl font-black tracking-tight text-white">{post.title}</h1>

        {/* Content */}
        <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
          {post.content}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-white/10 bg-ink-900/50 px-3 py-1 text-xs text-slate-300"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Tagged alumni */}
        {post.tagged_alumni && (
          <div className="mt-3">
            <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200">
              Tagged: @{post.tagged_alumni.name}
            </span>
          </div>
        )}

        {/* Vote controls */}
        <footer className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
          {canVote && (
            <>
              <button
                type="button"
                onClick={() => handleVote(1)}
                disabled={castVote.isPending || removeVote.isPending}
                aria-pressed={myVote.data === 1}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold text-emerald-200 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  myVote.data === 1
                    ? 'border-emerald-300/60 bg-emerald-300/20'
                    : 'border-emerald-300/30 bg-emerald-300/10 hover:bg-emerald-300/20'
                }`}
              >
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75 12 8.25l7.5 7.5" />
                </svg>
                Upvote Author
              </button>
              <button
                type="button"
                onClick={() => handleVote(-1)}
                disabled={castVote.isPending || removeVote.isPending}
                aria-pressed={myVote.data === -1}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold text-red-200 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  myVote.data === -1
                    ? 'border-red-300/60 bg-red-300/20'
                    : 'border-red-300/30 bg-red-300/10 hover:bg-red-300/20'
                }`}
              >
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
                Downvote Author
              </button>
            </>
          )}
          <span className="ml-auto text-xs text-slate-500">
            {post.comment_count ?? 0} comments
          </span>
        </footer>
      </article>

      {/* Comments thread */}
      <FeedSurface className="p-5 md:p-6">
        <CommentThread postId={post.id} />
      </FeedSurface>
    </div>
  )
}
