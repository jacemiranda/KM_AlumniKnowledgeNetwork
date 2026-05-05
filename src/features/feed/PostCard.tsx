import { Link } from 'react-router-dom'
import type { PostWithRelations } from './post-service'

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

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-liquid backdrop-blur-2xl transition hover:-translate-y-0.5">
      {/* Header */}
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {author?.profile_picture_url ? (
            <img
              src={author.profile_picture_url}
              alt={author.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-300/20 text-sm font-bold text-emerald-200">
              {author?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-white">{author?.name ?? 'Unknown'}</p>
            <p className="text-xs text-slate-400">
              {author?.user_type ? author.user_type.charAt(0).toUpperCase() + author.user_type.slice(1) : ''}{' '}
              {field?.name ? `· ${field.name}` : ''} · {timeAgo(post.created_at)}
            </p>
          </div>
        </div>
      </header>

      {/* Title */}
      <Link to={`/post/${post.id}`} className="block">
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
          <span
            key={tag.id}
            className="rounded-full border border-white/10 bg-ink-900/50 px-3 py-1 text-xs text-slate-300"
          >
            {tag.name}
          </span>
        ))}
        {post.tagged_alumni && (
          <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200">
            @{post.tagged_alumni.name}
          </span>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-400">
        <div className="flex gap-4">
          <Link
            to={`/post/${post.id}`}
            className="transition hover:text-amber-200"
          >
            💬 {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
          </Link>
        </div>
        <Link
          to={`/post/${post.id}`}
          className="transition hover:text-slate-200"
        >
          View →
        </Link>
      </footer>
    </article>
  )
}
