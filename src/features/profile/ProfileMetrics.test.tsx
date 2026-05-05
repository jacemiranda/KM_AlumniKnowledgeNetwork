import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfileMetrics } from './ProfileMetrics';

describe('ProfileMetrics', () => {
  const mockBadges = [
    {
      id: 'top-contributor',
      icon: '🏆',
      name: 'Top Contributor',
      description: '50+ helpful responses',
    },
    {
      id: 'rising-star',
      icon: '⭐',
      name: 'Rising Star',
      description: '10+ upvotes in 7 days',
    },
  ];

  it('renders helpfulness score metric', () => {
    render(
      <ProfileMetrics
        helpfulnessScore={342}
        questionsAnswered={18}
        upvoteCount={28}
        badges={mockBadges}
      />
    );

    expect(screen.getByText('342')).toBeInTheDocument();
    expect(screen.getByText('Total Helpfulness Score')).toBeInTheDocument();
  });

  it('renders questions answered metric', () => {
    render(
      <ProfileMetrics
        helpfulnessScore={342}
        questionsAnswered={18}
        upvoteCount={28}
        badges={mockBadges}
      />
    );

    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('Questions Answered')).toBeInTheDocument();
  });

  it('displays upvote count in metric description', () => {
    render(
      <ProfileMetrics
        helpfulnessScore={342}
        questionsAnswered={18}
        upvoteCount={28}
        badges={mockBadges}
      />
    );

    expect(screen.getByText('Earned from 28 upvotes')).toBeInTheDocument();
  });

  it('renders all badges', () => {
    render(
      <ProfileMetrics
        helpfulnessScore={342}
        questionsAnswered={18}
        upvoteCount={28}
        badges={mockBadges}
      />
    );

    expect(screen.getByText('Top Contributor')).toBeInTheDocument();
    expect(screen.getByText('Rising Star')).toBeInTheDocument();
  });

  it('renders badge descriptions', () => {
    render(
      <ProfileMetrics
        helpfulnessScore={342}
        questionsAnswered={18}
        upvoteCount={28}
        badges={mockBadges}
      />
    );

    expect(screen.getByText('50+ helpful responses')).toBeInTheDocument();
    expect(screen.getByText('10+ upvotes in 7 days')).toBeInTheDocument();
  });

  it('uses default badges when not provided', () => {
    render(
      <ProfileMetrics
        helpfulnessScore={342}
        questionsAnswered={18}
        upvoteCount={28}
        badges={[]}
      />
    );

    expect(screen.getByText('Top Contributor')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Sharer')).toBeInTheDocument();
  });
});
