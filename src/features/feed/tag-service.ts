import { getSupabaseClient } from '../../lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────

export type TagRow = {
  id: string
  name: string
  slug: string
}

// ── Queries ────────────────────────────────────────────────────────────

/**
 * Fetch all available tags, ordered by name.
 */
export async function fetchTags(): Promise<TagRow[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('tags')
    .select('id, name, slug')
    .order('name')

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as TagRow[]
}

/**
 * Given an array of tag names, find existing tags or create new ones.
 * Returns the IDs for all resolved tags.
 */
export async function findOrCreateTags(names: string[]): Promise<string[]> {
  if (names.length === 0) return []

  const supabase = getSupabaseClient()
  const trimmed = names.map((n) => n.trim()).filter(Boolean)
  const slugs = trimmed.map(toSlug)

  // Fetch existing tags by slug
  const { data: existing, error: fetchError } = await supabase
    .from('tags')
    .select('id, slug')
    .in('slug', slugs)

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  const existingSlugs = new Set((existing ?? []).map((t: { slug: string }) => t.slug))
  const existingIds = (existing ?? []).map((t: { id: string }) => t.id)

  // Insert missing tags
  const toInsert = trimmed
    .filter((_, i) => !existingSlugs.has(slugs[i]))
    .map((name, i) => ({
      name,
      slug: slugs[trimmed.indexOf(name)] ?? toSlug(name),
    }))
    // Deduplicate by slug
    .filter((tag, index, self) => self.findIndex((t) => t.slug === tag.slug) === index)

  if (toInsert.length === 0) {
    return existingIds
  }

  const { data: inserted, error: insertError } = await supabase
    .from('tags')
    .insert(toInsert)
    .select('id')

  if (insertError) {
    throw new Error(insertError.message)
  }

  return [...existingIds, ...(inserted ?? []).map((t: { id: string }) => t.id)]
}

// ── Helpers ────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
