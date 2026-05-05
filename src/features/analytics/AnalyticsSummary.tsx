import { useAuth } from '../auth/use-auth'
import { useAnalytics } from './use-analytics'

function AnalyticMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
      <p className="text-2xl font-black tracking-tight text-white">{value.toLocaleString()}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
    </div>
  )
}

export function AnalyticsSummary() {
  const { session } = useAuth()
  const role = session?.user.role
  const isPrivileged = role === 'admin' || role === 'moderator'
  const { data, isLoading, error } = useAnalytics()

  // Only show for Admin/Moderator
  if (!isPrivileged) {
    return null
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-liquid backdrop-blur-2xl">
        <p className="text-sm text-slate-400">Loading analytics...</p>
      </div>
    )
  }

  if (error || !data) {
    return null
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-liquid backdrop-blur-2xl">
      <div className="mb-4 border-b border-white/10 pb-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
          Platform Analytics
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Overview of platform activity — visible to Admin and Moderator only.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <AnalyticMetric label="Students" value={data.total_students} />
        <AnalyticMetric label="Alumni" value={data.total_alumni} />
        <AnalyticMetric label="Posts" value={data.total_posts} />
        <AnalyticMetric label="Comments" value={data.total_comments} />
        <AnalyticMetric label="Online Now" value={data.recently_active} />
        <AnalyticMetric label="Badges Awarded" value={data.total_badges_awarded} />
      </div>
    </section>
  )
}
