import { useState } from 'react'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import type { PostFilters } from './post-service'
import { FeedFilters } from './FeedFilters'
import { PostCard } from './PostCard'
import { PostComposer } from './PostComposer'
import { usePosts } from './use-posts'

export function FeedPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const askAlumni = location.state?.askAlumni as { id: string; name: string } | undefined

  const urlTagId = searchParams.get('tagId')
  const urlTagName = searchParams.get('tagName')

  const [filters, setFilters] = useState<PostFilters>({ 
    page: 1, 
    limit: 20,
    tagId: urlTagId || undefined 
  })
  const [prevTagId, setPrevTagId] = useState(urlTagId)

  if (urlTagId !== prevTagId) {
    setPrevTagId(urlTagId)
    setFilters((f) => ({ ...f, tagId: urlTagId || undefined, page: 1 }))
  }
  const [showComposer, setShowComposer] = useState(false)
  const isComposerOpen = showComposer || searchParams.get('compose') === 'true' || !!askAlumni

  function handleCloseComposer() {
    setShowComposer(false)
    setSearchParams({}, { replace: true })
    if (askAlumni) {
      navigate('.', { replace: true, state: {} })
    }
  }
  const { data, isLoading, error } = usePosts(filters)
  const posts = data?.posts ?? []
  const total = data?.total ?? 0

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-6">
      <section className="flex-1 space-y-5">
        {/* Inline Composer */}
        {!isComposerOpen ? (
          <button
            type="button"
            onClick={() => setShowComposer(true)}
            className="group flex w-full items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-left shadow-liquid backdrop-blur-2xl transition hover:border-emerald-300/20 hover:bg-white/[0.07] cursor-pointer"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/10 transition group-hover:bg-emerald-300/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-emerald-200">
                <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
              </svg>
            </span>
            <span className="flex-1 text-sm text-slate-400 transition group-hover:text-slate-200">
              Share a practical insight, ask a question, or tag an alumni expert...
            </span>
            <span className="hidden rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-200 sm:inline-block">
              Create Post
            </span>
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-200">New Post</p>
              <button
                type="button"
                onClick={handleCloseComposer}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold text-slate-400 transition hover:border-white/20 hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
            <PostComposer
              initialTaggedAlumni={askAlumni}
              initialPostType={askAlumni ? 'question' : 'information'}
              onSuccess={handleCloseComposer}
            />
          </div>
        )}

        {/* Filters */}
        <FeedFilters filters={filters} onChange={setFilters} />

        {/* Active Tag Filter */}
        {filters.tagId && urlTagName && (
          <div className="flex items-center justify-between rounded-2xl border border-emerald-300/20 bg-emerald-300/5 px-4 py-3 shadow-liquid">
            <p className="text-sm text-slate-300">
              Showing posts tagged with <span className="font-bold text-emerald-200">#{urlTagName}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                const nextParams = new URLSearchParams(searchParams)
                nextParams.delete('tagId')
                nextParams.delete('tagName')
                setSearchParams(nextParams, { replace: true })
              }}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        )}

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

        {/* Pagination / Load More */}
        {total > (filters.limit ?? 20) && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, limit: (f.limit ?? 20) + 20 }))}
              disabled={isLoading}
              className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-emerald-200 transition hover:bg-emerald-300/20 disabled:opacity-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {isLoading ? 'Loading...' : 'Load More Posts'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
