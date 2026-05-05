import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/use-auth'
import type { AppRole } from '../auth/profile-service'
import {
  blockUser,
  fetchAllFields,
  fetchAllUsers,
  fetchManagedComments,
  fetchManagedPosts,
  fetchModerationLog,
  manualAwardBadge,
  moderateComment,
  moderatePost,
  restoreComment,
  restorePost,
  revokeBadge,
  toggleField,
  unblockUser,
  updateUserRole,
  type ContentFilters,
  type UserFilters,
} from './moderation-service'

export type { ContentFilters, UserFilters } from './moderation-service'

// ── Query Keys ─────────────────────────────────────────────────────────

export const MODERATION_KEYS = {
  all: ['moderation'] as const,
  users: (filters: UserFilters) => ['moderation', 'users', filters] as const,
  posts: (filters: ContentFilters) => ['moderation', 'posts', filters] as const,
  comments: (filters: ContentFilters) => ['moderation', 'comments', filters] as const,
  log: (page: number) => ['moderation', 'log', page] as const,
  fields: ['moderation', 'fields'] as const,
}

// ── User Queries ───────────────────────────────────────────────────────

export function useAllUsers(filters: UserFilters) {
  const { session } = useAuth()
  const role = session?.user.role

  return useQuery({
    queryKey: MODERATION_KEYS.users(filters),
    queryFn: () => fetchAllUsers(filters),
    enabled: role === 'admin' || role === 'moderator',
  })
}

// ── Content Queries ────────────────────────────────────────────────────

export function useManagedPosts(filters: ContentFilters) {
  const { session } = useAuth()
  const role = session?.user.role

  return useQuery({
    queryKey: MODERATION_KEYS.posts(filters),
    queryFn: () => fetchManagedPosts(filters),
    enabled: role === 'admin' || role === 'moderator',
  })
}

export function useManagedComments(filters: ContentFilters) {
  const { session } = useAuth()
  const role = session?.user.role

  return useQuery({
    queryKey: MODERATION_KEYS.comments(filters),
    queryFn: () => fetchManagedComments(filters),
    enabled: role === 'admin' || role === 'moderator',
  })
}

// ── Moderation Log ─────────────────────────────────────────────────────

export function useModerationLog(page = 1) {
  const { session } = useAuth()
  const role = session?.user.role

  return useQuery({
    queryKey: MODERATION_KEYS.log(page),
    queryFn: () => fetchModerationLog(page),
    enabled: role === 'admin' || role === 'moderator',
  })
}

// ── Field Management ───────────────────────────────────────────────────

export function useAllFields() {
  const { session } = useAuth()
  const role = session?.user.role

  return useQuery({
    queryKey: MODERATION_KEYS.fields,
    queryFn: fetchAllFields,
    enabled: role === 'admin' || role === 'moderator',
  })
}

// ── Mutations ──────────────────────────────────────────────────────────

export function useBlockUser() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ targetId, reason }: { targetId: string; reason?: string }) =>
      blockUser(session!.user.id, targetId, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MODERATION_KEYS.all })
    },
  })
}

export function useUnblockUser() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ targetId, reason }: { targetId: string; reason?: string }) =>
      unblockUser(session!.user.id, targetId, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MODERATION_KEYS.all })
    },
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ targetId, role, reason }: { targetId: string; role: AppRole; reason?: string }) =>
      updateUserRole(session!.user.id, targetId, role, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MODERATION_KEYS.all })
    },
  })
}

export function useModeratePost() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ postId, action, reason }: { postId: string; action: 'hidden' | 'removed'; reason?: string }) =>
      moderatePost(session!.user.id, postId, action, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MODERATION_KEYS.all })
    },
  })
}

export function useRestorePost() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ postId, reason }: { postId: string; reason?: string }) =>
      restorePost(session!.user.id, postId, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MODERATION_KEYS.all })
    },
  })
}

export function useModerateComment() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ commentId, action, reason }: { commentId: string; action: 'hidden' | 'removed'; reason?: string }) =>
      moderateComment(session!.user.id, commentId, action, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MODERATION_KEYS.all })
    },
  })
}

export function useRestoreComment() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ commentId, reason }: { commentId: string; reason?: string }) =>
      restoreComment(session!.user.id, commentId, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MODERATION_KEYS.all })
    },
  })
}

export function useToggleField() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ fieldId, isActive }: { fieldId: string; isActive: boolean }) =>
      toggleField(session!.user.id, fieldId, isActive),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MODERATION_KEYS.all })
    },
  })
}

export function useAwardBadge() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ profileId, badgeId }: { profileId: string; badgeId: string }) =>
      manualAwardBadge(session!.user.id, profileId, badgeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MODERATION_KEYS.all })
    },
  })
}

export function useRevokeBadge() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ userBadgeId }: { userBadgeId: string }) =>
      revokeBadge(session!.user.id, userBadgeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MODERATION_KEYS.all })
    },
  })
}

// ── Convenience: check if current user is privileged ───────────────────

export function useIsPrivileged(): { isModerator: boolean; isAdmin: boolean } {
  const { session } = useAuth()
  const role = session?.user.role
  return {
    isModerator: role === 'moderator' || role === 'admin',
    isAdmin: role === 'admin',
  }
}
