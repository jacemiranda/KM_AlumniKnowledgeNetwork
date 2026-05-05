import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { PostFilters } from './post-service'
import { FeedFilters } from './FeedFilters'
import { PostCard } from './PostCard'
import { PostComposer } from './PostComposer'
import { usePosts } from './use-posts'

export function FeedPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<PostFilters>({ page: 1, limit: 20 })
  const [showComposer, setShowComposer] = useState(false)
  const isComposerOpen = showComposer || searchParams.get('compose') === 'true'
  const { data, isLoading, error } = usePosts(filters)
  const posts = data?.posts ?? []
  const total = data?.total ?? 0

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-6">
      <section className="flex-1 space-y-5">
        {/* Toggle Composer */}
        {!isComposerOpen ? (
          <button
            type="button"
            onClick={() => setShowComposer(true)}
            className="w-full rounded-3xl border border-white/10 bg-white/5 p-4 text-left text-sm text-slate-400 shadow-liquid backdrop-blur-2xl transition hover:border-emerald-300/20 hover:text-slate-200"
          >
            Share a practical insight, ask a question, or tag an alumni expert...
          </button>
        ) : (
          <PostComposer
            onSuccess={() => {
              setShowComposer(false)
              setSearchParams({}, { replace: true })
            }}
          />
        )}

        {/* Filters */}
        <FeedFilters filters={filters} onChange={setFilters} />

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/5 shadow-liquid backdrop-blur-2xl"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-6 text-sm text-red-300 shadow-liquid backdrop-blur-2xl">
            {error instanceof Error ? error.message : 'Failed to load posts.'}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && posts.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-liquid backdrop-blur-2xl">
            <p className="text-sm text-slate-400">
              No posts yet. Be the first to share a useful insight.
            </p>
          </div>
        )}

        {/* Post List */}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {/* Pagination */}
        {total > (filters.limit ?? 20) && (
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              disabled={!filters.page || filters.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:opacity-30"
            >
              ← Previous
            </button>
            <span className="px-2 py-2 text-xs text-slate-500">
              Page {filters.page ?? 1} of {Math.ceil(total / (filters.limit ?? 20))}
            </span>
            <button
              type="button"
              disabled={(filters.page ?? 1) * (filters.limit ?? 20) >= total}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
