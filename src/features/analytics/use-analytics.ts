import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../auth/use-auth'
import { fetchPlatformAnalytics } from './analytics-service'

export const ANALYTICS_KEYS = {
  all: ['analytics'] as const,
  platform: ['analytics', 'platform'] as const,
}

/**
 * Fetch platform analytics. Only enabled for Admin and Moderator roles.
 */
export function useAnalytics() {
  const { session } = useAuth()
  const role = session?.user.role

  return useQuery({
    queryKey: ANALYTICS_KEYS.platform,
    queryFn: fetchPlatformAnalytics,
    enabled: role === 'admin' || role === 'moderator',
  })
}
