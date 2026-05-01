import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../auth/use-auth'
import { fetchProfileMetrics } from './profile-service'

export const PROFILE_KEYS = {
  all: ['profiles'] as const,
  detail: (profileId: string, viewerId?: string | null) =>
    ['profiles', 'detail', profileId, viewerId ?? null] as const,
}

export function useProfileMetrics(profileId: string) {
  const { session } = useAuth()
  const viewerId = session?.user.id ?? null

  return useQuery({
    queryKey: PROFILE_KEYS.detail(profileId, viewerId),
    queryFn: () => fetchProfileMetrics(profileId, viewerId),
    enabled: !!profileId,
  })
}
