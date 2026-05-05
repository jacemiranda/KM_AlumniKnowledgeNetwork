import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/use-auth'
import { useNotificationDropdown, useMarkNotificationRead, useMarkAllNotificationsRead } from './use-notifications'

export function NotificationsDropdown() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; right: number } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)
  const { data, isLoading, error } = useNotificationDropdown(session?.user?.id)
  const { mutate: markAsRead } = useMarkNotificationRead()
  const { mutate: markAllAsRead } = useMarkAllNotificationsRead()

  // Update dropdown position when opened or window resizes
  useEffect(() => {
    function updatePosition() {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right,
        })
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isClickInsideButton = buttonRef.current?.contains(event.target as Node)
      const isClickInsidePortal = portalRef.current?.contains(event.target as Node)
      
      if (!isClickInsideButton && !isClickInsidePortal) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const formatTime = (createdAt: string) => {
    const date = new Date(createdAt)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2v-5c0-3.07-1.64-5.64-4.5-6.32V2h-3v4.68C7.36 7.36 5.68 9.93 5.68 13v5H4v2h16v-2h-2z" />
        </svg>
        {data && data.unread_count > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-emerald-500 rounded-full">
            {data.unread_count > 99 ? '99+' : data.unread_count}
          </span>
        )}
      </button>

      {/* Dropdown Menu - Rendered via Portal */}
      {isOpen && dropdownPosition &&
        createPortal(
          <div
            ref={portalRef}
            className="fixed w-96 rounded-3xl border border-white/10 bg-ink-950 shadow-2xl backdrop-blur-2xl z-[9999]"
            style={{
              top: `${dropdownPosition.top}px`,
              right: `${dropdownPosition.right}px`,
            }}
          >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <h3 className="text-lg font-bold text-white">Notifications</h3>
            {data && data.unread_count > 0 && (
              <button
                onClick={() => {
                  if (session?.user?.id) {
                    markAllAsRead(session.user.id)
                  }
                }}
                className="text-xs font-semibold text-emerald-200 hover:text-emerald-100 transition"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center py-8 text-slate-400">
                <p>Loading...</p>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-8 text-red-400">
                <p>Error loading notifications</p>
              </div>
            )}

            {data && data.notifications.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12 mb-2 opacity-50"
                >
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.88 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V2h-3v4.68C7.36 7.36 5.68 9.93 5.68 13v5H4v2h16v-2h-2z" />
                </svg>
                <p className="text-sm">No notifications yet</p>
              </div>
            )}

            {data &&
              data.notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('Notification clicked:', notification.data.action_url)
                    if (!notification.is_read) {
                      markAsRead(notification.id)
                    }
                    if (notification.data.action_url) {
                      setIsOpen(false)
                      navigate(notification.data.action_url!)
                    }
                  }}
                  className={`border-b border-white/5 p-4 cursor-pointer transition ${
                    notification.is_read ? 'bg-transparent' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">
                        {notification.data.title}
                      </p>
                      <p className="text-sm text-slate-300 line-clamp-2">
                        {notification.data.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Footer */}
          {data && data.notifications.length > 0 && (
            <button
              onClick={() => {
                setIsOpen(false)
                navigate('/notifications')
              }}
              className="block w-full text-center py-3 border-t border-white/10 text-sm font-semibold text-emerald-200 hover:text-emerald-100 hover:bg-white/5 transition"
            >
              View All Notifications →
            </button>
          )}
        </div>,
          document.body
        )
      }
    </div>
  )
}
