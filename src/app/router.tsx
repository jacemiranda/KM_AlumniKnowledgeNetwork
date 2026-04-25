import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../features/auth/LoginPage'
import { ProtectedRoute } from '../features/auth/ProtectedRoute'
import { AppShell } from '../features/shell/AppShell'
import {
  AlumniPage,
  FeedPage,
  LeaderboardPage,
  NotificationsPage,
  ProfilePage,
} from '../pages'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<FeedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/alumni" element={<AlumniPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
