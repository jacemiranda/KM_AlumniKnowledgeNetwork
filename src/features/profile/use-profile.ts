import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSupabaseClient } from '../../lib/supabase'
import { useAuth } from '../auth/use-auth'
import { updateProfile } from '../auth/profile-service'
import { PROFILE_KEYS as METRICS_KEYS } from './use-profile-metrics'

// ── Query Key Factory ──────────────────────────────────────────────────

export const PROFILE_KEYS = {
  all: ['profile'] as const,
  current: () => [...PROFILE_KEYS.all, 'current'] as const,
  userId: (userId: string) => [...PROFILE_KEYS.current(), userId] as const,
  skills: () => [...PROFILE_KEYS.all, 'skills'] as const,
  fields: () => [...PROFILE_KEYS.all, 'fields'] as const,
}

// ── Types ──────────────────────────────────────────────────────────────

export type UpdateProfilePayload = {
  name?: string
  bio?: string | null
  fieldId?: string
  profilePictureUrl?: string | null
  skillIds?: string[]
}

// ── Hooks ──────────────────────────────────────────────────────────────

/**
 * Mutation for updating the current user's profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { session, refreshProfile } = useAuth()

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      if (!session?.user?.id) {
        throw new Error('User not authenticated')
      }

      const supabase = getSupabaseClient()
      await updateProfile(supabase, session.user.id, payload)

      // Fetch updated profile data
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .select(
          'id,email,role,user_type,status,is_first_time_setup_complete,name,bio,profile_picture_url,field_id'
        )
        .eq('id', session.user.id)
        .maybeSingle()

      if (error) throw error
      return updatedProfile
    },
    onSuccess: () => {
      // Invalidate related queries
      if (session?.user?.id) {
        queryClient.invalidateQueries({
          queryKey: PROFILE_KEYS.userId(session.user.id),
        })
        
        // Also invalidate the profile metrics so ProfilePage updates immediately
        queryClient.invalidateQueries({
          queryKey: METRICS_KEYS.detail(session.user.id, session.user.id),
        })
        
        // As well as general detail for any viewer
        queryClient.invalidateQueries({
          queryKey: ['profiles', 'detail', session.user.id],
        })

        // Refresh global AuthContext profile so App shell data (nav bar etc) updates
        if (refreshProfile) {
          // Await to ensure context is updated before `onSuccess` from the mutation is finalized if any await is used outside.
          // However refreshProfile returns a Promise. 
          refreshProfile()
        }
      }
    },
  })
}

/**
 * Hook to fetch all skills (for skill selection in forms)
 */
export function useSkillsList() {
  return useQuery({
    queryKey: PROFILE_KEYS.skills(),
    queryFn: async () => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('skills')
        .select('id, name')
        .order('name')

      if (error) throw new Error(error.message)
      return data as Array<{ id: string; name: string }>
    },
  })
}

/**
 * Hook to fetch all fields (for field selection in forms)
 */
export function useFieldsList() {
  return useQuery({
    queryKey: PROFILE_KEYS.fields(),
    queryFn: async () => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('fields')
        .select('id, name')
        .eq('is_active', true)
        .order('name')

      if (error) throw new Error(error.message)
      return data as Array<{ id: string; name: string }>
    },
  })
}
