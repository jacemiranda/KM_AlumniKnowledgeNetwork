import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { CommentWithAuthor } from './comment-service'
import type { PostType } from './post-service'

type FeedSurfaceProps = {
  children: ReactNode
  className?: string
}

export function FeedSurface({ children, className = '' }: FeedSurfaceProps) {
  return (
    <div
      className={`rounded-[32px] border border-white/10 bg-[#131b2e]/60 shadow-liquid backdrop-blur-2xl ${className}`}
    >
      {children}
    </div>
  )
}

type FeedStateProps = {
  title: string
  message: string
  variant: 'loading' | 'empty' | 'error'
}

function StateIcon({ variant }: { variant: FeedStateProps['variant'] }) {
  if (variant === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-300/80" />
        <span className="h-3 w-16 animate-pulse rounded-full bg-white/10" />
      </div>
    )
  }

  if (variant === 'error') {
    return (
      <svg aria-hidden="true" className="h-10 w-10 text-[#ffb4ab] drop-shadow-[0_0_12px_rgba(255,180,171,0.45)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 2.82 17a2 2 0 0 0 1.72 3h15.92a2 2 0 0 0 1.72-3L14.71 3.86a2 2 0 0 0-3.42 0Z" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className="h-12 w-12 text-emerald-300/55 drop-shadow-[0_0_18px_rgba(78,222,163,0.2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
      <circle cx="12" cy="12" r="8" />
    </svg>
  )
}

export function FeedStateCard({ title, message, variant }: FeedStateProps) {
  const borderClass =
    variant === 'error'
      ? 'border border-[#ffb4ab]/30 bg-[#131b2e]/70 shadow-[0_0_0_1px_rgba(255,180,171,0.12),0_0_30px_rgba(255,180,171,0.08)]'
      : 'border border-white/10 bg-white/5 shadow-liquid'

  return (
    <div className={`rounded-[32px] backdrop-blur-2xl ${borderClass}`}>
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-10 text-center md:px-10 md:py-14">
        <div
          className={
            variant === 'empty'
              ? 'flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-emerald-300/25 bg-emerald-300/8'
              : 'flex h-16 w-16 items-center justify-center rounded-full bg-white/5'
          }
        >
          <StateIcon variant={variant} />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-extrabold tracking-tight text-white md:text-lg">{title}</h3>
          <p className="max-w-sm text-sm leading-relaxed text-slate-400 md:text-[15px]">{message}</p>
        </div>
      </div>
    </div>
  )
}

export function FeedLoadingState() {
  return (
    <FeedStateCard
      variant="loading"
      title="Loading feed"
      message="Pulling in the latest posts, comments, and tags."
    />
  )
}

export function FeedEmptyState() {
  return (
    <FeedStateCard
      variant="empty"
      title="No posts found"
      message="Try another filter or be the first to share a useful insight."
    />
  )
}

export function FeedErrorState({ message = 'Failed to load feed' }: { message?: string }) {
  return <FeedStateCard variant="error" title="Failed to load feed" message={message} />
}

type PostTypeTabsProps = {
  value: PostType
  onChange: (next: PostType) => void
}

export function PostTypeTabs({ value, onChange }: PostTypeTabsProps) {
  const tabs: Array<{ value: PostType; label: string; accent: string }> = [
    { value: 'information', label: 'Information', accent: 'emerald' },
    { value: 'question', label: 'Question', accent: 'amber' },
  ]

  return (
    <div className="inline-flex rounded-full border border-white/10 bg-black/10 p-1 shadow-inner shadow-black/20">
      {tabs.map((tab) => {
        const active = value === tab.value
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] transition md:px-5 ${
              active
                ? tab.accent === 'emerald'
                  ? 'border border-emerald-300/40 bg-emerald-300/18 text-emerald-100 shadow-[0_0_0_1px_rgba(78,222,163,0.12)]'
                  : 'border border-amber-300/40 bg-amber-300/18 text-amber-100 shadow-[0_0_0_1px_rgba(255,185,95,0.12)]'
                : 'border border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

type VoteArrowButtonProps = {
  direction: 'up' | 'down'
  active?: boolean
  onClick?: () => void
}

export function VoteArrowButton({ direction, active = false, onClick }: VoteArrowButtonProps) {
  const activeClass = active
    ? 'text-[#4edea3] drop-shadow-[0_0_8px_rgba(78,222,163,0.5)] border-emerald-300/40 bg-emerald-300/12'
    : 'text-slate-400 border-white/10 bg-white/5 hover:text-slate-200 hover:border-white/20'
  const path =
    direction === 'up'
      ? 'M5 14.25 12 7.25l7 7'
      : 'M5 9.75 12 16.75l7-7'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[11px] font-bold transition ${activeClass}`}
      aria-label={direction === 'up' ? 'Upvote comment' : 'Downvote comment'}
      aria-pressed={active}
    >
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </button>
  )
}

type ThreadedComment = CommentWithAuthor & { replies?: ThreadedComment[] }

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

function CommentAvatar({ name, profilePictureUrl }: { name: string | null; profilePictureUrl: string | null }) {
  if (profilePictureUrl) {
    return <img src={profilePictureUrl} alt={name ?? 'Comment author'} className="h-9 w-9 rounded-full object-cover" />
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-300/18 text-xs font-bold text-emerald-100">
      {name?.charAt(0)?.toUpperCase() ?? '?'}
    </div>
  )
}

function CommentNode({
  comment,
  currentUserId,
  onDelete,
  depth = 0,
}: {
  comment: ThreadedComment
  currentUserId: string | null
  onDelete: (id: string) => void
  depth?: number
}) {
  const [vote, setVote] = useState<1 | -1 | null>(null)
  const author = comment.author
  const isOwner = currentUserId === comment.author_id

  return (
    <div className={`rounded-[24px] border border-white/10 bg-black/20 p-4 ${depth > 0 ? 'ml-5 border-l-2 border-l-white/10 pl-4' : ''}`}>
      <div className="flex items-start gap-3">
        <CommentAvatar name={author?.name ?? null} profilePictureUrl={author?.profile_picture_url ?? null} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-bold text-white">{author?.name ?? 'Unknown'}</span>
            <span className="text-xs text-slate-500">{timeAgo(comment.created_at)}</span>
            {depth > 0 ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Reply
              </span>
            ) : null}
          </div>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{comment.content}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <VoteArrowButton direction="up" active={vote === 1} onClick={() => setVote(vote === 1 ? null : 1)} />
        <VoteArrowButton direction="down" active={vote === -1} onClick={() => setVote(vote === -1 ? null : -1)} />
        {isOwner ? (
          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            className="ml-auto text-xs font-semibold text-red-300 transition hover:text-red-200"
          >
            Delete
          </button>
        ) : null}
      </div>

      {comment.replies?.length ? (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function CommentThreadList({
  comments,
  currentUserId,
  onDelete,
}: {
  comments: CommentWithAuthor[]
  currentUserId: string | null
  onDelete: (id: string) => void
}) {
  const threadedComments = useMemo(
    () => comments.map((comment) => ({ ...comment, replies: [] })) as ThreadedComment[],
    [comments],
  )

  if (threadedComments.length === 0) return null

  return (
    <div className="space-y-3">
      {threadedComments.map((comment) => (
        <CommentNode
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
