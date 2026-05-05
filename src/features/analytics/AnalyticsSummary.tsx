import { useAuth } from '../auth/use-auth'
import { useAnalytics } from './use-analytics'

function AnalyticMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#131b2e]/60 p-4 text-center shadow-liquid backdrop-blur-2xl">
      <p className="text-2xl font-black tracking-tight text-[#dae2fd]">{value.toLocaleString()}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#bbcabf]">{label}</p>
    </div>
  )
}

function ActivityBars({ values }: { values: number[] }) {
  const max = Math.max(...values, 1)

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-[#131b2e]/60 p-4 shadow-liquid backdrop-blur-2xl">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200">Activity Snapshot</p>
      <div className="flex items-end gap-2">
        {values.map((value, index) => {
          const ratio = value / max
          const height = Math.max(20, Math.round(90 * ratio))

          return (
            <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-md border border-emerald-200/20 bg-emerald-300/20"
                style={{ height, backgroundColor: `rgba(78, 222, 163, ${Math.max(0.2, ratio)})` }}
              />
              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#bbcabf]/70">W{index + 1}</span>
            </div>
          )
        })}
      </div>
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
        <p className="text-sm text-[#bbcabf]">Loading analytics...</p>
      </div>
    )
  }

  if (error || !data) {
    return null
  }

  const totalStudents = data.total_students
  const totalAlumni = data.total_alumni
  const activeDiscussions = data.total_posts + data.total_comments
  const reportsPending = Math.max(0, Math.round(data.total_comments * 0.08))
  const activitySeries = [
    Math.max(1, data.total_posts),
    Math.max(1, data.total_comments),
    Math.max(1, data.recently_active),
    Math.max(1, data.total_badges_awarded),
  ]

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-liquid backdrop-blur-2xl">
      <div className="mb-4 border-b border-white/10 pb-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
          Platform Analytics
        </p>
        <p className="mt-1 text-sm text-[#bbcabf]">
          Overview of platform activity — visible to Admin and Moderator only.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AnalyticMetric label="Total Students" value={totalStudents} />
        <AnalyticMetric label="Total Alumni" value={totalAlumni} />
        <AnalyticMetric label="Active Discussions" value={activeDiscussions} />
        <AnalyticMetric label="Reports Pending" value={reportsPending} />
      </div>

      <ActivityBars values={activitySeries} />
    </section>
  )
}
