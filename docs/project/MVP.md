# MVP Definition

Source document:

- `output/doc/Alumni_Knowledge_Network_MVP_App_Definition_REVISED.docx`

This Markdown file is the AI-friendly version of the approved revised MVP definition.

## 1. App Overview

Alumni Knowledge Network is a web application that supports alumni-student knowledge sharing through a structured feed, searchable profiles, comments, voting, and recognition. The revised MVP is aligned with professor-defined requirements by using OAuth-only authentication, simplified interaction flows, moderation controls, and the SECI knowledge model as the core framework.

## 2. Target Users

- Student
- Alumni
- Moderator
- Admin

## 3. Problem Statement

Students often struggle to access practical academic and career knowledge from alumni in a structured and reusable way. Existing interaction is usually informal, scattered, and difficult to moderate or organize, which makes knowledge transfer inconsistent and hard to sustain.

## 4. Core Solution

The MVP solves this problem by using a universal knowledge feed where students and alumni create posts, comment, vote, search, and build visible contribution records. Instead of private messaging, discussion happens publicly through posts and comments, which better supports knowledge capture, moderation, discoverability, and reuse across the platform.

## 4.1 How SECI Will Be Used

The SECI model is the conceptual foundation of the MVP.

| SECI Phase | Meaning | How the System Uses It |
|---|---|---|
| Socialization | Users share tacit knowledge through direct interaction. | Posts and comments let students and alumni interact, ask follow-up questions, and exchange practical experience. |
| Externalization | Tacit knowledge becomes explicit and reusable. | Advice, insights, and answers are captured as posts and comment discussions. |
| Combination | Explicit knowledge is organized into useful structures. | Fields, tags, search, feed organization, and filtering make knowledge easier to retrieve and connect. |
| Internalization | Users apply knowledge and turn it into personal understanding. | Students use shared knowledge, build understanding, gain authority, and receive badges for participation and contribution. |

## 5. Core Features (MVP ONLY)

The MVP focuses on essential professor-defined requirements only.

- OAuth Authentication
- Profile Management
- Universal Feed
- Posting System
- Comments System
- Voting System
- Leaderboard
- Search System
- Fields and Tags
- Badges
- Basic Notifications Modal
- User and Content Moderation
- Basic Analytics

## 6. App Pages

| Page | Purpose | Main Content / Actions |
|---|---|---|
| Login Page | Allow secure entry to the platform. | Google OAuth login only. No password-based login. |
| Sign-Up / First-Time Setup Page | Collect first-time profile details after OAuth login. | Name, bio, profile picture, field, skills/tags, and end-user type (Student or Alumni). |
| Universal Feed Page | Serve as the main default page after login. | Post list, filters by field/tags/post type, create post actions, comments, tagging, and voting. |
| Profile Page | Show a user's identity and contribution record. | Name, bio, picture, field, skills, posts created, posts tagged in, comments activity, badges, and authority score. |
| Search Results Page | Help users find people and content. | Search by name, field, tags, and skills. Results include users and relevant posts. |
| Alumni / Mentors Page | Provide a dedicated alumni discovery view. | Alumni list, field filters, skills, authority score, badge visibility, and profile preview. |
| Leaderboard Page | Highlight top contributors. | Global ranking and field-filtered ranking based on authority and contribution. |
| Notifications Modal | Provide quick updates without a full page. | Tagged in post, new comment, moderation notice, badge earned, and other simple alerts. |
| User Management Page | Support moderation and operational control. | User blocking, post moderation, comment moderation, field management, badge management, and analytics. |

## 7. User Flow

### Student Flow

1. Student logs in using Google OAuth.
2. Student completes first-time profile setup.
3. Student lands on the Universal Feed.
4. Student browses posts, fields, tags, and alumni contributions.
5. Student searches by name, field, tags, or skills.
6. Student opens alumni profiles and relevant posts.
7. Student creates a question or information post if needed.
8. Student comments on posts to ask follow-up questions or join discussions.
9. Student votes on contributors, checks the leaderboard, and views notifications.

### Alumni Flow

1. Alumni logs in using Google OAuth.
2. Alumni completes first-time profile setup.
3. Alumni lands on the Universal Feed.
4. Alumni browses posts relevant to their field and expertise.
5. Alumni creates information posts or answers student questions through comments.
6. Alumni can be tagged in posts by other users.
7. Alumni builds authority score and earns badges through contribution.
8. Alumni appears in search results, profile discovery, and the leaderboard.

### Moderator and Admin Flow

1. Moderator or Admin logs in using Google OAuth.
2. They access the User Management page.
3. They review inappropriate posts and comments.
4. They block or unblock users when necessary.
5. They manage fields and badges as part of operational governance.
6. They review basic analytics such as total students, total alumni, and online counts.
7. Admin additionally manages role assignment and overrides moderator actions.

## 8. Basic Database Structure

The revised MVP removes private messaging and keeps a simpler but complete structure for feed-based knowledge sharing, comments, moderation, voting, and authority.

Main tables:

- `profiles`
- `fields`
- `skills`
- `profile_skills`
- `posts`
- `tags`
- `post_tags`
- `comments`
- `votes`
- `badges`
- `user_badges`

Authority score can be implemented simply as total upvotes received minus total downvotes received.

## 9. MVP Scope (IMPORTANT)

Include:

- OAuth login only
- First-time sign-up/profile setup
- Universal feed
- Post creation with field, tags, tagged alumni, and post type
- Comments system
- Profile system with authority score
- Voting system
- Search by name, field, tags, and skills
- Alumni / Mentors page
- Leaderboard
- Basic notifications modal
- Admin and Moderator user management
- Badge system
- Basic analytics

Exclude for now:

- Private messaging system
- Conversations and messages tables
- Password-based authentication
- Complex community approval workflow
- Real-time notification system
- Video-call integration
- Recommendation engine
- Complex analytics dashboards
- Advanced badge rules

## 10. Suggested Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Language: TypeScript
- Backend: Supabase PostgreSQL
- Auth: Supabase Auth with Google OAuth
- Routing: React Router
- Data fetching: TanStack Query
- Forms: React Hook Form + Zod
- Deployment: Vercel or Netlify
- Testing: Vitest + React Testing Library + Playwright

## 11. Future Features (Post-MVP)

- AI mentor or content recommendation engine
- Video-call integration
- Advanced badge rules and badge tiers
- Richer analytics dashboard
- More advanced notification delivery channels
- Expanded community management beyond field/tag grouping

## 12. Admin and Moderator Access

The MVP uses a tiered moderation model where both Admin and Moderator roles support daily platform operations, while Admin retains the highest control authority.

- Moderator: block and unblock users, moderate posts and comments, manage badges and fields, review basic analytics, and issue moderation actions
- Admin: all moderator permissions plus role assignment, moderator management, override decisions, and highest-level platform control
