import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../auth/use-auth'
import { CommentThread } from './CommentThread'
import { useDeletePost, usePost } from './use-posts'
import { useCastVote } from './use-votes'

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

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-liquid backdrop-blur-2xl">
        <p className="text-sm text-slate-400">Loading post...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-liquid backdrop-blur-2xl">
        <p className="text-sm text-red-400">
          {error instanceof Error ? error.message : 'Post not found.'}
        </p>
        <Link
          to="/"
          className="mt-3 inline-block text-sm text-emerald-200 transition hover:text-emerald-100"
        >
          ← Back to feed
        </Link>
      </div>
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

  function handleUpvote() {
    if (!canVote) return
    castVote.mutate({ targetId: post!.author_id, value: 1 })
  }

  function handleDownvote() {
    if (!canVote) return
    castVote.mutate({ targetId: post!.author_id, value: -1 })
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
      <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-liquid backdrop-blur-2xl">
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
                onClick={handleUpvote}
                disabled={castVote.isPending}
                className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold text-emerald-200 transition hover:bg-emerald-300/20 disabled:opacity-50"
              >
                👍 Upvote Author
              </button>
              <button
                type="button"
                onClick={handleDownvote}
                disabled={castVote.isPending}
                className="rounded-full border border-red-300/30 bg-red-300/10 px-3 py-1.5 text-xs font-bold text-red-200 transition hover:bg-red-300/20 disabled:opacity-50"
              >
                👎 Downvote Author
              </button>
            </>
          )}
          <span className="ml-auto text-xs text-slate-500">
            {post.comment_count ?? 0} comments
          </span>
        </footer>
      </article>

      {/* Comments thread */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-liquid backdrop-blur-2xl">
        <CommentThread postId={post.id} />
      </section>
    </div>
  )
}
