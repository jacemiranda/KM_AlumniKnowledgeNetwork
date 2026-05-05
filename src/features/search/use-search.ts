import { useQuery } from '@tanstack/react-query'
import {
  searchPosts,
  searchUsers,
  type SearchFilters,
} from './search-service'

export const SEARCH_KEYS = {
  all: ['search'] as const,
  users: (query: string, filters: SearchFilters) =>
    ['search', 'users', query, filters] as const,
  posts: (query: string, filters: SearchFilters) =>
    ['search', 'posts', query, filters] as const,
}

export function useSearchUsers(query: string, filters: SearchFilters = {}) {
  return useQuery({
    queryKey: SEARCH_KEYS.users(query, filters),
    queryFn: () => searchUsers(query, filters),
    enabled: query.trim().length >= 1,
    staleTime: 30_000,
  })
}

export function useSearchPosts(query: string, filters: SearchFilters = {}) {
  return useQuery({
    queryKey: SEARCH_KEYS.posts(query, filters),
    queryFn: () => searchPosts(query, filters),
    enabled: query.trim().length >= 1,
    staleTime: 30_000,
  })
}
