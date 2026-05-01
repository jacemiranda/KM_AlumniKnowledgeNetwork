import { useQuery } from '@tanstack/react-query'
import { getSupabaseClient } from '../../lib/supabase'
import type { PostFilters, PostType } from './post-service'

type FeedFiltersProps = {
  filters: PostFilters
  onChange: (filters: PostFilters) => void
}

export function FeedFilters({ filters, onChange }: FeedFiltersProps) {
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

  const postTypeOptions: Array<{ value: PostType | ''; label: string }> = [
    { value: '', label: 'All Types' },
    { value: 'information', label: 'Information' },
    { value: 'question', label: 'Question' },
  ]

  const hasActiveFilters = filters.fieldId || filters.postType || filters.tagId

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Field Filter */}
      <select
        value={filters.fieldId ?? ''}
        onChange={(e) =>
          onChange({ ...filters, fieldId: e.target.value || undefined, page: 1 })
        }
        className="rounded-2xl border border-white/10 bg-ink-900/60 px-3 py-2 text-xs text-white focus:border-emerald-300/30 focus:outline-none"
      >
        <option value="">All Fields</option>
        {(fieldOptions ?? []).map((field) => (
          <option key={field.id} value={field.id}>
            {field.name}
          </option>
        ))}
      </select>

      {/* Post Type Filter */}
      <div className="flex gap-1">
        {postTypeOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() =>
              onChange({
                ...filters,
                postType: opt.value ? (opt.value as PostType) : undefined,
                page: 1,
              })
            }
            className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition ${
              (filters.postType ?? '') === opt.value
                ? 'border border-emerald-300/40 bg-emerald-300/15 text-emerald-100'
                : 'border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onChange({ page: 1 })}
          className="rounded-full px-3 py-1.5 text-xs text-slate-400 transition hover:text-white"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
