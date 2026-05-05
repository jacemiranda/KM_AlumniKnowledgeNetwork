import { getSupabaseClient } from '../../lib/supabase'
import type { AppRole, ProfileStatus } from '../auth/profile-service'
import type { ContentStatus } from '../feed/post-service'

// ── Types ──────────────────────────────────────────────────────────────

export type ModerationAction =
  | 'block_user'
  | 'unblock_user'
  | 'hide_post'
  | 'remove_post'
  | 'restore_post'
  | 'hide_comment'
  | 'remove_comment'
  | 'restore_comment'
  | 'change_role'
  | 'award_badge'
  | 'revoke_badge'
  | 'toggle_field'
  | 'create_field'
  | 'create_tag'

export type ManagedUser = {
  id: string
  email: string
  name: string
  bio: string | null
  profile_picture_url: string | null
  role: AppRole
  user_type: 'student' | 'alumni' | null
  status: ProfileStatus
  is_first_time_setup_complete: boolean
  created_at: string
  post_count: number
  comment_count: number
}

export type ManagedPost = {
  id: string
  title: string
  content: string
  status: ContentStatus
  post_type: 'information' | 'question'
  created_at: string
  author: { id: string; name: string }
  field: { id: string; name: string }
}

export type ManagedComment = {
  id: string
  content: string
  status: ContentStatus
  created_at: string
  post_id: string
  author: { id: string; name: string }
}

export type ModerationLogEntry = {
  id: string
  actor_id: string
  action: ModerationAction
  target_type: string
  target_id: string
  reason: string | null
  metadata: Record<string, unknown>
  created_at: string
  actor?: { id: string; name: string }
}

export type UserFilters = {
  search?: string
  role?: AppRole | ''
  status?: ProfileStatus | ''
  page?: number
  limit?: number
}

export type ContentFilters = {
  type?: 'posts' | 'comments'
  status?: ContentStatus | ''
  page?: number
  limit?: number
}

// ── User Management ───────────────────────────────────────────────────

export async function fetchAllUsers(
  filters: UserFilters = {},
): Promise<{ users: ManagedUser[]; total: number }> {
  const supabase = getSupabaseClient()
  const { search, role, status, page = 1, limit = 20 } = filters

  let query = supabase
    .from('profiles')
    .select('id, email, name, bio, profile_picture_url, role, user_type, status, is_first_time_setup_complete, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  if (role) {
    query = query.eq('role', role)
  }

  if (status) {
    query = query.eq('status', status)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error, count } = await query as { data: any[] | null; error: any; count: number | null }

  if (error) throw new Error(error.message)

  const profiles = data ?? []
  const ids = profiles.map((p) => p.id as string)

  // Bulk counts
  const [postCounts, commentCounts] = await Promise.all([
    bulkCount('posts', 'author_id', ids),
    bulkCount('comments', 'author_id', ids),
  ])

  const users: ManagedUser[] = profiles.map((p) => ({
    ...p,
    post_count: postCounts.get(p.id) ?? 0,
    comment_count: commentCounts.get(p.id) ?? 0,
  }))

  return { users, total: count ?? users.length }
}

export async function blockUser(actorId: string, targetId: string, reason?: string) {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('profiles')
    .update({ status: 'blocked' as ProfileStatus })
    .eq('id', targetId)

  if (error) throw new Error(error.message)

  await logAction(actorId, 'block_user', 'user', targetId, reason)

  // Create notification for blocked user
  try {
    await supabase
      .from('notifications')
      .insert({
        user_id: targetId,
        type: 'moderation_notice',
        actor_id: actorId,
        data: {
          title: 'Your account has been blocked',
          message: reason || 'Your account has been suspended.',
          icon_type: 'moderation',
          action_url: '/profile',
          actor_name: 'Moderator',
        },
      })
  } catch (notifError) {
    // Log but don't fail if notification fails
    console.error('Failed to create notification:', notifError)
  }
}

export async function unblockUser(actorId: string, targetId: string, reason?: string) {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('profiles')
    .update({ status: 'active' as ProfileStatus })
    .eq('id', targetId)

  if (error) throw new Error(error.message)

  await logAction(actorId, 'unblock_user', 'user', targetId, reason)

  // Create notification for unblocked user
  try {
    await supabase
      .from('notifications')
      .insert({
        user_id: targetId,
        type: 'moderation_notice',
        actor_id: actorId,
        data: {
          title: 'Your account has been restored',
          message: 'You can now use the platform again.',
          icon_type: 'moderation',
          action_url: '/profile',
          actor_name: 'Moderator',
        },
      })
  } catch (notifError) {
    // Log but don't fail if notification fails
    console.error('Failed to create notification:', notifError)
  }
}

export async function updateUserRole(actorId: string, targetId: string, newRole: AppRole, reason?: string) {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', targetId)

  if (error) throw new Error(error.message)

  await logAction(actorId, 'change_role', 'user', targetId, reason, { new_role: newRole })
}

// ── Content Moderation ────────────────────────────────────────────────

export async function fetchManagedPosts(
  filters: ContentFilters = {},
): Promise<{ posts: ManagedPost[]; total: number }> {
  const supabase = getSupabaseClient()
  const { status, page = 1, limit = 20 } = filters

  let query = supabase
    .from('posts')
    .select(`
      id, title, content, status, post_type, created_at,
      author:profiles!posts_author_id_fkey ( id, name ),
      field:fields!posts_field_id_fkey ( id, name )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status) {
    query = query.eq('status', status)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error, count } = await query as { data: any[] | null; error: any; count: number | null }

  if (error) throw new Error(error.message)

  const posts: ManagedPost[] = (data ?? []).map((row) => ({
    ...row,
    author: Array.isArray(row.author) ? row.author[0] : row.author,
    field: Array.isArray(row.field) ? row.field[0] : row.field,
  }))

  return { posts, total: count ?? posts.length }
}

export async function fetchManagedComments(
  filters: ContentFilters = {},
): Promise<{ comments: ManagedComment[]; total: number }> {
  const supabase = getSupabaseClient()
  const { status, page = 1, limit = 20 } = filters

  let query = supabase
    .from('comments')
    .select(`
      id, content, status, created_at, post_id,
      author:profiles!comments_author_id_fkey ( id, name )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status) {
    query = query.eq('status', status)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error, count } = await query as { data: any[] | null; error: any; count: number | null }

  if (error) throw new Error(error.message)

  const comments: ManagedComment[] = (data ?? []).map((row) => ({
    ...row,
    author: Array.isArray(row.author) ? row.author[0] : row.author,
  }))

  return { comments, total: count ?? comments.length }
}

export async function moderatePost(actorId: string, postId: string, action: 'hidden' | 'removed', reason?: string) {
  const supabase = getSupabaseClient()

  // Fetch post author
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .select('author_id, title')
    .eq('id', postId)
    .single()

  if (postError) throw postError

  const { error } = await supabase
    .from('posts')
    .update({ status: action as ContentStatus })
    .eq('id', postId)

  if (error) throw new Error(error.message)

  const logAction_ = action === 'hidden' ? 'hide_post' : 'remove_post'
  await logAction(actorId, logAction_ as ModerationAction, 'post', postId, reason)

  // Create notification for post author
  try {
    await supabase
      .from('notifications')
      .insert({
        user_id: postData.author_id,
        type: 'moderation_notice',
        actor_id: actorId,
        related_post_id: postId,
        data: {
          title: action === 'hidden' ? 'Post hidden' : 'Post removed',
          message: postData.title,
          icon_type: 'moderation',
          action_url: `/post/${postId}`,
          actor_name: 'Moderator',
        },
      })
  } catch (notifError) {
    // Log but don't fail if notification fails
    console.error('Failed to create notification:', notifError)
  }
}

export async function restorePost(actorId: string, postId: string, reason?: string) {
  const supabase = getSupabaseClient()

  // Fetch post author
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .select('author_id, title')
    .eq('id', postId)
    .single()

  if (postError) throw postError

  const { error } = await supabase
    .from('posts')
    .update({ status: 'published' as ContentStatus })
    .eq('id', postId)

  if (error) throw new Error(error.message)

  await logAction(actorId, 'restore_post', 'post', postId, reason)

  // Create notification for post author
  try {
    await supabase
      .from('notifications')
      .insert({
        user_id: postData.author_id,
        type: 'moderation_notice',
        actor_id: actorId,
        related_post_id: postId,
        data: {
          title: 'Post restored',
          message: postData.title,
          icon_type: 'moderation',
          action_url: `/post/${postId}`,
          actor_name: 'Moderator',
        },
      })
  } catch (notifError) {
    // Log but don't fail if notification fails
    console.error('Failed to create notification:', notifError)
  }
}

export async function moderateComment(actorId: string, commentId: string, action: 'hidden' | 'removed', reason?: string) {
  const supabase = getSupabaseClient()

  // Fetch comment author
  const { data: commentData, error: commentError } = await supabase
    .from('comments')
    .select('author_id, post_id, content')
    .eq('id', commentId)
    .single()

  if (commentError) throw commentError

  const { error } = await supabase
    .from('comments')
    .update({ status: action as ContentStatus })
    .eq('id', commentId)

  if (error) throw new Error(error.message)

  const logAction_ = action === 'hidden' ? 'hide_comment' : 'remove_comment'
  await logAction(actorId, logAction_ as ModerationAction, 'comment', commentId, reason)

  // Create notification for comment author
  try {
    await supabase
      .from('notifications')
      .insert({
        user_id: commentData.author_id,
        type: 'moderation_notice',
        actor_id: actorId,
        related_post_id: commentData.post_id,
        related_comment_id: commentId,
        data: {
          title: action === 'hidden' ? 'Comment hidden' : 'Comment removed',
          message: commentData.content.substring(0, 100),
          icon_type: 'moderation',
          action_url: `/post/${commentData.post_id}#comment-${commentId}`,
          actor_name: 'Moderator',
        },
      })
  } catch (notifError) {
    // Log but don't fail if notification fails
    console.error('Failed to create notification:', notifError)
  }
}

export async function restoreComment(actorId: string, commentId: string, reason?: string) {
  const supabase = getSupabaseClient()

  // Fetch comment author
  const { data: commentData, error: commentError } = await supabase
    .from('comments')
    .select('author_id, post_id, content')
    .eq('id', commentId)
    .single()

  if (commentError) throw commentError

  const { error } = await supabase
    .from('comments')
    .update({ status: 'published' as ContentStatus })
    .eq('id', commentId)

  if (error) throw new Error(error.message)

  await logAction(actorId, 'restore_comment', 'comment', commentId, reason)

  // Create notification for comment author
  try {
    await supabase
      .from('notifications')
      .insert({
        user_id: commentData.author_id,
        type: 'moderation_notice',
        actor_id: actorId,
        related_post_id: commentData.post_id,
        related_comment_id: commentId,
        data: {
          title: 'Comment restored',
          message: commentData.content.substring(0, 100),
          icon_type: 'moderation',
          action_url: `/post/${commentData.post_id}#comment-${commentId}`,
          actor_name: 'Moderator',
        },
      })
  } catch (notifError) {
    // Log but don't fail if notification fails
    console.error('Failed to create notification:', notifError)
  }
}

// ── Field & Tag Management ──────────────────────────────────────────────

export async function createField(actorId: string, name: string) {
  const supabase = getSupabaseClient()
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const { data, error } = await supabase
    .from('fields')
    .insert({ name, slug, is_active: true })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  await logAction(actorId, 'create_field', 'field', data.id, undefined, { name })
  return data
}

export async function createTag(actorId: string, name: string) {
  const supabase = getSupabaseClient()
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const { data, error } = await supabase
    .from('tags')
    .insert({ name, slug })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  await logAction(actorId, 'create_tag', 'tag', data.id, undefined, { name })
  return data
}

export async function toggleField(actorId: string, fieldId: string, isActive: boolean) {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('fields')
    .update({ is_active: isActive })
    .eq('id', fieldId)

  if (error) throw new Error(error.message)

  await logAction(actorId, 'toggle_field', 'field', fieldId, undefined, { is_active: isActive })
}

export async function fetchAllFields() {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('fields')
    .select('id, name, slug, is_active, created_at')
    .order('name')

  if (error) throw new Error(error.message)

  return data as Array<{ id: string; name: string; slug: string; is_active: boolean; created_at: string }>
}

// ── Badge Management ──────────────────────────────────────────────────

export async function manualAwardBadge(actorId: string, profileId: string, badgeId: string) {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('user_badges')
    .insert({ profile_id: profileId, badge_id: badgeId, awarded_by: actorId })

  if (error) throw new Error(error.message)

  await logAction(actorId, 'award_badge', 'badge', badgeId, undefined, { profile_id: profileId })
}

export async function revokeBadge(actorId: string, userBadgeId: string) {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('user_badges')
    .delete()
    .eq('id', userBadgeId)

  if (error) throw new Error(error.message)

  await logAction(actorId, 'revoke_badge', 'badge', userBadgeId)
}

// ── Moderation Log ────────────────────────────────────────────────────

export async function fetchModerationLog(
  page = 1,
  limit = 30,
): Promise<{ entries: ModerationLogEntry[]; total: number }> {
  const supabase = getSupabaseClient()

  const { data, error, count } = await supabase
    .from('moderation_log')
    .select(`
      id, actor_id, action, target_type, target_id, reason, metadata, created_at,
      actor:profiles!moderation_log_actor_id_fkey ( id, name )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1) as {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: any[] | null; error: any; count: number | null
    }

  if (error) throw new Error(error.message)

  const entries: ModerationLogEntry[] = (data ?? []).map((row) => ({
    ...row,
    actor: Array.isArray(row.actor) ? row.actor[0] : row.actor,
  }))

  return { entries, total: count ?? entries.length }
}

// ── Helpers ────────────────────────────────────────────────────────────

async function logAction(
  actorId: string,
  action: ModerationAction,
  targetType: string,
  targetId: string,
  reason?: string,
  metadata?: Record<string, unknown>,
) {
  const supabase = getSupabaseClient()

  await supabase.from('moderation_log').insert({
    actor_id: actorId,
    action,
    target_type: targetType,
    target_id: targetId,
    reason: reason ?? null,
    metadata: metadata ?? {},
  })
}

async function bulkCount(
  tableName: 'posts' | 'comments',
  column: string,
  ids: string[],
): Promise<Map<string, number>> {
  const m = new Map<string, number>()
  if (ids.length === 0) return m
  const supabase = getSupabaseClient()

  const { data } = await supabase
    .from(tableName)
    .select(column)
    .in(column, ids)

  for (const r of data ?? []) {
    const id = (r as unknown as Record<string, string>)[column]
    m.set(id, (m.get(id) ?? 0) + 1)
  }
  return m
}
