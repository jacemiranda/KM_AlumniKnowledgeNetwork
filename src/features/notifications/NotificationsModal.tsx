import { FC } from 'react';

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
}

export const NotificationsModal: FC<NotificationsModalProps> = ({
  notifications,
  unreadCount,
  onNotificationClick,
}) => {
  const handleClick = (id: string) => {
    if (onNotificationClick) {
      onNotificationClick(id);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-[#131b2e]/60 shadow-liquid backdrop-blur-2xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 md:py-5">
        <h2 className="text-xl font-black tracking-tight text-white">Notifications</h2>
        <p className="mt-1 text-xs text-slate-500">
          You have {unreadCount} unread
        </p>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-slate-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleClick(notification.id)}
              className={`flex gap-4 cursor-pointer p-4 md:p-5 transition ${
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
                      ? 'bg-white/10 text-slate-500'
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
                  className={`text-sm font-semibold ${
                    notification.isRead ? 'text-slate-300' : 'text-white'
                  }`}
                >
                  {notification.title}
                </p>
                <p
                  className={`mt-1 text-xs ${
                    notification.isRead ? 'text-slate-500' : 'text-slate-300'
                  }`}
                >
                  {notification.description}
                </p>
                <p
                  className={`mt-2 text-xs font-medium ${
                    notification.isRead
                      ? 'text-slate-600'
                      : 'text-primary'
                  }`}
                >
                  {notification.timestamp}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-6 py-3 bg-white/[0.02]">
        <button className="text-sm font-semibold text-primary transition hover:text-primary/80">
          View all notifications →
        </button>
      </div>
    </div>
  );
};
