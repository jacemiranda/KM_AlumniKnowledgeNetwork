import { FC } from 'react';

interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
}

interface ProfileMetricsProps {
  helpfulnessScore: number;
  questionsAnswered: number;
  upvoteCount: number;
  badges: Badge[];
}

const DEFAULT_BADGES: Badge[] = [
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
  {
    id: 'knowledge-sharer',
    icon: '📚',
    name: 'Knowledge Sharer',
    description: '15+ posts created',
  },
];

export const ProfileMetrics: FC<ProfileMetricsProps> = ({
  helpfulnessScore,
  questionsAnswered,
  upvoteCount,
  badges = DEFAULT_BADGES,
}) => {
    const displayBadges = badges && badges.length > 0 ? badges : DEFAULT_BADGES;
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      {/* Metrics Dashboard */}
      <section className="rounded-[32px] border border-white/10 bg-[#131b2e]/60 p-4 shadow-liquid backdrop-blur-2xl md:p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-primary/80">
          Your Metrics
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {/* Helpfulness Score Card */}
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Helpfulness Score
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">
                {helpfulnessScore}
              </span>
              <span className="text-xs text-slate-400">points</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Earned from {upvoteCount} upvotes
            </p>
          </div>

          {/* Questions Answered Card */}
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Questions Answered
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-secondary">
                {questionsAnswered}
              </span>
              <span className="text-xs text-slate-400">responses</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Student questions you've answered
            </p>
          </div>
        </div>
      </section>

      {/* Badges Showcase Grid */}
      <section className="rounded-[32px] border border-white/10 bg-[#131b2e]/60 p-4 shadow-liquid backdrop-blur-2xl md:p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-primary/80">
          Badges Showcase
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {displayBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center rounded-[20px] border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur-xl transition hover:border-primary/20 hover:bg-white/[0.08]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-cyan-400/20 text-2xl">
                {badge.icon}
              </div>
              <p className="mt-3 text-xs font-semibold text-white">{badge.name}</p>
              <p className="mt-1 text-[10px] text-slate-500">{badge.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
