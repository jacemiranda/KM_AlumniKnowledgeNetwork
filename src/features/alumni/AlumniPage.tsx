import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSupabaseClient } from '../../lib/supabase'
import { AlumniCard } from './AlumniCard'
import { useAlumni } from './use-alumni'
import type { AlumniFilters } from './alumni-service'

type SortOption = 'authority' | 'name' | 'recent'

export function AlumniPage() {
  const [filters, setFilters] = useState<AlumniFilters>({
    sortBy: 'authority',
    page: 1,
    limit: 20,
  })

  const { data, isLoading, error } = useAlumni(filters)
  const alumni = data?.alumni ?? []
  const total = data?.total ?? 0

  // Fetch fields and skills for filter dropdowns
  const { data: fields } = useQuery({
    queryKey: ['fields'],
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

  const { data: skills } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('skills')
        .select('id, name')
        .order('name')
      if (error) throw new Error(error.message)
      return data as Array<{ id: string; name: string }>
    },
  })

  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: 'authority', label: 'Top Authority' },
    { value: 'name', label: 'Alphabetical' },
    { value: 'recent', label: 'Most Recent' },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <FeedSurface className="p-4 md:p-6">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Discover</p>
          <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">Alumni / Mentors</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-400 md:text-[15px]">
            Browse alumni contributors, compare helpfulness, and ask a question directly from the grid.
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && alumni.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-liquid backdrop-blur-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10">
            <svg className="h-8 w-8 text-emerald-400/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <p className="text-sm text-slate-400">
            No alumni found matching your filters.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Try adjusting the field or skill filters.
          </p>
        </div>
      )}

      {/* Alumni Grid */}
      {!isLoading && !error && alumni.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alumni.map((a) => (
            <AlumniCard key={a.id} alumni={a} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > (filters.limit ?? 20) && (
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={!filters.page || filters.page <= 1}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:opacity-30 cursor-pointer"
          >
            ← Previous
          </button>
          <span className="px-2 py-2 text-xs text-slate-500">
            Page {filters.page ?? 1} of {Math.ceil(total / (filters.limit ?? 20))}
          </span>
          <button
            type="button"
            disabled={(filters.page ?? 1) * (filters.limit ?? 20) >= total}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:opacity-30 cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
