import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../auth/use-auth'
import { AnalyticsSummary } from '../analytics/AnalyticsSummary'
import { BadgeCount } from '../badges/BadgeDisplay'
import { useLeaderboard } from './use-leaderboard'
import { getSupabaseClient } from '../../lib/supabase'

// ── Field filter hook (reuse existing fields data) ─────────────────────

function useFields() {
  return useQuery({
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
}

// ── Sub-components ─────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const RANK_STYLES: Record<number, { ring: string; bg: string; text: string; medal: string }> = {
  1: { ring: 'ring-amber-300/60', bg: 'bg-gradient-to-br from-amber-300/20 to-yellow-400/10', text: 'text-amber-200', medal: '🥇' },
  2: { ring: 'ring-slate-300/50', bg: 'bg-gradient-to-br from-slate-300/15 to-gray-400/10', text: 'text-slate-200', medal: '🥈' },
  3: { ring: 'ring-orange-300/40', bg: 'bg-gradient-to-br from-orange-300/15 to-amber-500/10', text: 'text-orange-200', medal: '🥉' },
}

function PodiumCard({
  entry,
}: {
  entry: {
    id: string
    rank: number
    name: string
    profile_picture_url: string | null
    user_type: string | null
    field: { id: string; name: string } | null
    authority_score: number
    post_count: number
    comment_count: number
    badge_count: number
  }
}) {
  const style = RANK_STYLES[entry.rank] ?? RANK_STYLES[3]

  return (
    <Link
      to={`/profile/${entry.id}`}
      className={`group relative flex cursor-pointer flex-col items-center rounded-3xl border border-white/10 ${style.bg} p-6 text-center shadow-liquid backdrop-blur-2xl transition-all hover:border-white/20 hover:shadow-2xl`}
    >
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">{style.medal}</span>

      {entry.profile_picture_url ? (
        <img
          src={entry.profile_picture_url}
          alt={entry.name}
          className={`h-16 w-16 rounded-full object-cover ring-2 ${style.ring}`}
        />
      ) : (
        <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-emerald-300/15 text-lg font-black text-emerald-100 ring-2 ${style.ring}`}>
          {initials(entry.name)}
        </div>
      )}

      <p className={`mt-3 text-sm font-black tracking-tight ${style.text}`}>{entry.name}</p>
      {entry.field && (
        <p className="mt-1 text-[10px] font-semibold text-slate-400">{entry.field.name}</p>
      )}
      {entry.user_type && (
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300/80">
          {entry.user_type}
        </p>
      )}

      <div className="mt-4 flex items-center gap-3">
        <div className="text-center">
          <p className={`text-xl font-black ${style.text}`}>{entry.authority_score}</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">Authority</p>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="text-center">
          <p className="text-sm font-bold text-slate-300">{entry.post_count}</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">Posts</p>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="text-center">
          <p className="text-sm font-bold text-slate-300">{entry.comment_count}</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">Comments</p>
        </div>
      </div>

      {entry.badge_count > 0 && (
        <div className="mt-3">
          <BadgeCount count={entry.badge_count} />
        </div>
      )}
    </Link>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────

export function LeaderboardPage() {
  const { session } = useAuth()
  const [fieldId, setFieldId] = useState<string>('')
  const [page, setPage] = useState(1)
  const limit = 20

  const { data: fields } = useFields()
  const { data, isLoading, error } = useLeaderboard({
    fieldId: fieldId || undefined,
    page,
    limit,
  })

  if (!session) return null

  const entries = data?.entries ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / limit)

  // Split top 3 for podium
  const podium = page === 1 ? entries.slice(0, 3) : []
  const tableEntries = page === 1 ? entries.slice(3) : entries

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* Admin/Moderator analytics */}
      <AnalyticsSummary />

      {/* Header */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-liquid backdrop-blur-2xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
              Rankings
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Leaderboard</h2>
            <p className="mt-1 text-sm text-slate-400">
              Top contributors ranked by authority score and participation.
            </p>
          </div>

          {/* Field filter */}
          <div className="flex-shrink-0">
            <select
              id="leaderboard-field-filter"
              value={fieldId}
              onChange={(e) => {
                setFieldId(e.target.value)
                setPage(1)
              }}
              className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 backdrop-blur transition hover:border-white/20 focus:border-emerald-300/40 focus:outline-none"
            >
              <option value="">All Fields</option>
              {(fields ?? []).map((f: { id: string; name: string }) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-liquid backdrop-blur-2xl">
          <p className="text-sm text-slate-400">Loading leaderboard...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-liquid backdrop-blur-2xl">
          <p className="text-sm text-red-300">
            {error instanceof Error ? error.message : 'Failed to load leaderboard.'}
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && entries.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-liquid backdrop-blur-2xl">
          <p className="text-lg font-bold text-slate-300">No ranked contributors yet</p>
          <p className="mt-2 text-sm text-slate-400">
            Start creating posts, commenting, and voting to appear on the leaderboard.
          </p>
        </div>
      )}

      {/* Podium — top 3 */}
      {podium.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Reorder for visual display: 2nd, 1st, 3rd */}
          {podium.length >= 2 && <PodiumCard entry={podium[1]} />}
          {podium.length >= 1 && <PodiumCard entry={podium[0]} />}
          {podium.length >= 3 && <PodiumCard entry={podium[2]} />}
        </div>
      )}

      {/* Table — remaining entries */}
      {tableEntries.length > 0 && (
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-liquid backdrop-blur-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Rank</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Contributor</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Field</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Authority</th>
                  <th className="hidden px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 sm:table-cell">Posts</th>
                  <th className="hidden px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 sm:table-cell">Comments</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Badges</th>
                </tr>
              </thead>
              <tbody>
                {tableEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs font-black text-slate-400">#{entry.rank}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/profile/${entry.id}`}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        {entry.profile_picture_url ? (
                          <img
                            src={entry.profile_picture_url}
                            alt={entry.name}
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-300/15 text-xs font-bold text-emerald-100 ring-1 ring-white/10">
                            {initials(entry.name)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-bold text-white">{entry.name}</p>
                          {entry.user_type && (
                            <p className="text-[10px] uppercase tracking-[0.1em] text-emerald-300/70">
                              {entry.user_type}
                            </p>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {entry.field?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-black text-emerald-200">{entry.authority_score}</span>
                    </td>
                    <td className="hidden px-4 py-3 text-right text-slate-300 sm:table-cell">
                      {entry.post_count}
                    </td>
                    <td className="hidden px-4 py-3 text-right text-slate-300 sm:table-cell">
                      {entry.comment_count}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <BadgeCount count={entry.badge_count} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs font-bold text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
