import { useCallback, useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { getSupabaseClient } from '../../lib/supabase'
import { useAuth } from '../auth/use-auth'
import { type EditPostFormValues } from './post-schemas'
import { findOrCreateTags } from './tag-service'
import { useUpdatePost } from './use-posts'

type EditPostFormProps = {
  postId: string
  initialValues: {
    title: string
    content: string
    fieldId: string
    postType: 'information' | 'question'
    tagNames: string[]
    taggedAlumniId?: string | null
    taggedAlumniName?: string | null
  }
  onCancel: () => void
  onSuccess?: () => void
}

type AlumniOption = {
  id: string
  name: string
  profile_picture_url: string | null
}

export function EditPostForm({ postId, initialValues, onCancel, onSuccess }: EditPostFormProps) {
  const { session } = useAuth()
  const updatePost = useUpdatePost()
  const [tagInput, setTagInput] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>(() => initialValues.tagNames)
  const [alumniSearch, setAlumniSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedAlumni, setSelectedAlumni] = useState<{ id: string; name: string } | null>(
    initialValues.taggedAlumniId && initialValues.taggedAlumniName
      ? { id: initialValues.taggedAlumniId, name: initialValues.taggedAlumniName }
      : null,
  )
  const [showAlumniDropdown, setShowAlumniDropdown] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(alumniSearch), 300)
    return () => clearTimeout(timer)
  }, [alumniSearch])

  const { data: alumniResults } = useQuery({
    queryKey: ['alumni-search', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return []
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, profile_picture_url')
        .eq('user_type', 'alumni')
        .eq('status', 'active')
        .ilike('name', `%${debouncedSearch}%`)
        .limit(6)
      if (error) return []
      return data as AlumniOption[]
    },
    enabled: debouncedSearch.length >= 2,
  })

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

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditPostFormValues>({
    defaultValues: {
      title: initialValues.title,
      content: initialValues.content,
      fieldId: initialValues.fieldId,
      postType: initialValues.postType,
      tagNames: initialValues.tagNames,
      taggedAlumniId: initialValues.taggedAlumniId ?? null,
    },
  })

  useEffect(() => {
    reset({
      title: initialValues.title,
      content: initialValues.content,
      fieldId: initialValues.fieldId,
      postType: initialValues.postType,
      tagNames: initialValues.tagNames,
      taggedAlumniId: initialValues.taggedAlumniId ?? null,
    })
    setSelectedTags(initialValues.tagNames)
    setSelectedAlumni(
      initialValues.taggedAlumniId && initialValues.taggedAlumniName
        ? { id: initialValues.taggedAlumniId, name: initialValues.taggedAlumniName }
        : null,
    )
  }, [initialValues, reset])

  const postType = useWatch({ control, name: 'postType' })

  const handleDropdownBlur = useCallback(() => {
    setTimeout(() => setShowAlumniDropdown(false), 200)
  }, [])

  function selectAlumni(alumni: { id: string; name: string }) {
    setSelectedAlumni(alumni)
    setValue('taggedAlumniId', alumni.id)
    setAlumniSearch('')
    setShowAlumniDropdown(false)
  }

  function clearAlumni() {
    setSelectedAlumni(null)
    setValue('taggedAlumniId', null)
  }

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

  async function onSubmit(data: EditPostFormValues) {
    try {
      const tagIds = await findOrCreateTags(data.tagNames)

      await updatePost.mutateAsync({
        postId,
        input: {
          title: data.title,
          content: data.content,
          fieldId: data.fieldId,
          postType: data.postType,
          tagIds,
          taggedAlumniId: data.taggedAlumniId,
        },
      })

      onSuccess?.()
    } catch {
      // Error is handled by mutation state
    }
  }

  if (!session) return null

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-liquid backdrop-blur-2xl sm:p-5">
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <select
            {...register('fieldId')}
            className="custom-select w-full rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-white focus:border-emerald-300/30 focus:outline-none"
          >
            <option value="">Select a field...</option>
            {(fieldOptions ?? []).map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>

          <div className="relative">
            {selectedAlumni ? (
              <div className="flex items-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-cyan-300">
                  <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                </svg>
                <span className="flex-1 truncate text-sm font-semibold text-cyan-100">
                  {selectedAlumni.name}
                </span>
                <button
                  type="button"
                  onClick={clearAlumni}
                  className="text-cyan-300/60 transition hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={alumniSearch}
                  onChange={(e) => {
                    setAlumniSearch(e.target.value)
                    setShowAlumniDropdown(true)
                  }}
                  onFocus={() => alumniSearch.length >= 2 && setShowAlumniDropdown(true)}
                  onBlur={handleDropdownBlur}
                  placeholder="Tag an alumni expert..."
                  className="w-full rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/30 focus:outline-none"
                />

                {showAlumniDropdown && (alumniResults ?? []).length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 shadow-xl backdrop-blur-2xl">
                    {(alumniResults ?? []).map((alumni) => (
                      <button
                        key={alumni.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectAlumni(alumni)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-white/5 cursor-pointer"
                      >
                        {alumni.profile_picture_url ? (
                          <img
                            src={alumni.profile_picture_url}
                            alt={alumni.name}
                            className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10"
                          />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400/20 text-[10px] font-bold text-cyan-200 ring-1 ring-white/10">
                            {alumni.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                        )}
                        <span className="truncate text-sm text-slate-200">{alumni.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {errors.fieldId && (
          <p className="-mt-2 mb-3 text-xs text-red-400">{errors.fieldId.message}</p>
        )}

        <div className="mb-3">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-2">
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
              placeholder="Add tags and press Enter"
              className="flex-1 bg-transparent py-2 text-xs text-slate-200 outline-none placeholder:text-slate-500"
            />
          </div>
          {errors.tagNames && (
            <p className="mt-1 text-xs text-red-400">{errors.tagNames.message}</p>
          )}
        </div>

        {updatePost.error && (
          <div className="mb-3 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3">
            <p className="text-xs text-red-300">
              {updatePost.error instanceof Error
                ? updatePost.error.message
                : 'Failed to update post. Please try again.'}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || updatePost.isPending}
            className="flex-1 rounded-full border border-emerald-300/40 bg-emerald-300/15 px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-100 transition hover:bg-emerald-300/25 disabled:opacity-50"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-200 transition hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}
