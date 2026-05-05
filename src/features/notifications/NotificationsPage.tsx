import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/use-auth'
import { useNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from './use-notifications'

export function NotificationsPage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(0)
  const limit = 20
  const offset = currentPage * limit

  const { data, isLoading, error } = useNotifications(session?.user?.id, limit, offset, false)
  const { mutate: markAsRead } = useMarkNotificationRead()
  const { mutate: markAllAsRead } = useMarkAllNotificationsRead()

  const totalPages = data ? Math.ceil(data.total / limit) : 0

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'tagged_in_post':
        return '🏷️'
      case 'new_comment':
        return '💬'
      case 'badge_earned':
        return '🏆'
      case 'moderation_notice':
        return '⚠️'
      default:
        return '📢'
    }
  }

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'tagged_in_post':
        return 'Tagged'
      case 'new_comment':
        return 'Comment'
      case 'badge_earned':
        return 'Badge'
      case 'moderation_notice':
        return 'Moderation'
      default:
        return 'Notification'
    }
  }

  const formatTime = (createdAt: string) => {
    return new Date(createdAt).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-liquid backdrop-blur-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-emerald-200 hover:text-emerald-100 text-sm font-semibold mb-4 inline-flex items-center gap-1">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-slate-400">
            {data ? `${data.unread_count} unread out of ${data.total} total` : 'Loading...'}
          </p>
        </div>

        {/* Mark All as Read Button */}
        {data && data.unread_count > 0 && (
          <div className="mb-6">
            <button
              onClick={() => session?.user?.id && markAllAsRead(session.user.id)}
              className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-400">Loading notifications...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="text-red-400 font-semibold">Error loading notifications</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-red-300 hover:text-red-200 text-sm underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {data && data.notifications.length === 0 && !isLoading && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16 mx-auto mb-4 text-slate-500 opacity-50"
            >
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.88 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V2h-3v4.68C7.36 7.36 5.68 9.93 5.68 13v5H4v2h16v-2h-2z" />
            </svg>
            <p className="text-slate-400 text-lg">You're all caught up!</p>
            <p className="text-slate-500 text-sm mt-2">No notifications at this time.</p>
          </div>
        )}

        {/* Notifications List */}
        {data && data.notifications.length > 0 && (
          <div className="space-y-3 mb-8">
            {data.notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  if (!notification.is_read) {
                    markAsRead(notification.id)
                  }
                  if (notification.data.action_url) {
                    navigate(notification.data.action_url)
                  }
                }}
                className={`rounded-3xl border p-5 cursor-pointer transition ${
                  notification.is_read
                    ? 'border-white/10 bg-white/5 hover:bg-white/10'
                    : 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15'
                }`}
              >
                <div className="flex gap-4">
                  <div className="text-3xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-bold text-white">
                          {notification.data.title}
                        </p>
                        <p className="text-xs font-semibold text-emerald-200 mt-1">
                          {getNotificationTypeLabel(notification.type)}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-slate-300 text-sm mb-3">
                      {notification.data.message}
                    </p>
                    {notification.actor && (
                      <p className="text-xs text-slate-500 mb-2">
                        From: <span className="text-slate-300">{notification.actor.name}</span>
                      </p>
                    )}
                    <p className="text-xs text-slate-500">
                      {formatTime(notification.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 rounded-full border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Previous
            </button>
            <span className="text-slate-400 text-sm">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 rounded-full border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
