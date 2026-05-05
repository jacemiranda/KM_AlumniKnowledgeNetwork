import type { ContentStatus } from '../../feed/post-service'

export type ModerationQueueItem = {
  id: string
  kind: 'post' | 'comment'
  title: string
  content: string
  reason: string
  status: ContentStatus
  byline: string
}

type ModerationQueueProps = {
  items: ModerationQueueItem[]
  isLoading: boolean
  onApproveKeep: (item: ModerationQueueItem) => void
  onRemoveDelete: (item: ModerationQueueItem) => void
  isMutating: boolean
}

function StatusBadge({ status }: { status: ContentStatus }) {
  const styles: Record<ContentStatus, string> = {
    published: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-200',
    hidden: 'border-amber-300/40 bg-amber-300/10 text-amber-200',
    removed: 'border-[#ffb4ab]/40 bg-[#ffb4ab]/15 text-[#ffb4ab]',
  }

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${styles[status]}`}>
      {status}
    </span>
  )
}

export function ModerationQueue({ items, isLoading, onApproveKeep, onRemoveDelete, isMutating }: ModerationQueueProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#131b2e]/60 p-6 text-center text-sm text-slate-400 shadow-liquid backdrop-blur-2xl">
        Loading moderation queue...
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#131b2e]/60 p-6 text-center text-sm text-slate-400 shadow-liquid backdrop-blur-2xl">
        No reported posts or comments found.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={`${item.kind}-${item.id}`} className="rounded-2xl border border-white/10 bg-[#131b2e]/60 p-4 shadow-liquid backdrop-blur-2xl">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#bbcabf]">
                Reported {item.kind === 'post' ? 'Post' : 'Comment'}
              </p>
              <h4 className="mt-1 text-sm font-bold text-[#dae2fd]">{item.title}</h4>
              <p className="mt-1 line-clamp-3 text-xs text-[#bbcabf]">{item.content}</p>
              <p className="mt-2 text-[10px] text-[#bbcabf]/70">Reason: {item.reason}</p>
              <p className="mt-1 text-[10px] text-[#bbcabf]/70">{item.byline}</p>
            </div>
            <StatusBadge status={item.status} />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              aria-label={`Approve ${item.kind === 'post' ? 'post' : 'comment'}: ${item.title}`}
              onClick={() => onApproveKeep(item)}
              disabled={isMutating}
              className="rounded-full border border-emerald-300/40 bg-emerald-300/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-100 transition-all duration-300 hover:bg-emerald-300/20 focus:outline-none focus:ring-2 focus:ring-[#4edea3] disabled:opacity-40"
            >
              Approve / Keep
            </button>
            <button
              type="button"
              aria-label={`Remove ${item.kind === 'post' ? 'post' : 'comment'}: ${item.title}`}
              onClick={() => onRemoveDelete(item)}
              disabled={isMutating}
              className="rounded-full border border-[#ffb4ab]/40 bg-[#ffb4ab]/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#ffb4ab] transition-all duration-300 hover:bg-[#ffb4ab]/25 focus:outline-none focus:ring-2 focus:ring-[#4edea3] disabled:opacity-40"
            >
              Remove / Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
