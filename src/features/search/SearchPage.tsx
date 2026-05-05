import { useCallback, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SearchBar } from './SearchBar'
import { UserResultCard } from './UserResultCard'
import { useSearchUsers, useSearchPosts } from './use-search'
import type { SearchFilters, SearchPostResult } from './search-service'

type TabKey = 'all' | 'people' | 'posts'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''

  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [filters] = useState<SearchFilters>({})

  // The effective query for data fetching is from the URL
  const query = urlQuery

  // Sync state → URL
  const handleSearch = useCallback(
    (q: string) => {
      if (q.trim()) {
        setSearchParams({ q: q.trim() }, { replace: true })
      } else {
        setSearchParams({}, { replace: true })
      }
    },
    [setSearchParams],
  )

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useSearchUsers(query, filters)

  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
  } = useSearchPosts(query, filters)

  const showUsers = activeTab === 'all' || activeTab === 'people'
  const showPosts = activeTab === 'all' || activeTab === 'posts'
  const hasQuery = query.trim().length >= 2
  const userCount = users?.length ?? 0
  const postCount = posts?.length ?? 0

  const tabs: Array<{ key: TabKey; label: string; count: number }> = [
    { key: 'all', label: 'All', count: userCount + postCount },
    { key: 'people', label: 'People', count: userCount },
    { key: 'posts', label: 'Posts', count: postCount },
  ]

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-liquid backdrop-blur-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
          Discover
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-white">
          Search
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Find people, posts, and knowledge by name, field, tags, and skills.
        </p>

        <div className="mt-4">
          <SearchBar
            initialQuery={urlQuery}
            onSearch={handleSearch}
            placeholder="Search by name, field, tags, skills..."
          />
        </div>
      </FeedSurface>

      {/* Empty State — no query */}
      {!hasQuery && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-liquid backdrop-blur-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10">
            <svg className="h-8 w-8 text-emerald-400/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-sm text-slate-400">
            Type at least 2 characters to start searching.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Search across users, posts, fields, and skills.
          </p>
        </div>
      )}

      {/* People Results */}
      {hasQuery && showUsers && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-300">
              People
              {!usersLoading && (
                <span className="ml-2 text-xs font-normal text-slate-500">
                  {userCount} found
                </span>
              )}
            </h2>
            {activeTab === 'all' && userCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('people')}
                className="text-xs text-emerald-300 hover:text-emerald-200 transition cursor-pointer"
              >
                View all →
              </button>
            )}
          </div>

          {usersLoading && <SkeletonCards count={3} />}

          {usersError && (
            <ErrorBox message={usersError instanceof Error ? usersError.message : 'Failed to search users.'} />
          )}

          {!usersLoading && !usersError && userCount === 0 && (
            <EmptyState message="No matching people found." />
          )}

          <div className="space-y-3">
            {(activeTab === 'all' ? users?.slice(0, 5) : users)?.map((user) => (
              <UserResultCard key={user.id} user={user} />
            ))}
          </div>
        </section>
      )}

      {/* Posts Results */}
      {hasQuery && showPosts && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-300">
              Posts
              {!postsLoading && (
                <span className="ml-2 text-xs font-normal text-slate-500">
                  {postCount} found
                </span>
              )}
            </h2>
            {activeTab === 'all' && postCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('posts')}
                className="text-xs text-emerald-300 hover:text-emerald-200 transition cursor-pointer"
              >
                View all →
              </button>
            )}
          </div>

          {postsLoading && <SkeletonCards count={3} />}

          {postsError && (
            <ErrorBox message={postsError instanceof Error ? postsError.message : 'Failed to search posts.'} />
          )}

          {!postsLoading && !postsError && postCount === 0 && (
            <EmptyState message="No matching posts found." />
          )}

          <div className="space-y-3">
            {(activeTab === 'all' ? posts?.slice(0, 5) : posts)?.map((post) => (
              <PostResultCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────

function PostResultCard({ post }: { post: SearchPostResult }) {
  const snippet = post.content.length > 200
    ? post.content.slice(0, 200) + '...'
    : post.content

  return (
    <Link
      to={`/post/${post.id}`}
      className="group block rounded-2xl border border-white/10 bg-white/5 p-4 shadow-liquid backdrop-blur-2xl transition hover:border-emerald-300/20 hover:bg-white/[0.08] cursor-pointer"
    >
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
          post.post_type === 'question'
            ? 'bg-amber-400/15 text-amber-300'
            : 'bg-cyan-400/15 text-cyan-300'
        }`}>
          {post.post_type}
        </span>
        <span className="text-slate-600">•</span>
        <span>{post.field.name}</span>
        <span className="text-slate-600">•</span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>

      <h3 className="mt-2 text-sm font-bold text-white group-hover:text-emerald-100 transition-colors">
        {post.title}
      </h3>
      <p className="mt-1 text-xs text-slate-400 line-clamp-2">{snippet}</p>

      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-slate-500">
          by {post.author.name}
        </span>
        {post.post_tags.length > 0 && (
          <div className="flex gap-1">
            {post.post_tags.slice(0, 3).map((pt) => (
              <span
                key={pt.tag.id}
                className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-500"
              >
                {pt.tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

function SkeletonCards({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/5 shadow-liquid backdrop-blur-2xl"
        />
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-500 backdrop-blur-2xl">
      {message}
    </div>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300 backdrop-blur-2xl">
      {message}
    </div>
  )
}
