import { useQuery } from '@tanstack/react-query'
import { fetchTags } from './tag-service'

export const TAG_KEYS = {
  all: ['tags'] as const,
}

export function useTags() {
  return useQuery({
    queryKey: TAG_KEYS.all,
    queryFn: fetchTags,
    staleTime: 5 * 60 * 1000, // tags change infrequently
  })
}
