import { Link } from 'react-router-dom'
import type { SearchUserResult } from './search-service'

type UserResultCardProps = {
  user: SearchUserResult
}

export function UserResultCard({ user }: UserResultCardProps) {
  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Link
      to={`/profile/${user.id}`}
      className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-liquid backdrop-blur-2xl transition hover:border-emerald-300/20 hover:bg-white/[0.08] cursor-pointer"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {user.profile_picture_url ? (
          <img
            src={user.profile_picture_url}
            alt={user.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 text-sm font-bold text-emerald-100 ring-2 ring-white/10">
            {initials}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-bold text-white group-hover:text-emerald-100 transition-colors">
            {user.name}
          </h3>
          {user.user_type && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                user.user_type === 'alumni'
                  ? 'bg-emerald-400/15 text-emerald-300'
                  : 'bg-sky-400/15 text-sky-300'
              }`}
            >
              {user.user_type}
            </span>
          )}
        </div>

        {user.field && (
          <p className="mt-0.5 text-xs text-slate-400">{user.field.name}</p>
        )}

        {user.bio && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-400">{user.bio}</p>
        )}

        {/* Skills */}
        {user.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {user.skills.slice(0, 4).map((skill) => (
              <span
                key={skill.id}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-400"
              >
                {skill.name}
              </span>
            ))}
            {user.skills.length > 4 && (
              <span className="rounded-full px-2 py-0.5 text-[10px] text-slate-500">
                +{user.skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Metrics */}
        <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            {user.authority_score} authority
          </span>
          <span>{user.post_count} posts</span>
        </div>
      </div>
    </Link>
  )
}
