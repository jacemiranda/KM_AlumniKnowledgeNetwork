import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/use-auth'
import { ALUMNI_KEYS } from '../alumni/use-alumni'
import { BADGE_KEYS } from '../badges/use-badges'
import { LEADERBOARD_KEYS } from '../leaderboard/use-leaderboard'
import { PROFILE_KEYS } from '../profile/use-profile-metrics'
import { SEARCH_KEYS } from '../search/use-search'
import { POST_KEYS } from './use-posts'
import { COMMENT_KEYS } from './use-comments'
import {
  castPostVote,
  removePostVote,
  castCommentVote,
  removeCommentVote,
  type VoteValue,
} from './vote-service'

export const VOTE_KEYS = {
  all: ['votes'] as const,
  post: (postId: string) => ['votes', 'posts', postId] as const,
  comment: (commentId: string) => ['votes', 'comments', commentId] as const,
}

function invalidateVoteConsumers(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: VOTE_KEYS.all })
  void queryClient.invalidateQueries({ queryKey: POST_KEYS.all })
  void queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.all })
  void queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all })
  void queryClient.invalidateQueries({ queryKey: ALUMNI_KEYS.all })
  void queryClient.invalidateQueries({ queryKey: SEARCH_KEYS.all })
  void queryClient.invalidateQueries({ queryKey: LEADERBOARD_KEYS.all })
  void queryClient.invalidateQueries({ queryKey: BADGE_KEYS.all })
}

export function useCastPostVote() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ postId, value }: { postId: string; value: VoteValue }) => {
      if (!session) throw new Error('Must be signed in to vote.')
      return castPostVote(session.user.id, postId, value)
    },
    onSuccess: () => invalidateVoteConsumers(queryClient),
  })
}

export function useRemovePostVote() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: (postId: string) => {
      if (!session) throw new Error('Must be signed in.')
      return removePostVote(session.user.id, postId)
    },
    onSuccess: () => invalidateVoteConsumers(queryClient),
  })
}

export function useCastCommentVote() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ commentId, value }: { commentId: string; value: VoteValue }) => {
      if (!session) throw new Error('Must be signed in to vote.')
      return castCommentVote(session.user.id, commentId, value)
    },
    onSuccess: () => invalidateVoteConsumers(queryClient),
  })
}

export function useRemoveCommentVote() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: (commentId: string) => {
      if (!session) throw new Error('Must be signed in.')
      return removeCommentVote(session.user.id, commentId)
    },
    onSuccess: () => invalidateVoteConsumers(queryClient),
  })
}
