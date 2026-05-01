import { FeedPage as FeedFeaturePage } from '../features/feed/FeedPage'
import { PostDetail } from '../features/feed/PostDetail'
import { SetupPage as SetupFeaturePage } from '../features/setup/SetupPage'

type PlaceholderPageProps = {
  title: string
  description: string
}

function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-100 shadow-liquid backdrop-blur-2xl">
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Shell placeholder</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-white">{title}</h2>
      <p className="mt-3 text-base text-slate-300">{description}</p>
    </div>
  )
}

export function FeedPage() {
  return <FeedFeaturePage />
}

export function SetupPage() {
  return <SetupFeaturePage />
}

export function PostDetailPage() {
  return <PostDetail />
}

export function ProfilePage() {
  return (
    <PlaceholderPage
      title="Profile"
      description="Profile setup and contribution details are intentionally out of scope for this scaffold PR."
    />
  )
}

export function AlumniPage() {
  return (
    <PlaceholderPage
      title="Alumni / Mentors"
      description="Dedicated alumni discovery will be connected in a later PR once search and profile data are available."
    />
  )
}

export function LeaderboardPage() {
  return (
    <PlaceholderPage
      title="Leaderboard"
      description="Authority ranking and badges are future sprint work. This route exists now to validate shell navigation."
    />
  )
}

export function NotificationsPage() {
  return (
    <PlaceholderPage
      title="Notifications"
      description="The notifications modal and live activity are not part of this scaffold. This placeholder keeps the shell navigation coherent."
    />
  )
}
