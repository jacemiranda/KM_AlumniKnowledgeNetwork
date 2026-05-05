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
  author: { id: string; name: string; profile_picture_url: string | null; user_type: string | null }
  field: { id: string; name: string }
  post_tags: Array<{ tag: { id: string; name: string } }>
  tagged_alumni: { id: string; name: string } | null
  comment_count: number
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
}

type QueryError = {
  message: string
}

export type CreatePostInput = {
  title: string
  content: string
  fieldId: string
  postType: PostType
  tagIds: string[]
  taggedAlumniId?: string | null
}

export type PostFilters = {
  fieldId?: string
  postType?: PostType
  tagId?: string
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
  author:profiles!posts_author_id_fkey ( id, name, profile_picture_url, user_type ),
  field:fields!posts_field_id_fkey ( id, name ),
  post_tags ( tag:tags ( id, name ) ),
  tagged_alumni:profiles!posts_tagged_alumni_id_fkey ( id, name )
`

export async function fetchPosts(filters: PostFilters = {}) {
  const supabase = getSupabaseClient()
  const { fieldId, postType, tagId, page = 1, limit = 20 } = filters

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

  // Attach comment counts
  const postIdList = (data ?? []).map((p: { id: string }) => p.id)
  const commentCounts = await getCommentCounts(postIdList)

  const posts: PostWithRelations[] = (data ?? []).map((raw) => ({
    ...normalizePost(raw),
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

  // Attach comment count
  const commentCounts = await getCommentCounts([data.id])

  return {
    ...normalizePost(data),
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
    throw new Error(postError.message)
  }

  // Attach tags
  if (input.tagIds.length > 0) {
    const tagRows = input.tagIds.map((tagId) => ({
      post_id: post.id,
      tag_id: tagId,
    }))

    const { error: tagError } = await supabase.from('post_tags').insert(tagRows)

    if (tagError) {
      throw new Error(tagError.message)
    }
  }

  return post as { id: string }
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
function normalizePost(raw: RawPostWithRelations): Omit<PostWithRelations, 'comment_count'> {
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
