type FeedTab = 'For You' | 'Following' | 'My Field'

type FeedPost = {
  id: string
  author: string
  meta: string
  title?: string
  body: string
  tags: string[]
  postType?: 'Question' | 'Information'
  votes: number
  comments: number
}

const tabs: FeedTab[] = ['For You', 'Following', 'My Field']

const posts: FeedPost[] = [
  {
    id: '1',
    author: 'Dr. Sarah Jenkins',
    meta: 'Quantum Computing Researcher · 2h',
    title: 'Breakthrough in Qubit Coherence Times',
    body: 'Our lab observed a 40% increase in coherence times using a diamond-defect substrate strategy. This can lower error-correction overhead in practical deployments.',
    tags: ['#QuantumPhysics', '#Research'],
    postType: 'Information',
    votes: 342,
    comments: 45,
  },
  {
    id: '2',
    author: 'Marcus Kensington',
    meta: 'PhD Candidate, Cognitive Science · 5h',
    body: 'Looking for mentors experienced in fMRI artifact rejection with motion-heavy datasets. Any robust Python toolchains or practical workflows?',
    tags: ['#Neuroscience', '#Python'],
    postType: 'Question',
    votes: 89,
    comments: 12,
  },
]

const trendingTopics = [
  'New LLM diagnostics benchmark released',
  'Room-temperature superconductor claims reviewed',
  'NeurIPS abstract deadline this week',
]

const suggestedMentors = [
  { name: 'Prof. Alan Turing', field: 'Computer Science' },
  { name: 'Engr. Leila Ramos', field: 'Electrical Engineering' },
]

function FeedComposer() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-liquid backdrop-blur-2xl sm:p-5">
      <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-4">
        <textarea
          className="h-24 w-full resize-none bg-transparent text-sm text-white placeholder:text-slate-500 focus-visible:outline-none"
          placeholder="Share a practical insight, ask a question, or tag an alumni expert..."
        />
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
          <div className="flex gap-2">
            <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-300">
              Media
            </button>
            <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-300">
              Poll
            </button>
          </div>
          <button className="rounded-full border border-emerald-300/40 bg-emerald-300/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-100">
            Post
          </button>
        </div>
      </div>
    </section>
  )
}

function FeedFilters() {
  return (
    <div className="flex gap-5 border-b border-white/10 pb-3 text-sm">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          className={
            index === 0
              ? 'border-b-2 border-emerald-300 pb-2 font-bold text-emerald-200'
              : 'pb-2 text-slate-400 transition hover:text-slate-200'
          }
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

function PostCard({ post }: { post: FeedPost }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-liquid backdrop-blur-2xl transition hover:-translate-y-0.5">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white">{post.author}</p>
          <p className="text-xs text-slate-400">{post.meta}</p>
        </div>
        <button className="rounded-full p-1 text-slate-400 transition hover:bg-white/10 hover:text-white" aria-label="Post options">
          ...
        </button>
      </header>

      {post.title ? <h2 className="text-xl font-black tracking-tight text-white">{post.title}</h2> : null}
      <p className="mt-2 text-sm text-slate-300">{post.body}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.postType ? (
          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
              post.postType === 'Question'
                ? 'border-amber-300/40 bg-amber-300/15 text-amber-100'
                : 'border-emerald-300/40 bg-emerald-300/15 text-emerald-100'
            }`}
          >
            {post.postType}
          </span>
        ) : null}
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 bg-ink-900/50 px-3 py-1 text-xs text-slate-300">
            {tag}
          </span>
        ))}
      </div>

      <footer className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-400">
        <div className="flex gap-4">
          <button className="transition hover:text-emerald-200">Upvote {post.votes}</button>
          <button className="transition hover:text-amber-200">Comment {post.comments}</button>
        </div>
        <button className="transition hover:text-slate-200">Save</button>
      </footer>
    </article>
  )
}

function RightRail() {
  return (
    <aside className="hidden w-72 shrink-0 space-y-4 lg:block">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-liquid backdrop-blur-2xl">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-white">Trending</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {trendingTopics.map((topic) => (
            <li key={topic} className="rounded-xl bg-ink-900/50 p-2">
              {topic}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-liquid backdrop-blur-2xl">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-white">Suggested Mentors</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {suggestedMentors.map((mentor) => (
            <li key={mentor.name} className="flex items-center justify-between rounded-xl bg-ink-900/50 p-2">
              <div>
                <p className="font-bold text-slate-100">{mentor.name}</p>
                <p className="text-xs text-slate-400">{mentor.field}</p>
              </div>
              <button className="rounded-full border border-white/10 px-2 py-1 text-xs">Follow</button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}

export function FeedPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-6">
      <section className="flex-1 space-y-5">
        <FeedComposer />
        <FeedFilters />

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300 shadow-liquid backdrop-blur-2xl">
            No feed posts yet. Be the first to share a useful insight.
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>

      <RightRail />
    </div>
  )
}
