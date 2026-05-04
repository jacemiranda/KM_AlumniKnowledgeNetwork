import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FeedSurface } from '../feed/feed-ui'
import type { SearchPostResult, SearchUserResult } from './search-service'

export type SearchViewFilter = 'all' | 'posts' | 'alumni' | 'tags'

export type SearchMixedItem =
  | { kind: 'post'; post: SearchPostResult }
  | { kind: 'user'; user: SearchUserResult }

export function SearchFilterPills({
  value,
  onChange,
}: {
  value: SearchViewFilter
  onChange: (next: SearchViewFilter) => void
}) {
  const pills: Array<{ value: SearchViewFilter; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'posts', label: 'Posts' },
    { value: 'alumni', label: 'Alumni' },
    { value: 'tags', label: 'Tags' },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((pill) => {
        const active = pill.value === value
        return (
          <button
            key={pill.value}
            type="button"
            onClick={() => onChange(pill.value)}
            className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] transition ${
              active
                ? 'border border-[#4edea3]/30 bg-[#4edea3]/20 text-[#4edea3]'
                : 'border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            {pill.label}
          </button>
        )
      })}
    </div>
  )
}

function SearchStateFrame({
  title,
  message,
  icon,
  children,
}: {
  title: string
  message: string
  icon: ReactNode
  children?: ReactNode
}) {
  return (
    <FeedSurface className="p-5 md:p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-extrabold tracking-tight text-white md:text-lg">{title}</h3>
          <p className="max-w-md text-sm leading-relaxed text-slate-400 md:text-[15px]">{message}</p>
        </div>
        {children}
      </div>
    </FeedSurface>
  )
}

export function SearchPromptState() {
  return (
    <SearchStateFrame
      title="Search the network"
      message="Type at least 2 characters to discover alumni, posts, fields, tags, and skills."
      icon={<SearchMagnifier />}
    />
  )
}

export function SearchEmptyState({ message = 'No matching results found.' }: { message?: string }) {
  return (
    <SearchStateFrame
      title="No results found"
      message={message}
      icon={<SearchSpark />}
    />
  )
}

export function SearchErrorState({ message }: { message: string }) {
  return (
    <SearchStateFrame
      title="Search failed"
      message={message}
      icon={<SearchWarning />}
    />
  )
}

export function SearchLoadingState() {
  return (
    <FeedSurface className="p-5 md:p-6">
      <div className="space-y-3">
        <div className="h-5 w-28 animate-pulse rounded-full bg-white/10" />
        <div className="grid gap-3 md:grid-cols-2">
          <div className="h-32 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
          <div className="h-32 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
        </div>
      </div>
    </FeedSurface>
  )
}

function SearchMagnifier() {
  return (
    <svg aria-hidden="true" className="h-8 w-8 text-emerald-300/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}

function SearchSpark() {
  return (
    <svg aria-hidden="true" className="h-8 w-8 text-emerald-300/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v4m0 10v4m8-8h-4M8 12H4m12.95-6.95-2.83 2.83M8.88 15.12l-2.83 2.83m11.9 0-2.83-2.83M8.88 8.88 6.05 6.05" />
    </svg>
  )
}

function SearchWarning() {
  return (
    <svg aria-hidden="true" className="h-8 w-8 text-[#ffb4ab]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 2.82 17a2 2 0 0 0 1.72 3h15.92a2 2 0 0 0 1.72-3L14.71 3.86a2 2 0 0 0-3.42 0Z" />
    </svg>
  )
}

export function SearchPostCard({ post }: { post: SearchPostResult }) {
  const snippet = post.content.length > 180 ? `${post.content.slice(0, 180)}...` : post.content

  return (
    <Link
      to={`/post/${post.id}`}
      className="group flex h-full flex-col rounded-[28px] border border-white/10 bg-[#131b2e]/60 p-4 shadow-liquid backdrop-blur-2xl transition hover:border-emerald-300/20 hover:bg-white/[0.08]"
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        <span
          className={`rounded-full px-2 py-0.5 ${
            post.post_type === 'question'
              ? 'bg-amber-300/15 text-amber-100'
              : 'bg-emerald-300/15 text-emerald-100'
          }`}
        >
          {post.post_type}
        </span>
        <span>•</span>
        <span>{post.field.name}</span>
      </div>

      <h3 className="mt-3 text-sm font-extrabold tracking-tight text-white transition group-hover:text-emerald-100 md:text-base">
        {post.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{snippet}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.post_tags.slice(0, 3).map((pt) => (
          <span
            key={pt.tag.id}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300"
          >
            {pt.tag.name}
          </span>
        ))}
      </div>

      <div className="mt-4 border-t border-white/10 pt-3 text-xs text-slate-500">
        <span>By {post.author.name}</span>
      </div>
    </Link>
  )
}
