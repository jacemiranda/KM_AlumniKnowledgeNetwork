import { useQuery } from '@tanstack/react-query'
import {
  fetchAlumni,
  fetchAlumniProfile,
  type AlumniFilters,
} from './alumni-service'

export const ALUMNI_KEYS = {
  all: ['alumni'] as const,
  list: (filters: AlumniFilters) => ['alumni', 'list', filters] as const,
  detail: (id: string) => ['alumni', 'detail', id] as const,
}

export function useAlumni(filters: AlumniFilters = {}) {
  return useQuery({
    queryKey: ALUMNI_KEYS.list(filters),
    queryFn: () => fetchAlumni(filters),
  })
}

export function useAlumniProfile(profileId: string) {
  return useQuery({
    queryKey: ALUMNI_KEYS.detail(profileId),
    queryFn: () => fetchAlumniProfile(profileId),
    enabled: !!profileId,
  })
}
