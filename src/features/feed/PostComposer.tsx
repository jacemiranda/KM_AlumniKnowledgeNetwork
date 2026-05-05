import { useQuery } from '@tanstack/react-query'
import { useState, type KeyboardEvent } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { getSupabaseClient } from '../../lib/supabase'
import { useAuth } from '../auth/use-auth'
import { type CreatePostFormValues } from './post-schemas'
import { findOrCreateTags } from './tag-service'
import { useCreatePost } from './use-posts'
import { useTags } from './use-tags'

export function PostComposer({ onSuccess }: { onSuccess?: () => void }) {
  const { session } = useAuth()
  const createPost = useCreatePost()
  const [tagInput, setTagInput] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const { data: fieldOptions } = useQuery({
    queryKey: ['fields-list'],
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

  const { data: existingTags } = useTags()

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostFormValues>({
    defaultValues: {
      title: '',
      content: '',
      fieldId: '',
      postType: 'information',
      tagNames: [],
      taggedAlumniId: null,
    },
  })

  const postType = useWatch({ control, name: 'postType' })

  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (trimmed && !selectedTags.includes(trimmed) && selectedTags.length < 10) {
      const next = [...selectedTags, trimmed]
      setSelectedTags(next)
      setValue('tagNames', next)
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    const next = selectedTags.filter((t) => t !== tag)
    setSelectedTags(next)
    setValue('tagNames', next)
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  async function onSubmit(data: CreatePostFormValues) {
    try {
      // Resolve tag names to IDs
      const tagIds = await findOrCreateTags(data.tagNames)

      await createPost.mutateAsync({
        title: data.title,
        content: data.content,
        fieldId: data.fieldId,
        postType: data.postType,
        tagIds,
        taggedAlumniId: data.taggedAlumniId,
      })

      reset()
      setSelectedTags([])
      setTagInput('')
      onSuccess?.()
    } catch {
      // Error is handled by mutation state
    }
  }

  if (!session) return null

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-liquid backdrop-blur-2xl sm:p-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Post Type Selector */}
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setValue('postType', 'information')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition ${
              postType === 'information'
                ? 'border border-emerald-300/40 bg-emerald-300/15 text-emerald-100'
                : 'border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            Information
          </button>
          <button
            type="button"
            onClick={() => setValue('postType', 'question')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition ${
              postType === 'question'
                ? 'border border-amber-300/40 bg-amber-300/15 text-amber-100'
                : 'border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            Question
          </button>
        </div>

        {/* Title */}
        <div className="mb-3">
          <input
            {...register('title')}
            type="text"
            placeholder={postType === 'question' ? 'What do you want to ask?' : 'Title of your post'}
            className="w-full rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/30 focus:outline-none"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
          )}
        </div>

        {/* Content */}
        <div className="mb-3">
          <textarea
            {...register('content')}
            rows={4}
            placeholder="Share a practical insight, ask a question, or tag an alumni expert..."
            className="w-full resize-none rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/30 focus:outline-none"
          />
          {errors.content && (
            <p className="mt-1 text-xs text-red-400">{errors.content.message}</p>
          )}
        </div>

        <div>
          <select
            {...register('fieldId')}
            className="w-full rounded-[22px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-emerald-300/30 focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled>
              Select a field...
            </option>
            {(fieldOptions ?? []).map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>
          {errors.fieldId && <p className="mt-1 text-xs text-red-400">{errors.fieldId.message}</p>}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 rounded-[24px] border border-white/10 bg-black/20 px-4 py-3">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={selectedTags.length === 0 ? 'Add tags (press Enter)...' : ''}
              className="min-w-[120px] flex-1 bg-transparent py-1 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              list="tag-suggestions"
            />
            <datalist id="tag-suggestions">
              {(existingTags ?? [])
                .filter((t) => !selectedTags.includes(t.name))
                .map((t) => (
                  <option key={t.id} value={t.name} />
                ))}
            </datalist>
          </div>
          {errors.tagNames && <p className="mt-1 text-xs text-red-400">{errors.tagNames.message}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          {createPost.error && (
            <p className="text-xs text-red-400">
              {createPost.error instanceof Error ? createPost.error.message : 'Failed to create post.'}
            </p>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              disabled={isSubmitting || createPost.isPending}
              className="rounded-full border border-emerald-300/40 bg-emerald-300/15 px-5 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-100 transition hover:bg-emerald-300/25 disabled:opacity-50"
            >
              {createPost.isPending ? 'Posting...' : 'Publish Post'}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
