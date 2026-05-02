import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/use-auth'
import { ALUMNI_KEYS } from '../alumni/use-alumni'
import { BADGE_KEYS } from '../badges/use-badges'
import { LEADERBOARD_KEYS } from '../leaderboard/use-leaderboard'
import { PROFILE_KEYS } from '../profile/use-profile-metrics'
import { SEARCH_KEYS } from '../search/use-search'
import { castVote, fetchMyVote, removeVote, type VoteValue } from './vote-service'
import { POST_KEYS } from './use-posts'

export const VOTE_KEYS = {
  all: ['votes'] as const,
  mine: (voterId: string | null, targetId: string) =>
    ['votes', 'mine', voterId, targetId] as const,
}

function invalidateVoteConsumers(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: VOTE_KEYS.all })
  void queryClient.invalidateQueries({ queryKey: POST_KEYS.all })
  void queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all })
  void queryClient.invalidateQueries({ queryKey: ALUMNI_KEYS.all })
  void queryClient.invalidateQueries({ queryKey: SEARCH_KEYS.all })
  void queryClient.invalidateQueries({ queryKey: LEADERBOARD_KEYS.all })
  void queryClient.invalidateQueries({ queryKey: BADGE_KEYS.all })
}

export function useMyVote(targetId: string) {
  const { session } = useAuth()
  const voterId = session?.user.id ?? null

  return useQuery({
    queryKey: VOTE_KEYS.mine(voterId, targetId),
    queryFn: () => {
      if (!voterId) throw new Error('Must be signed in to load vote.')
      return fetchMyVote(voterId, targetId)
    },
    enabled: !!voterId && !!targetId && voterId !== targetId,
  })
}

export function useCastVote() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ targetId, value }: { targetId: string; value: VoteValue }) => {
      if (!session) throw new Error('Must be signed in to vote.')
      return castVote(session.user.id, targetId, value)
    },
    onSuccess: () => {
      invalidateVoteConsumers(queryClient)
    },
  })
}

export function useRemoveVote() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: (targetId: string) => {
      if (!session) throw new Error('Must be signed in.')
      return removeVote(session.user.id, targetId)
    },
    onSuccess: () => {
      invalidateVoteConsumers(queryClient)
    },
  })
}
