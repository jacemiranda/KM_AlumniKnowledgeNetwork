import { useQuery } from '@tanstack/react-query'
import { fetchLeaderboard, type LeaderboardFilters } from './leaderboard-service'

export const LEADERBOARD_KEYS = {
  all: ['leaderboard'] as const,
  list: (filters: LeaderboardFilters) => ['leaderboard', 'list', filters] as const,
}

export function useLeaderboard(filters: LeaderboardFilters = {}) {
  return useQuery({
    queryKey: LEADERBOARD_KEYS.list(filters),
    queryFn: () => fetchLeaderboard(filters),
  })
}
