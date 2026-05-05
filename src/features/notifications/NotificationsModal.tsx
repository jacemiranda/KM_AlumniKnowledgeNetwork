import { FC, useEffect } from 'react';

export interface Notification {
  id: string;
  icon: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationsModalProps {
  notifications: Notification[];
  unreadCount: number;
  onNotificationClick?: (id: string) => void;
  onClose?: () => void;
}

export const NotificationsModal: FC<NotificationsModalProps> = ({
  notifications,
  unreadCount,
  onNotificationClick,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleClick = (id: string) => {
    if (onNotificationClick) {
      onNotificationClick(id);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
      className="w-full max-w-md rounded-[32px] border border-white/10 bg-[#131b2e]/60 shadow-liquid backdrop-blur-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 md:py-5">
        <h2 className="text-xl font-black tracking-tight text-[#dae2fd]">Notifications</h2>
        <p className="mt-1 text-xs text-[#bbcabf]">
          You have {unreadCount} unread
        </p>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-[#bbcabf]">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleClick(notification.id)}
              className={`w-full text-left flex gap-4 cursor-pointer p-4 md:p-5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4edea3] ${
                notification.isRead
                  ? 'border-l-2 border-transparent bg-white/[0.03] hover:bg-white/[0.06]'
                  : 'border-l-2 border-primary bg-gradient-to-r from-primary/20 via-primary/5 to-transparent hover:from-primary/25'
              }`}
            >
              {/* Icon with Indicator */}
              <div className="relative mt-1 flex-shrink-0">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white/10 text-sm font-bold ${
                    notification.isRead
                      ? 'bg-white/10 text-[#bbcabf]'
                      : 'bg-gradient-to-br from-cyan-400/40 to-primary/40 text-primary'
                  }`}
                >
                  {notification.icon}
                </div>
                {!notification.isRead && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary ring-2 ring-[#131b2e]/80 animate-pulse" />
                )}
              </div>

              {/* Notification Content */}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-semibold truncate ${
                    notification.isRead ? 'text-[#bbcabf]' : 'text-[#dae2fd]'
                  }`}
                >
                  {notification.title}
                </p>
                <p
                  className={`mt-1 text-xs line-clamp-2 ${
                    notification.isRead ? 'text-[#bbcabf]/70' : 'text-[#bbcabf]'
                  }`}
                >
                  {notification.description}
                </p>
                <p
                  className={`mt-2 text-xs font-medium ${
                    notification.isRead
                      ? 'text-[#bbcabf]/50'
                      : 'text-primary'
                  }`}
                >
                  {notification.timestamp}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-6 py-3 bg-white/[0.02]">
        <button className="text-sm font-semibold text-primary transition-all duration-300 hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-[#4edea3] rounded-md px-2 py-1 -ml-2">
          View all notifications →
        </button>
      </div>
    </div>
  );
};
