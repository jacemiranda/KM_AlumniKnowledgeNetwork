import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../features/auth/LoginPage'
import { ProtectedRoute } from '../features/auth/ProtectedRoute'
import { SetupGuard } from '../features/auth/SetupGuard'
import { AppShell } from '../features/shell/AppShell'
import {
  AlumniPage,
  FeedPage,
  LeaderboardPage,
  NotificationsPage,
  PostDetailPage,
  ProfilePage,
  SearchPage,
  SetupPage,
  UserManagementPage,
} from '../pages'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<SetupGuard allowSetupPage={true} />}>
            <Route path="/setup" element={<SetupPage />} />
          </Route>

          <Route element={<SetupGuard allowSetupPage={false} />}>
          <Route element={<AppShell />}>
            <Route index element={<FeedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/alumni" element={<AlumniPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/post/:postId" element={<PostDetailPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/admin" element={<UserManagementPage />} />
          </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
