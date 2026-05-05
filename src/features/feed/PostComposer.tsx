import { useQuery } from '@tanstack/react-query'
import { useState, type KeyboardEvent } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { getSupabaseClient } from '../../lib/supabase'
import { useAuth } from '../auth/use-auth'
import { type CreatePostFormValues } from './post-schemas'
import { findOrCreateTags } from './tag-service'
import { FeedSurface, PostTypeTabs } from './feed-ui'
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
    const next = selectedTags.filter((item) => item !== tag)
    setSelectedTags(next)
    setValue('tagNames', next)
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  async function onSubmit(data: CreatePostFormValues) {
    try {
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
      // Mutation state surfaces the error.
    }
  }

  if (!session) return null

  return (
    <FeedSurface className="overflow-hidden p-4 sm:p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Composer</p>
            <h2 className="mt-1 text-lg font-black tracking-tight text-white">Share knowledge, ask for help</h2>
          </div>
          <PostTypeTabs value={postType} onChange={(next) => setValue('postType', next)} />
        </div>

        <div>
          <input
            {...register('title')}
            type="text"
            placeholder={postType === 'question' ? 'What do you want to ask?' : 'Title of your post'}
            className="w-full rounded-[22px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/30 focus:outline-none"
          />
          {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
        </div>

        <div>
          <textarea
            {...register('content')}
            rows={7}
            placeholder="Share a practical insight, ask a question, or tag an alumni expert..."
            className="min-h-[180px] w-full resize-none rounded-[28px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/30 focus:outline-none md:min-h-[220px]"
          />
          {errors.content && <p className="mt-1 text-xs text-red-400">{errors.content.message}</p>}
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
                .filter((tag) => !selectedTags.includes(tag.name))
                .map((tag) => (
                  <option key={tag.id} value={tag.name} />
                ))}
            </datalist>
          </div>
          {errors.tagNames && <p className="mt-1 text-xs text-red-400">{errors.tagNames.message}</p>}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          {createPost.error ? (
            <p className="text-xs text-red-400 sm:max-w-[60%]">
              {createPost.error instanceof Error ? createPost.error.message : 'Failed to create post.'}
            </p>
          ) : (
            <span className="text-xs text-slate-500">Posts appear immediately in the universal feed.</span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              disabled={isSubmitting || createPost.isPending}
              className="rounded-full border border-[#ffb95f] border-t-[#ffb95f] bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-950 px-5 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-50 shadow-[0_10px_24px_rgba(0,0,0,0.24)] transition hover:brightness-110 disabled:opacity-50"
            >
              {createPost.isPending ? 'Posting...' : 'Publish Post'}
            </button>
          </div>
        </div>
      </form>
    </FeedSurface>
  )
}