import { getSupabaseClient } from '../../lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────

export type PostType = 'information' | 'question'
export type ContentStatus = 'published' | 'hidden' | 'removed'

export type PostRow = {
  id: string
  author_id: string
  title: string
  content: string
  field_id: string
  post_type: PostType
  tagged_alumni_id: string | null
  status: ContentStatus
  created_at: string
  updated_at: string
}

export type PostWithRelations = PostRow & {
  author: { id: string; name: string; profile_picture_url: string | null; user_type: string | null; role: string }
  field: { id: string; name: string }
  post_tags: Array<{ tag: { id: string; name: string } }>
  tagged_alumni: { id: string; name: string } | null
  comment_count: number
  authority_score: number
  upvote_count: number
  downvote_count: number
  my_vote: number
}

type PostAuthor = PostWithRelations['author']
type PostField = PostWithRelations['field']
type PostTag = PostWithRelations['post_tags'][number]
type TaggedAlumni = NonNullable<PostWithRelations['tagged_alumni']>

type RawPostWithRelations = PostRow & {
  author: PostAuthor | PostAuthor[]
  field: PostField | PostField[]
  post_tags: PostTag[]
  tagged_alumni: TaggedAlumni | TaggedAlumni[] | null
  post_votes: { value: number; voter_id: string }[] | null
}

type QueryError = {
  message: string
}

// ── Error Handling ────────────────────────────────────────────────────

/**
 * Convert database constraint violations to user-friendly messages
 */
function getDbErrorMessage(error: QueryError): string {
  const msg = error.message || ''
  
  if (msg.includes('posts_title_check')) {
    return 'Please provide a title for your post'
  }
  if (msg.includes('posts_content_check')) {
    return 'Please provide content for your post'
  }
  if (msg.includes('field_id') && msg.includes('foreign key')) {
    return 'Please select a valid field'
  }
  if (msg.includes('post_type')) {
    return 'Please select a valid post type'
  }
  if (msg.includes('duplicate')) {
    return 'This post already exists'
  }
  
  // Default fallback
  return 'Failed to create post. Please try again.'
}

export type CreatePostInput = {
  title: string
  content: string
  fieldId: string
  postType: PostType
  tagIds: string[]
  taggedAlumniId?: string | null
}

export type UpdatePostInput = CreatePostInput

export type PostFilters = {
  fieldId?: string
  postType?: PostType
  tagId?: string
  authorId?: string
  taggedAlumniId?: string
  page?: number
  limit?: number
}

// ── Queries ────────────────────────────────────────────────────────────

const POST_SELECT = `
  id,
  author_id,
  title,
  content,
  field_id,
  post_type,
  tagged_alumni_id,
  status,
  created_at,
  updated_at,
  author:profiles!posts_author_id_fkey ( id, name, profile_picture_url, user_type, role ),
  field:fields!posts_field_id_fkey ( id, name ),
  post_tags ( tag:tags ( id, name ) ),
  tagged_alumni:profiles!posts_tagged_alumni_id_fkey ( id, name ),
  post_votes ( value, voter_id )
`

export async function fetchPosts(filters: PostFilters = {}) {
  const supabase = getSupabaseClient()
  const { fieldId, postType, tagId, authorId, taggedAlumniId, page = 1, limit = 20 } = filters

  let query = supabase
    .from('posts')
    .select(POST_SELECT, { count: 'exact' })
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (fieldId) {
    query = query.eq('field_id', fieldId)
  }

  if (postType) {
    query = query.eq('post_type', postType)
  }

  if (authorId) {
    query = query.eq('author_id', authorId)
  }

  if (taggedAlumniId) {
    query = query.eq('tagged_alumni_id', taggedAlumniId)
  }

  if (tagId) {
    // Filter posts that contain the given tag via post_tags junction
    const { data: postIds } = await supabase
      .from('post_tags')
      .select('post_id')
      .eq('tag_id', tagId)

    const ids = postIds?.map((row: { post_id: string }) => row.post_id) ?? []
    if (ids.length === 0) {
      return { posts: [] as PostWithRelations[], total: 0 }
    }
    query = query.in('id', ids)
  }

  const { data, error, count } = await query as {
    data: RawPostWithRelations[] | null
    error: QueryError | null
    count: number | null
  }

  if (error) {
    throw new Error(error.message)
  }

  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  // Attach comment counts
  const postIdList = (data ?? []).map((p: { id: string }) => p.id)
  const commentCounts = await getCommentCounts(postIdList)

  const posts: PostWithRelations[] = (data ?? []).map((raw) => ({
    ...normalizePost(raw, currentUserId),
    comment_count: commentCounts.get(raw.id) ?? 0,
  }))

  return { posts, total: count ?? 0 }
}

export async function fetchPostById(postId: string): Promise<PostWithRelations> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('id', postId)
    .single() as { data: RawPostWithRelations | null; error: QueryError | null }

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error('Post not found.')
  }

  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  // Attach comment count
  const commentCounts = await getCommentCounts([data.id])

  return {
    ...normalizePost(data, currentUserId),
    comment_count: commentCounts.get(data.id) ?? 0,
  }
}

export async function createPost(userId: string, input: CreatePostInput) {
  const supabase = getSupabaseClient()

  const { data: post, error: postError } = await supabase
    .from('posts')
    .insert({
      author_id: userId,
      title: input.title,
      content: input.content,
      field_id: input.fieldId,
      post_type: input.postType,
      tagged_alumni_id: input.taggedAlumniId || null,
    })
    .select('id')
    .single()

  if (postError) {
    throw new Error(getDbErrorMessage(postError))
  }

  // Attach tags
  if (input.tagIds.length > 0) {
    const tagRows = input.tagIds.map((tagId) => ({
      post_id: post.id,
      tag_id: tagId,
    }))

    const { error: tagError } = await supabase.from('post_tags').insert(tagRows)

    if (tagError) {
      throw new Error('Failed to attach tags. Please try again.')
    }
  }

  // Create notification if alumni is tagged
  if (input.taggedAlumniId && input.taggedAlumniId !== userId) {
    try {
      // Fetch author profile
      const { data: authorData, error: authorError } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', userId)
        .single()

      if (authorError) throw authorError

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: input.taggedAlumniId,
          type: 'tagged_in_post',
          actor_id: userId,
          related_post_id: post.id,
          data: {
            title: 'You were tagged in a post',
            message: input.title,
            icon_type: 'tagged',
            action_url: `/post/${post.id}`,
            actor_name: authorData.name,
          },
        })
    } catch (notifError) {
      // Log but don't fail the post creation if notification fails
      console.error('Failed to create notification:', notifError)
    }
  }

  return post as { id: string }
}

export async function updatePost(postId: string, input: UpdatePostInput) {
  const supabase = getSupabaseClient()

  const { error: postError } = await supabase
    .from('posts')
    .update({
      title: input.title,
      content: input.content,
      field_id: input.fieldId,
      post_type: input.postType,
      tagged_alumni_id: input.taggedAlumniId || null,
    })
    .eq('id', postId)

  if (postError) {
    throw new Error(getDbErrorMessage(postError))
  }

  const { error: deleteError } = await supabase
    .from('post_tags')
    .delete()
    .eq('post_id', postId)

  if (deleteError) {
    throw new Error('Failed to update tags. Please try again.')
  }

  if (input.tagIds.length > 0) {
    const tagRows = input.tagIds.map((tagId) => ({
      post_id: postId,
      tag_id: tagId,
    }))

    const { error: insertError } = await supabase.from('post_tags').insert(tagRows)

    if (insertError) {
      throw new Error('Failed to update tags. Please try again.')
    }
  }
}

export async function deletePost(postId: string) {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('posts')
    .update({ status: 'removed' as ContentStatus })
    .eq('id', postId)

  if (error) {
    throw new Error(error.message)
  }
}

// ── Helpers ────────────────────────────────────────────────────────────

/**
 * Supabase returns FK joins as arrays for single relations.
 * This normalizes the raw row into our typed shape.
 */
function normalizePost(raw: RawPostWithRelations, currentUserId?: string): Omit<PostWithRelations, 'comment_count'> {
  const votes = raw.post_votes ?? []
  const authority_score = votes.reduce((sum, vote) => sum + vote.value, 0)
  const upvote_count = votes.filter((v) => v.value === 1).length
  const downvote_count = votes.filter((v) => v.value === -1).length
  const my_vote = currentUserId
    ? votes.find((v) => v.voter_id === currentUserId)?.value ?? 0
    : 0

  return {
    id: raw.id,
    author_id: raw.author_id,
    title: raw.title,
    content: raw.content,
    field_id: raw.field_id,
    post_type: raw.post_type,
    tagged_alumni_id: raw.tagged_alumni_id,
    status: raw.status,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    author: Array.isArray(raw.author) ? raw.author[0] : raw.author,
    field: Array.isArray(raw.field) ? raw.field[0] : raw.field,
    post_tags: raw.post_tags ?? [],
    tagged_alumni: Array.isArray(raw.tagged_alumni)
      ? raw.tagged_alumni[0] ?? null
      : raw.tagged_alumni ?? null,
    authority_score,
    upvote_count,
    downvote_count,
    my_vote,
  }
}

async function getCommentCounts(postIds: string[]): Promise<Map<string, number>> {
  const counts = new Map<string, number>()
  if (postIds.length === 0) return counts

  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('comments')
    .select('post_id')
    .in('post_id', postIds)
    .eq('status', 'published')

  if (error) return counts

  for (const row of data ?? []) {
    const current = counts.get(row.post_id) ?? 0
    counts.set(row.post_id, current + 1)
  }

  return counts
}
