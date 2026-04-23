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

- OAuth Authentication
- First-Time Profile Setup
- Universal Feed
- Posts
- Comments
- Search
- Alumni / Mentors Page
- Voting and Authority Score
- Leaderboard
- Notifications Modal
- Badges
- User and Content Moderation
- Basic Analytics

## Roles

- Admin
- Moderator
- End User - Student
- End User - Alumni

## Approved Tech Stack

- React + Vite + TypeScript
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form + Zod
- Supabase Auth + PostgreSQL + RLS + Storage
- Vercel
- Vitest + React Testing Library + Playwright


## Project Docs

AI agents and team members should read:

- `AGENTS.md`
- `docs/project/ROLE_PR_MAP.md`
- `docs/project/SPRINT_DELIVERABLES.md`
- `docs/project/MVP.md`
- `docs/project/TECH_STACK.md`
- `docs/project/AI_PR_WORKFLOW.md`

## Database

Supabase migrations are stored in:

`db/migrations/`

## Development Flow

`feature branch -> PR -> dev -> release PR -> main`

Rules:

- Do not merge directly to `main`.
- Each PR must be reviewed by at least one teammate.
- Each PR must follow `.github/pull_request_template.md`.
- PR title and branch must match `docs/project/ROLE_PR_MAP.md`.

## Environment Variables

Create `.env.local` from `.env.example` when the app is scaffolded.

Expected variables:

`VITE_SUPABASE_URL=`
`VITE_SUPABASE_ANON_KEY=`

Never commit real secrets.
