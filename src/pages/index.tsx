type PlaceholderPageProps = {
  title: string
  description: string
}

function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="placeholder-page">
      <p className="eyebrow">Shell placeholder</p>
      <h2>{title}</h2>
      <p className="page-copy">{description}</p>
    </div>
  )
}

export function FeedPage() {
  return (
    <PlaceholderPage
      title="Universal Feed"
      description="This is the feed-first landing page for authenticated users. Posting, comments, and field filters will be added in later Sprint 1 and Sprint 2 PRs."
    />
  )
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
