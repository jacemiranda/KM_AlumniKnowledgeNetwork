import { getSupabaseClient } from '../../lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────

export type NotificationType = 'tagged_in_post' | 'new_comment' | 'badge_earned' | 'moderation_notice'

export type NotificationData = {
  title: string
  message: string
  icon_type: string
  action_url?: string
  actor_name?: string
}

export type Notification = {
  id: string
  user_id: string
  type: NotificationType
  actor_id: string | null
  related_post_id: string | null
  related_comment_id: string | null
  data: NotificationData
  is_read: boolean
  created_at: string
  read_at: string | null
}

export type NotificationWithActor = Notification & {
  actor?: {
    id: string
    name: string
    profile_picture_url: string | null
  }
}

export type NotificationPayload = {
  user_id: string
  type: NotificationType
  data: NotificationData
  actor_id?: string
  related_post_id?: string
  related_comment_id?: string
}

export type PaginatedNotifications = {
  notifications: NotificationWithActor[]
  total: number
  unread_count: number
}

type QueryError = {
  message: string
}

// ── Queries ────────────────────────────────────────────────────────────

const NOTIFICATION_SELECT = `
  id,
  user_id,
  type,
  actor_id,
  related_post_id,
  related_comment_id,
  data,
  is_read,
  created_at,
  read_at,
  actor:profiles!notifications_actor_id_fkey (
    id,
    name,
    profile_picture_url
  )
`

export async function fetchNotifications(
  userId: string,
  limit: number = 20,
  offset: number = 0,
  unreadOnly: boolean = false,
): Promise<PaginatedNotifications> {
  const supabase = getSupabaseClient()

  let query = supabase
    .from('notifications')
    .select(NOTIFICATION_SELECT, { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (unreadOnly) {
    query = query.eq('is_read', false)
  }

  const { data, error, count } = (await query) as {
    data: unknown[] | null
    error: QueryError | null
    count: number | null
  }

  if (error) {
    throw new Error(error.message)
  }

  const unreadCount = await fetchUnreadCount(userId)

  return {
    notifications: (data ?? []).map(normalizeNotification),
    total: count ?? 0,
    unread_count: unreadCount,
  }
}

export async function fetchUnreadCount(userId: string): Promise<number> {
  const supabase = getSupabaseClient()

  const { data, error } = (await supabase.rpc('count_unread_notifications', {
    user_id: userId,
  })) as {
    data: number | null
    error: QueryError | null
  }

  if (error) {
    console.error('Error fetching unread count:', error)
    return 0
  }

  return data ?? 0
}

export async function createNotification(payload: NotificationPayload): Promise<Notification> {
  const supabase = getSupabaseClient()

  const { data, error } = (await supabase
    .from('notifications')
    .insert({
      user_id: payload.user_id,
      type: payload.type,
      actor_id: payload.actor_id || null,
      related_post_id: payload.related_post_id || null,
      related_comment_id: payload.related_comment_id || null,
      data: payload.data,
    })
    .select(NOTIFICATION_SELECT)
    .single()) as {
    data: unknown | null
    error: QueryError | null
  }

  if (error) {
    throw new Error(error.message)
  }

  return normalizeNotification(data)
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const supabase = getSupabaseClient()

  const { error } = await supabase.rpc('mark_notification_read', {
    notification_id: notificationId,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const supabase = getSupabaseClient()

  const { error } = await supabase.rpc('mark_all_notifications_read', {
    user_id: userId,
  })

  if (error) {
    throw new Error(error.message)
  }
}

// ── Helpers ────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeNotification(raw: any): NotificationWithActor {
  return {
    id: raw.id,
    user_id: raw.user_id,
    type: raw.type,
    actor_id: raw.actor_id,
    related_post_id: raw.related_post_id,
    related_comment_id: raw.related_comment_id,
    data: raw.data ?? {},
    is_read: raw.is_read,
    created_at: raw.created_at,
    read_at: raw.read_at,
    actor: raw.actor
      ? Array.isArray(raw.actor)
        ? raw.actor[0]
        : raw.actor
      : undefined,
  }
}
