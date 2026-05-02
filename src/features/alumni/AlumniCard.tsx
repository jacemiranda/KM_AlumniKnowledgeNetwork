import { Link, useNavigate } from 'react-router-dom'
import type { AlumniListItem } from './alumni-service'
import { BadgeDisplay } from '../badges/BadgeDisplay'
import { useUserBadges } from '../badges/use-badges'

type AlumniCardProps = {
  alumni: AlumniListItem
}

export function AlumniCard({ alumni }: AlumniCardProps) {
  const navigate = useNavigate()
  const { data: userBadges } = useUserBadges(alumni.id)
  const initials = alumni.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <article className="group flex h-full flex-col rounded-[32px] border border-white/10 bg-[#131b2e]/60 p-5 shadow-liquid backdrop-blur-2xl transition hover:border-emerald-300/20 hover:bg-white/[0.08]">
      <div className="flex items-start gap-4">
        {alumni.profile_picture_url ? (
          <img
            src={alumni.profile_picture_url}
            alt={alumni.name}
            className="h-14 w-14 flex-shrink-0 rounded-full object-cover ring-2 ring-white/10"
          />
        ) : (
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 text-base font-bold text-emerald-100 ring-2 ring-white/10">
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-white transition-colors group-hover:text-emerald-100">
            {alumni.name}
          </h3>

          {alumni.field && (
            <p className="mt-0.5 text-xs text-emerald-300/80">{alumni.field.name}</p>
          )}

          {alumni.bio && (
            <p className="mt-1 line-clamp-2 text-xs text-slate-400">{alumni.bio}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-[#ffb95f]">
        {Array.from({ length: 5 }).map((_, index) => (
          <svg key={index} aria-hidden="true" className="h-4 w-4 drop-shadow-[0_0_8px_rgba(255,185,95,0.25)]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.22 3.75a1 1 0 0 0 .95.69h3.942c.969 0 1.371 1.24.588 1.81l-3.19 2.318a1 1 0 0 0-.364 1.118l1.22 3.75c.3.921-.755 1.688-1.538 1.118l-3.19-2.318a1 1 0 0 0-1.176 0l-3.19 2.318c-.783.57-1.838-.197-1.539-1.118l1.22-3.75a1 1 0 0 0-.363-1.118L2.3 9.177c-.783-.57-.38-1.81.588-1.81H6.83a1 1 0 0 0 .95-.69l1.22-3.75Z" />
          </svg>
        ))}
        <span className="ml-2 text-xs font-semibold text-[#ffb95f]">Helpful mentor</span>
      </div>

      {/* Skills */}
      {alumni.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {alumni.skills.slice(0, 4).map((skill) => (
            <span
              key={skill.id}
              className="rounded-full border border-emerald-300/15 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-100"
            >
              {skill.name}
            </span>
          ))}
          {alumni.skills.length > 4 && (
            <span className="rounded-full px-2 py-1 text-[10px] text-slate-500">
              +{alumni.skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Badges */}
      {(userBadges ?? []).length > 0 && (
        <div className="mt-3">
          <BadgeDisplay badges={userBadges ?? []} compact maxVisible={3} />
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
          <span className="font-bold text-emerald-200">{alumni.authority_score}</span>
          <span className="text-slate-500">authority</span>
        </div>

        <div className="flex items-center gap-1.5">
          <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span className="text-slate-400">{alumni.post_count} posts</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          to={`/profile/${alumni.id}`}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-200 transition hover:border-emerald-300/20 hover:bg-white/[0.08]"
        >
          View profile
        </Link>
        <button
          type="button"
          onClick={() => navigate(`/search?q=${encodeURIComponent(alumni.name)}`)}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-[#ffb95f] border-t-[#ffb95f] bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-950 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-emerald-50 transition hover:brightness-110"
        >
          Ask a Question
        </button>
      </div>
    </article>
  )
}
