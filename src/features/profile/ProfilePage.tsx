import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../auth/use-auth'
import { BadgeDisplay } from '../badges/BadgeDisplay'
import { useUserBadges, useCheckBadges } from '../badges/use-badges'
import { useCastVote, useRemoveVote } from '../feed/use-votes'
import type { VoteValue } from '../feed/vote-service'
import { useProfileMetrics } from './use-profile-metrics'

function initials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatUserType(userType: string | null) {
  if (!userType) return 'Profile'
  return userType.charAt(0).toUpperCase() + userType.slice(1)
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-2xl font-black tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
    </div>
  )
}

function VoteIcon({ direction }: { direction: 'up' | 'down' }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      {direction === 'up' ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75 12 8.25l7.5 7.5" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      )}
    </svg>
  )
}

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const { session } = useAuth()
  const profileId = userId ?? session?.user.id ?? ''
  const { data: profile, isLoading, error } = useProfileMetrics(profileId)
  const { data: userBadges } = useUserBadges(profileId)
  const checkBadges = useCheckBadges()
  const castVote = useCastVote()
  const removeVote = useRemoveVote()

  // Auto-check and award eligible badges when profile loads
  useEffect(() => {
    if (profileId && profile) {
      checkBadges.mutate(profileId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId, profile?.id])

  if (!session) {
    return null
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-liquid backdrop-blur-2xl">
        <p className="text-sm text-slate-400">Loading profile...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-liquid backdrop-blur-2xl">
        <p className="text-sm text-red-300">
          {error instanceof Error ? error.message : 'Profile not found.'}
        </p>
        <Link
          to="/alumni"
          className="mt-3 inline-block text-sm font-bold text-emerald-200 transition-colors hover:text-emerald-100"
        >
          Back to alumni
        </Link>
      </div>
    )
  }

  const isOwnProfile = session.user.id === profile.id
  const votePending = castVote.isPending || removeVote.isPending

  function handleVote(value: VoteValue) {
    if (!profile || isOwnProfile) return
    if (profile.my_vote === value) {
      removeVote.mutate(profile.id)
      return
    }
    castVote.mutate({ targetId: profile.id, value })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-liquid backdrop-blur-2xl">
        <div className="border-b border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-4">
              {profile.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt={profile.name}
                  className="h-20 w-20 flex-shrink-0 rounded-full object-cover ring-2 ring-white/10"
                />
              ) : (
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-emerald-300/15 text-xl font-black text-emerald-100 ring-2 ring-white/10">
                  {initials(profile.name)}
                </div>
              )}

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                  {formatUserType(profile.user_type)}
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                  {profile.name}
                </h2>
                <p className="mt-1 text-sm text-slate-400">{profile.email}</p>
                {profile.field && (
                  <p className="mt-2 text-sm font-semibold text-emerald-200">
                    {profile.field.name}
                  </p>
                )}
              </div>
            </div>

            {!isOwnProfile && (
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() => handleVote(1)}
                  disabled={votePending}
                  aria-pressed={profile.my_vote === 1}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    profile.my_vote === 1
                      ? 'border-emerald-300/60 bg-emerald-300/20 text-emerald-100'
                      : 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200 hover:bg-emerald-300/20'
                  }`}
                >
                  <VoteIcon direction="up" />
                  Upvote
                </button>
                <button
                  type="button"
                  onClick={() => handleVote(-1)}
                  disabled={votePending}
                  aria-pressed={profile.my_vote === -1}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    profile.my_vote === -1
                      ? 'border-red-300/60 bg-red-300/20 text-red-100'
                      : 'border-red-300/30 bg-red-300/10 text-red-200 hover:bg-red-300/20'
                  }`}
                >
                  <VoteIcon direction="down" />
                  Downvote
                </button>
              </div>
            )}
          </div>

          {profile.bio && (
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-300">
              {profile.bio}
            </p>
          )}

          {profile.skills.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
          <MetricCard label="Authority score" value={profile.authority_score} />
          <MetricCard label="Posts created" value={profile.post_count} />
          <MetricCard label="Tagged in posts" value={profile.posts_tagged_in} />
          <MetricCard label="Comments" value={profile.comment_count} />
        </div>

        {/* Earned badges */}
        {(userBadges ?? []).length > 0 && (
          <div className="border-t border-white/10 p-6 sm:p-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Earned Badges
            </p>
            <BadgeDisplay badges={userBadges ?? []} />
          </div>
        )}
      </section>
    </div>
  )
}
