import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createNotification,
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationPayload,
} from './notification-service'

// ── Query Keys ─────────────────────────────────────────────────────────

const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  lists: () => [...NOTIFICATION_KEYS.all, 'list'] as const,
  list: (userId: string, limit?: number, offset?: number, unreadOnly?: boolean) =>
    [...NOTIFICATION_KEYS.lists(), { userId, limit, offset, unreadOnly }] as const,
  counts: () => [...NOTIFICATION_KEYS.all, 'count'] as const,
  count: (userId: string) => [...NOTIFICATION_KEYS.counts(), userId] as const,
  details: () => [...NOTIFICATION_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...NOTIFICATION_KEYS.details(), id] as const,
}

// ── Hooks ──────────────────────────────────────────────────────────────

export function useNotifications(
  userId: string | undefined,
  limit: number = 20,
  offset: number = 0,
  unreadOnly: boolean = false,
) {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(userId!, limit, offset, unreadOnly),
    queryFn: () => fetchNotifications(userId!, limit, offset, unreadOnly),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useNotificationDropdown(userId: string | undefined) {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(userId!, 10, 0, false),
    queryFn: () => fetchNotifications(userId!, 10, 0, false),
    enabled: !!userId,
    staleTime: 30 * 1000,
  })
}

export function useUnreadNotificationCount(userId: string | undefined) {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.count(userId!),
    queryFn: () => fetchUnreadCount(userId!),
    enabled: !!userId,
    staleTime: 10 * 1000, // 10 seconds for badge freshness
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

export function useCreateNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: NotificationPayload) => createNotification(payload),
    onSuccess: () => {
      // Invalidate both list and count queries to reflect new notification
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.counts(),
      })
    },
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationRead(notificationId),
    onSuccess: () => {
      // Invalidate both list and count queries
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.counts(),
      })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => markAllNotificationsRead(userId),
    onSuccess: () => {
      // Invalidate both list and count queries
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.counts(),
      })
    },
  })
}
