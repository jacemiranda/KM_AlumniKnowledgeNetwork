# Alumni Knowledge Network

Alumni Knowledge Network is a web-based knowledge-sharing platform that connects students and alumni through a universal feed, searchable profiles, comments, voting, leaderboard visibility, badges, and moderation tools.

The MVP uses the SECI knowledge-management model as its foundation:

- Socialization through posts and comments
- Externalization through documented knowledge posts and discussions
- Combination through fields, tags, search, and feed organization
- Internalization through contribution, recognition, and badge growth

## Team

| Member | Role |
|---|---|
| Miranda, Jermaine Carl P. | Project Manager / Scrum Master |
| Sanchez, John Marc R. | Full Stack Developer / Technical Lead |
| Deocariza, Ramil Jr. V. | UX/UI Designer / Front-End Contributor |
| Cruz, Angelo Joseph P. | Knowledge Management Analyst |
| Reyes, Diem Andreif F. | QA & Documentation Lead |

## MVP Modules

- OAuth Authentication (Google OAuth only)
- First-Time Profile Setup
- Universal Feed
- Posts (Information and Question types)
- Comments
- Search (name, field, tags, skills)
- Alumni / Mentors Page
- Voting and Authority Score
- Leaderboard
- Notifications Modal
- Badges
- User and Content Moderation
- Basic Analytics

## Roles

| Role | Description |
|---|---|
| Admin | Full platform control, role assignment, moderator override |
| Moderator | Block/unblock users, moderate posts and comments, manage fields and badges, view analytics |
| Student | Browse feed, create posts, comment, vote, search, view leaderboard |
| Alumni | Share knowledge posts, answer through comments, earn authority score and badges |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (included with Node.js)
- A [Supabase](https://supabase.com/) project with Google OAuth configured

### Clone and Install

```bash
git clone https://github.com/jacemiranda/KM_AlumniKnowledgeNetwork.git
cd KM_AlumniKnowledgeNetwork
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Required variables:

```bash
VITE_SUPABASE_URL=          # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=     # Your Supabase anonymous/public key
```

Optional (for StitchMCP UI generation):

```bash
STITCH_API_KEY=             # Stitch API key from project admin
STITCH_PROJECT_ID=          # Shared Stitch project ID
```

> **Warning:** Never commit real secrets. The `.gitignore` excludes `.env` and `.env.*` files (except `.env.example`).

### Database Setup

Run the SQL migration files in order against your Supabase project (via the Supabase SQL Editor or CLI):

1. `db/migrations/001_profile_field_skill_feed_schema.sql` — Profiles, fields, skills, and feed-base schema with RLS
2. `db/migrations/002_comments_votes_schema.sql` — Comments and votes tables with RLS
3. `db/migrations/003_search_indexes.sql` — Full-text search vectors, indexes, and helper functions
4. `db/migrations/004_badges_leaderboard_analytics.sql` — Badges, user badges, auto-award, and analytics
5. `db/migrations/005_moderation_helpers.sql` — Moderation log, admin helpers, and default admin seeding

### Run the Dev Server

```bash
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check with `tsc --noEmit` and create production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run Vitest tests once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run verify:deploy` | Run lint, tests, and production build (pre-deploy check) |

## Approved Tech Stack

| Area | Tool |
|---|---|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router |
| Server State | TanStack Query |
| Forms | React Hook Form + Zod |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase PostgreSQL + RLS |
| Storage | Supabase Storage |
| Deployment | Vercel |
| Unit Tests | Vitest |
| Component Tests | React Testing Library |
| E2E Tests | Playwright |

Do not switch frameworks or backend platforms without explicit team approval. See `docs/project/TECH_STACK.md` for details.

## Project Structure

```
├── .github/                  # PR template
├── db/migrations/            # Supabase SQL migrations (run in order)
├── docs/
│   ├── adr/                  # Architecture Decision Records
│   ├── km/                   # Knowledge management docs (SECI, taxonomy)
│   ├── project/              # MVP, sprint deliverables, tech stack, role map
│   ├── prompt-logs/          # AI prompt logs per member
│   ├── standups/             # Weekly standup notes
│   └── test-cases/           # QA test case documents
├── public/                   # Static assets
├── src/
│   ├── app/                  # Router, providers, app-level config
│   ├── features/             # Feature modules
│   │   ├── alumni/           # Alumni discovery and profile
│   │   ├── analytics/        # Basic analytics
│   │   ├── auth/             # OAuth login
│   │   ├── badges/           # Badge display and service
│   │   ├── feed/             # Universal feed, post composer, post cards
│   │   ├── leaderboard/      # Leaderboard page and service
│   │   ├── moderation/       # User management and moderation
│   │   ├── notifications/    # Notifications modal
│   │   ├── profile/          # Profile page and metrics
│   │   ├── search/           # Search page and service
│   │   ├── setup/            # First-time profile setup
│   │   └── shell/            # App shell (sidebar, layout)
│   ├── lib/                  # Shared utilities and Supabase client
│   ├── pages/                # Page-level route components
│   └── test/                 # Test setup and helpers
├── AGENTS.md                 # AI agent instructions
├── CHANGELOG.md              # Project changelog
├── CONTRIBUTING.md           # Contributor workflow guide
└── README.md                 # This file
```

## Development Flow

```
feature branch → PR → dev → release PR → main
```

Rules:

- Do not merge directly to `main`.
- All PRs target `dev`.
- Each PR must be reviewed by at least one teammate.
- PR titles and branches must match `docs/project/ROLE_PR_MAP.md`.
- Use `.github/pull_request_template.md` for all PRs.
- Keep PRs module-sized and focused on one deliverable.

See `CONTRIBUTING.md` for the full contributor workflow.

## Deployment

Vercel is the MVP deployment target.

1. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project settings.
2. Run `npm run verify:deploy` locally before opening a deployment PR.
3. The `vercel.json` config handles Vite builds and SPA route rewrites automatically.

## Project Documentation

| Document | Purpose |
|---|---|
| `AGENTS.md` | AI agent rules and source-of-truth order |
| `docs/project/ROLE_PR_MAP.md` | PR assignments, branches, and titles per member |
| `docs/project/SPRINT_DELIVERABLES.md` | Sprint outputs and gates |
| `docs/project/MVP.md` | Product behavior, page map, and SECI usage |
| `docs/project/TECH_STACK.md` | Approved tools and frameworks |
| `docs/project/ACCEPTANCE_CRITERIA.md` | Final quality and runnable-app checks |
| `CONTRIBUTING.md` | Branch, PR, commit, and review workflow |
| `docs/decision-log.md` | Key project decisions |

## Team AI Setup (StitchMCP)

This project uses **StitchMCP** for UI generation and design automation. To ensure all team members have access to the same design workspace:

1. **Get an API Key**: Obtain your `STITCH_API_KEY` from the project administrator.
2. **Setup Local Environment**:
   - Copy `.env.example` to `.env`.
   - Paste your API key and the shared `STITCH_PROJECT_ID` into the respective fields.
3. **Configure your AI Assistant**:
   - Use the template provided in [.mcp/config.json](.mcp/config.json).
   - For **Antigravity**: Merge the `StitchMCP` entry from `.mcp/config.json` into your global `mcp_config.json`.
   - For **Claude Desktop**: Update your `claude_desktop_config.json` with the same entry.
