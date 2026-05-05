import { Link } from 'react-router-dom'
import { RoleBadge } from '../../components/RoleBadge'
import type { PostWithRelations } from './post-service'
import { useCastPostVote, useRemovePostVote } from './use-votes'
import type { VoteValue } from './vote-service'

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

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

export function PostCard({ post }: { post: PostWithRelations }) {
  const author = post.author
  const field = post.field
  const tags = post.post_tags?.map((pt) => pt.tag) ?? []
  const commentCount = post.comment_count ?? 0

  const castPostVote = useCastPostVote()
  const removePostVote = useRemovePostVote()
  const votePending = castPostVote.isPending || removePostVote.isPending

  function handleVote(e: React.MouseEvent, value: VoteValue) {
    e.preventDefault()
    e.stopPropagation()
    if (post.my_vote === value) {
      removePostVote.mutate(post.id)
      return
    }
    castPostVote.mutate({ postId: post.id, value })
  }

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-liquid backdrop-blur-2xl transition hover:-translate-y-0.5">
      {/* Header */}
      <header className="mb-3 flex items-start justify-between gap-3">
        <Link to={`/profile/${author?.id}`} className="group flex items-center gap-3">
          {author?.profile_picture_url ? (
            <img
              src={author.profile_picture_url}
              alt={author.name}
              className="h-10 w-10 rounded-full object-cover transition group-hover:ring-2 group-hover:ring-emerald-300/50"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-300/20 text-sm font-bold text-emerald-200 transition group-hover:ring-2 group-hover:ring-emerald-300/50">
              {author?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className={`text-sm font-bold transition hover:underline ${
                author?.role === 'admin' ? 'text-amber-200 hover:text-amber-100' :
                author?.role === 'moderator' ? 'text-cyan-200 hover:text-cyan-100' :
                'text-white hover:text-emerald-300'
              }`}>
                {author?.name ?? 'Unknown'}
              </p>
              {author?.role && <RoleBadge role={author.role} />}
            </div>
            <p className="text-xs text-slate-400">
              {author?.user_type ? author.user_type.charAt(0).toUpperCase() + author.user_type.slice(1) : ''}{' '}
              {field?.name ? `· ${field.name}` : ''} · {timeAgo(post.created_at)}
            </p>
          </div>
        </Link>
      </header>

      {/* Title */}
      <Link to={`/post/${post.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg">
        <h2 className="text-lg font-black tracking-tight text-white transition hover:text-emerald-200">
          {post.title}
        </h2>
      </Link>

      {/* Content preview */}
      <p className="mt-2 line-clamp-3 text-sm text-slate-300">{post.content}</p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {post.post_type && (
          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
              post.post_type === 'question'
                ? 'border-amber-300/40 bg-amber-300/15 text-amber-100'
                : 'border-emerald-300/40 bg-emerald-300/15 text-emerald-100'
            }`}
          >
            {post.post_type}
          </span>
        )}
        {tags.map((tag) => (
          <Link
            key={tag.id}
            to={`/?tagId=${tag.id}&tagName=${encodeURIComponent(tag.name)}`}
            className="rounded-full border border-white/10 bg-ink-900/50 px-3 py-1 text-xs text-slate-300 transition hover:border-emerald-300/40 hover:bg-emerald-300/10 hover:text-emerald-100 cursor-pointer"
          >
            {tag.name}
          </Link>
        ))}
        {post.tagged_alumni && (
          <Link 
            to={`/profile/${post.tagged_alumni.id}`}
            className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/20 cursor-pointer"
          >
            @{post.tagged_alumni.name}
          </Link>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => handleVote(e, 1)}
              disabled={votePending}
              aria-pressed={post.my_vote === 1}
              aria-label="Upvote post"
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold text-emerald-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 ${
                post.my_vote === 1
                  ? 'border-emerald-300/60 bg-emerald-300/20'
                  : 'border-emerald-300/30 bg-emerald-300/10 hover:bg-emerald-300/20'
              }`}
            >
              <VoteIcon direction="up" />
              <span className="ml-1">{post.upvote_count}</span>
            </button>
            <button
              onClick={(e) => handleVote(e, -1)}
              disabled={votePending}
              aria-pressed={post.my_vote === -1}
              aria-label="Downvote post"
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold text-red-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50 ${
                post.my_vote === -1
                  ? 'border-red-300/60 bg-red-300/20'
                  : 'border-red-300/30 bg-red-300/10 hover:bg-red-300/20'
              }`}
            >
              <VoteIcon direction="down" />
              <span className="ml-1">{post.downvote_count}</span>
            </button>
          </div>
          <Link
            to={`/post/${post.id}`}
            className="flex items-center gap-1 transition hover:text-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg px-1"
          >
            <span>💬</span> 
            <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
          </Link>
        </div>
      </footer>
    </article>
  )
}
