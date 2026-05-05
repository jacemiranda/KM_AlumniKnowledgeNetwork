import type { ReactNode } from 'react'
import type { UserBadge, BadgeCategory } from './badge-service'

// ── Category colors ────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<BadgeCategory, { border: string; bg: string; text: string }> = {
  onboarding: { border: 'border-emerald-300/40', bg: 'bg-emerald-300/10', text: 'text-emerald-200' },
  contribution: { border: 'border-blue-300/40', bg: 'bg-blue-300/10', text: 'text-blue-200' },
  knowledge: { border: 'border-purple-300/40', bg: 'bg-purple-300/10', text: 'text-purple-200' },
  community: { border: 'border-pink-300/40', bg: 'bg-pink-300/10', text: 'text-pink-200' },
  engagement: { border: 'border-orange-300/40', bg: 'bg-orange-300/10', text: 'text-orange-200' },
  milestone: { border: 'border-amber-300/40', bg: 'bg-amber-300/10', text: 'text-amber-200' },
  fun: { border: 'border-cyan-300/40', bg: 'bg-cyan-300/10', text: 'text-cyan-200' },
}

// ── Icon mapping ───────────────────────────────────────────────────────
// Using simple SVG path data for common badge icons (Lucide-compatible)

function BadgeIcon({ iconName, className }: { iconName: string; className?: string }) {
  const icons: Record<string, ReactNode> = {
    'pencil': (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      </svg>
    ),
    'message-circle': (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
    ),
    'thumbs-up': (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
      </svg>
    ),
    'user-check': (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
      </svg>
    ),
    'file-text': (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
      </svg>
    ),
    'brain': (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" /><path d="M12 18v-5" />
      </svg>
    ),
    'crown': (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" /><path d="M5 21h14" />
      </svg>
    ),
    'heart': (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
    'smile': (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" x2="9.01" y1="9" y2="9" /><line x1="15" x2="15.01" y1="9" y2="9" />
      </svg>
    ),
    'hash': (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" /><line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" />
      </svg>
    ),
    'trending-up': (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    'message-square': (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    'star': (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  }

  return icons[iconName] ?? icons['star']
}

// ── Components ─────────────────────────────────────────────────────────

type BadgeChipProps = {
  badge: UserBadge
  compact?: boolean
}

function BadgeChip({ badge, compact }: BadgeChipProps) {
  const styles = CATEGORY_STYLES[badge.badge.category] ?? CATEGORY_STYLES.milestone

  if (compact) {
    return (
      <span
        role="status"
        aria-label={`${badge.badge.name} badge`}
        title={`${badge.badge.name}: ${badge.badge.description ?? ''}`}
        className={`inline-flex items-center gap-1 rounded-full border ${styles.border} ${styles.bg} px-2 py-0.5 ${styles.text}`}
      >
        <BadgeIcon iconName={badge.badge.icon_name} className="h-3 w-3" />
        <span className="text-[10px] font-bold uppercase tracking-[0.08em]">{badge.badge.name}</span>
      </span>
    )
  }

  return (
    <div
      role="status"
      aria-label={`${badge.badge.name} badge`}
      title={badge.badge.description ?? ''}
      className={`inline-flex items-center gap-2 rounded-xl border ${styles.border} ${styles.bg} px-3 py-2 transition-colors cursor-default hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#4edea3] transition-all duration-300`}
    >
      <BadgeIcon iconName={badge.badge.icon_name} className={`h-4 w-4 ${styles.text}`} />
      <div className="min-w-0">
        <p className={`text-xs font-bold ${styles.text}`}>{badge.badge.name}</p>
        {badge.badge.description && (
          <p className="mt-0.5 text-[10px] leading-tight text-slate-400 line-clamp-1">
            {badge.badge.description}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Public API ──────────────────────────────────────────────────────────

type BadgeDisplayProps = {
  badges: UserBadge[]
  compact?: boolean
  maxVisible?: number
}

export function BadgeDisplay({ badges, compact, maxVisible }: BadgeDisplayProps) {
  if (badges.length === 0) {
    return null
  }

  const visible = maxVisible ? badges.slice(0, maxVisible) : badges
  const remaining = maxVisible ? badges.length - maxVisible : 0

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((ub) => (
        <BadgeChip key={ub.id} badge={ub} compact={compact} />
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-400">
          +{remaining} more
        </span>
      )}
    </div>
  )
}

type BadgeCountProps = {
  count: number
}

export function BadgeCount({ count }: BadgeCountProps) {
  if (count === 0) return null

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-[10px] font-bold text-amber-200">
      <BadgeIcon iconName="star" className="h-3 w-3" />
      {count}
    </span>
  )
}
