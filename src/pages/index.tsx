import { AlumniPage as AlumniFeaturePage } from '../features/alumni/AlumniPage'
import { FeedPage as FeedFeaturePage } from '../features/feed/FeedPage'
import { PostDetail } from '../features/feed/PostDetail'
import { LeaderboardPage as LeaderboardFeaturePage } from '../features/leaderboard/LeaderboardPage'
import { UserManagementPage as UserManagementFeaturePage } from '../features/moderation/UserManagementPage'
import { NotificationsPage as NotificationsFeaturePage } from '../features/notifications/NotificationsPage'
import { ProfilePage as ProfileFeaturePage } from '../features/profile/ProfilePage'
import { SearchPage as SearchFeaturePage } from '../features/search/SearchPage'
import { SetupPage as SetupFeaturePage } from '../features/setup/SetupPage'

export function FeedPage() {
  return <FeedFeaturePage />
}

export function SetupPage() {
  return <SetupFeaturePage />
}

export function PostDetailPage() {
  return <PostDetail />
}

export function SearchPage() {
  return <SearchFeaturePage />
}

export function AlumniPage() {
  return <AlumniFeaturePage />
}

export function ProfilePage() {
  return <ProfileFeaturePage />
}

export function LeaderboardPage() {
  return <LeaderboardFeaturePage />
}

export function NotificationsPage() {
  return <NotificationsFeaturePage />
}

export function UserManagementPage() {
  return <UserManagementFeaturePage />
}

