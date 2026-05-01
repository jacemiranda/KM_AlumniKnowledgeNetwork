import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/use-auth'
import { castVote, removeVote, type VoteValue } from './vote-service'

export function useCastVote() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ targetId, value }: { targetId: string; value: VoteValue }) => {
      if (!session) throw new Error('Must be signed in to vote.')
      return castVote(session.user.id, targetId, value)
    },
    onSuccess: () => {
      // Invalidate post queries so vote-related data refreshes
      void queryClient.invalidateQueries({ queryKey: ['posts'] })
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
      void queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
