import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSupabaseClient } from '../../lib/supabase'
import { FeedSurface } from '../feed/feed-ui'
import { AlumniCard } from './AlumniCard'
import type { AlumniFilters } from './alumni-service'
import { useAlumni } from './use-alumni'

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
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-liquid backdrop-blur-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
          Discover
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-white">
          Alumni / Mentors
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Browse alumni contributors. Filter by field and skills to find the expertise you need.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-2xl">
        {/* Field Filter */}
        <select
          id="alumni-field-filter"
          value={filters.fieldId ?? ''}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              fieldId: e.target.value || undefined,
              page: 1,
            }))
          }
          className="custom-select rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 backdrop-blur transition focus:border-emerald-300/40 focus:outline-none cursor-pointer"
        >
          <option value="">All Fields</option>
          {(fields ?? []).map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        {/* Skill Filter */}
        <select
          id="alumni-skill-filter"
          value={filters.skillId ?? ''}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              skillId: e.target.value || undefined,
              page: 1,
            }))
          }
          className="custom-select rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 backdrop-blur transition focus:border-emerald-300/40 focus:outline-none cursor-pointer"
        >
          <option value="">All Skills</option>
          {(skills ?? []).map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-slate-500">Sort:</span>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilters((f) => ({ ...f, sortBy: opt.value, page: 1 }))}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition cursor-pointer ${
                filters.sortBy === opt.value
                  ? 'bg-emerald-300/15 text-emerald-200 border border-emerald-300/30'
                  : 'text-slate-500 border border-transparent hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-52 animate-pulse rounded-2xl border border-white/10 bg-white/5 shadow-liquid backdrop-blur-2xl"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-6 text-sm text-red-300 shadow-liquid backdrop-blur-2xl">
          {error instanceof Error ? error.message : 'Failed to load alumni.'}
        </div>
      </FeedSurface>

      <FeedSurface className="p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <select
            id="alumni-field-filter"
            value={filters.fieldId ?? ''}
            onChange={(e) =>
              setFilters((current) => ({
                ...current,
                fieldId: e.target.value || undefined,
                page: 1,
              }))
            }
            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 backdrop-blur transition focus:border-emerald-300/40 focus:outline-none"
          >
            <option value="">All Fields</option>
            {(fields ?? []).map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>

          <select
            id="alumni-skill-filter"
            value={filters.skillId ?? ''}
            onChange={(e) =>
              setFilters((current) => ({
                ...current,
                skillId: e.target.value || undefined,
                page: 1,
              }))
            }
            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 backdrop-blur transition focus:border-emerald-300/40 focus:outline-none"
          >
            <option value="">All Skills</option>
            {(skills ?? []).map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </select>

          <div className="flex-1" />

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Sort:</span>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilters((current) => ({ ...current, sortBy: option.value, page: 1 }))}
                className={`cursor-pointer rounded-lg border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                  filters.sortBy === option.value
                    ? 'border-emerald-300/30 bg-emerald-300/15 text-emerald-200'
                    : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </FeedSurface>

      <FeedSurface className="p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            [1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-[32px] border border-white/10 bg-white/5 shadow-liquid backdrop-blur-2xl"
              />
            ))}

          {error && (
            <div className="col-span-full rounded-[32px] border border-red-400/20 bg-red-400/5 p-6 text-sm text-red-300 shadow-liquid backdrop-blur-2xl">
              {error instanceof Error ? error.message : 'Failed to load alumni.'}
            </div>
          )}

          {!isLoading && !error && alumni.length === 0 && (
            <div className="col-span-full rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-liquid backdrop-blur-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10">
                <svg className="h-8 w-8 text-emerald-400/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-slate-400">No alumni found matching your filters.</p>
              <p className="mt-1 text-xs text-slate-500">Try adjusting the field or skill filters.</p>
            </div>
          )}

          {!isLoading && !error && alumni.length > 0 && alumni.map((alumniItem) => <AlumniCard key={alumniItem.id} alumni={alumniItem} />)}
        </div>
      </FeedSurface>

      {total > (filters.limit ?? 20) && (
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={!filters.page || filters.page <= 1}
            onClick={() => setFilters((current) => ({ ...current, page: (current.page ?? 1) - 1 }))}
            className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ← Previous
          </button>
          <span className="px-2 py-2 text-xs text-slate-500">
            Page {filters.page ?? 1} of {Math.ceil(total / (filters.limit ?? 20))}
          </span>
          <button
            type="button"
            disabled={(filters.page ?? 1) * (filters.limit ?? 20) >= total}
            onClick={() => setFilters((current) => ({ ...current, page: (current.page ?? 1) + 1 }))}
            className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
