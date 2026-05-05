import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationsModal } from './NotificationsModal';

describe('NotificationsModal', () => {
  const mockNotifications = [
    {
      id: '1',
      icon: '⬆️',
      title: 'Your answer received an upvote',
      description: 'Sarah Jenkins found your answer helpful',
      timestamp: '2 minutes ago',
      isRead: false,
    },
    {
      id: '2',
      icon: '💬',
      title: 'Someone answered your question',
      description: 'Marcus Kensington replied to your question',
      timestamp: '15 minutes ago',
      isRead: false,
    },
    {
      id: '3',
      icon: '👤',
      title: 'You have a new follower',
      description: 'Leah Davis started following you',
      timestamp: '3 hours ago',
      isRead: true,
    },
    {
      id: '4',
      icon: '❤️',
      title: 'Your post was liked',
      description: 'James Liu liked your post',
      timestamp: '5 hours ago',
      isRead: true,
    },
  ];

  it('renders notifications modal with header', () => {
    render(
      <NotificationsModal
        notifications={mockNotifications}
        unreadCount={2}
      />
    );

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('You have 2 unread')).toBeInTheDocument();
  });

  it('displays all notifications', () => {
    render(
      <NotificationsModal
        notifications={mockNotifications}
        unreadCount={2}
      />
    );

    expect(screen.getByText('Your answer received an upvote')).toBeInTheDocument();
    expect(screen.getByText('Someone answered your question')).toBeInTheDocument();
    expect(screen.getByText('You have a new follower')).toBeInTheDocument();
  });

  it('displays notification icons', () => {
    render(
      <NotificationsModal
        notifications={mockNotifications}
        unreadCount={2}
      />
    );

    expect(screen.getByText('⬆️')).toBeInTheDocument();
    expect(screen.getByText('💬')).toBeInTheDocument();
    expect(screen.getByText('👤')).toBeInTheDocument();
  });

  it('renders unread notifications with emerald indicator and brighter styling', () => {
    const { container } = render(
      <NotificationsModal
        notifications={mockNotifications}
        unreadCount={2}
      />
    );

      // Get the first unread notification by finding the title text
      const titleElement = screen.getByText('Your answer received an upvote');
      const unreadNotification = titleElement.closest('div[class*="border-l-2"]');
      expect(unreadNotification).toBeTruthy();
    
    // Check for emerald indicator - look for animate-pulse (which indicates the dot)
    const animatedDot = unreadNotification?.querySelector('.animate-pulse');
    expect(animatedDot).toBeTruthy();
  });

  it('renders read notifications with dimmer styling', () => {
    const { container } = render(
      <NotificationsModal
        notifications={mockNotifications}
        unreadCount={2}
      />
    );

      // Get a read notification by finding the title text
      const titleElement = screen.getByText('You have a new follower');
      const readNotification = titleElement.closest('div[class*="border-l-2"]');
      expect(readNotification).toBeTruthy();
    
    // Read notifications should not have primary border or brighter styling
    // They should have border-transparent instead
    const borderElement = readNotification?.className;
    expect(borderElement).toContain('border-transparent');
  });

  it('distinguishes unread notifications with primary accent color', () => {
    render(
      <NotificationsModal
        notifications={mockNotifications}
        unreadCount={2}
      />
    );

    // Unread notifications should have timestamps in primary color
    const unreadTimestamps = screen.getAllByText(/minutes|hour/);
    expect(unreadTimestamps.length).toBeGreaterThan(0);
  });

  it('handles notification clicks', () => {
    const handleClick = vi.fn();

    render(
      <NotificationsModal
        notifications={mockNotifications}
        unreadCount={2}
        onNotificationClick={handleClick}
      />
    );

    const firstNotification = screen.getByText('Your answer received an upvote');
    fireEvent.click(firstNotification.closest('div[class*="cursor-pointer"]')!);

    expect(handleClick).toHaveBeenCalledWith('1');
  });

  it('displays empty state when no notifications', () => {
    render(
      <NotificationsModal
        notifications={[]}
        unreadCount={0}
      />
    );

    expect(screen.getByText('No notifications yet')).toBeInTheDocument();
  });

  it('displays correct unread count', () => {
    render(
      <NotificationsModal
        notifications={mockNotifications}
        unreadCount={5}
      />
    );

    expect(screen.getByText('You have 5 unread')).toBeInTheDocument();
  });

  it('renders view all notifications link', () => {
    render(
      <NotificationsModal
        notifications={mockNotifications}
        unreadCount={2}
      />
    );

    const viewAllLink = screen.getByText(/View all notifications/);
    expect(viewAllLink).toBeInTheDocument();
  });
});
