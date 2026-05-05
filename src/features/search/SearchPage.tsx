import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SearchBar } from './SearchBar'
import { UserResultCard } from './UserResultCard'
import { useSearchUsers, useSearchPosts } from './use-search'
import type { SearchFilters, SearchPostResult } from './search-service'
import {
  SearchEmptyState,
  SearchErrorState,
  SearchFilterPills,
  SearchLoadingState,
  SearchPromptState,
  SearchPostCard,
  type SearchMixedItem,
  type SearchViewFilter,
} from './search-ui'
import { FeedSurface } from '../feed/feed-ui'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''

  const [activeFilter, setActiveFilter] = useState<SearchViewFilter>('all')
  const [filters] = useState<SearchFilters>({})

  // The effective query for data fetching is from the URL
  const query = urlQuery

  const handleSearch = (q: string) => {
    if (q.trim()) {
      setSearchParams({ q: q.trim() }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

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

  const hasQuery = query.trim().length >= 2

  const userResults = users ?? []
  const postResults = posts ?? []

  const mixedItems = useMemo<SearchMixedItem[]>(() => {
    const visibleUsers =
      activeFilter === 'posts'
        ? []
        : activeFilter === 'tags'
          ? userResults.filter((user) => user.skills.length > 0)
          : userResults

    const visiblePosts =
      activeFilter === 'alumni'
        ? []
        : activeFilter === 'tags'
          ? postResults.filter((post) => post.post_tags.length > 0)
          : postResults

    const items: SearchMixedItem[] = []
    const maxLength = Math.max(visibleUsers.length, visiblePosts.length)

    for (let index = 0; index < maxLength; index += 1) {
      const user = visibleUsers[index]
      const post = visiblePosts[index]

      if (post) {
        items.push({ kind: 'post', post })
      }

      if (user) {
        items.push({ kind: 'user', user })
      }
    }

    return items
  }, [activeFilter, postResults, userResults])

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <FeedSurface className="p-4 md:p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Discover</p>
            <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">
              Search people, posts, and topics
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-400 md:text-[15px]">
              Find alumni, knowledge posts, fields, tags, and skills with one focused query.
            </p>
          </div>

          <SearchBar
            initialQuery={urlQuery}
            onSearch={handleSearch}
            placeholder="Search by name, field, tags, skills..."
            inputClassName="rounded-[28px] border border-white/10 bg-black/20 py-4 pl-11 pr-4 text-base shadow-liquid placeholder:text-slate-500 focus:border-emerald-300/40 focus:ring-1 focus:ring-emerald-300/30"
          />
          <SearchFilterPills value={activeFilter} onChange={setActiveFilter} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition cursor-pointer ${
              activeTab === tab.key
                ? 'bg-emerald-300/15 text-emerald-100 border border-emerald-300/30'
                : 'text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {tab.label}
            {hasQuery && !usersLoading && !postsLoading && (
              <span className="ml-1.5 text-[10px] opacity-70">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {!hasQuery && (
        <SearchPromptState />
      )}

      {hasQuery && (usersLoading || postsLoading) && <SearchLoadingState />}

      {hasQuery && !usersLoading && !postsLoading && (usersError || postsError) && (
        <SearchErrorState
          message={
            usersError instanceof Error
              ? usersError.message
              : postsError instanceof Error
                ? postsError.message
                : 'Failed to search.'
          }
        />
      )}

      {hasQuery && !usersLoading && !postsLoading && !usersError && !postsError && mixedItems.length === 0 && (
        <SearchEmptyState
          message={
            activeFilter === 'posts'
              ? 'No matching posts found.'
              : activeFilter === 'alumni'
                ? 'No matching alumni found.'
                : 'Try a different query or switch filters.'
          }
        />
      )}

      {hasQuery && !usersLoading && !postsLoading && !usersError && !postsError && mixedItems.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mixedItems.map((item) =>
            item.kind === 'user' ? (
              <UserResultCard key={item.user.id} user={item.user} />
            ) : (
              <SearchPostCard key={item.post.id} post={item.post} />
            ),
          )}
        </div>
      )}
    </div>
  )
}
