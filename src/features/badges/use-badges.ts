import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/use-auth'
import {
  awardBadge,
  checkAndAwardBadges,
  fetchBadges,
  fetchUserBadges,
} from './badge-service'

export const BADGE_KEYS = {
  all: ['badges'] as const,
  definitions: ['badges', 'definitions'] as const,
  user: (profileId: string) => ['badges', 'user', profileId] as const,
}

export function useBadges() {
  return useQuery({
    queryKey: BADGE_KEYS.definitions,
    queryFn: fetchBadges,
  })
}

export function useUserBadges(profileId: string) {
  return useQuery({
    queryKey: BADGE_KEYS.user(profileId),
    queryFn: () => fetchUserBadges(profileId),
    enabled: !!profileId,
  })
}

export function useAwardBadge() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ profileId, badgeId }: { profileId: string; badgeId: string }) => {
      if (!session) throw new Error('Must be signed in.')
      return awardBadge(profileId, badgeId, session.user.id)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BADGE_KEYS.all })
    },
  })
}

export function useCheckBadges() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (profileId: string) => checkAndAwardBadges(profileId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BADGE_KEYS.all })
    },
  })
}
