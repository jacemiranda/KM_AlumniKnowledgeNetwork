# 6-Week Sprint Deliverables

Source document:

- `output/doc/Alumni_Knowledge_Network_6_Week_Sprint_Delivery_Plan_REVISED.docx`

This Markdown file is the AI-friendly version of the approved revised 6-week sprint delivery plan.

## Team

| Member | Role | Total PRs |
|---|---|---:|
| M1 - Miranda, Jermaine Carl P. | Project Manager / Scrum Master | 9 |
| M2 - Sanchez, John Marc R. | Full Stack Developer / Technical Lead | 11 |
| M3 - Deocariza, Ramil Jr. V. | UX/UI Designer / Front-End Contributor | 9 |
| M4 - Cruz, Angelo Joseph P. | Knowledge Management Analyst | 9 |
| M5 - Reyes, Diem Andreif F. | QA & Documentation Lead | 10 |

## Global Rules

- PRs target `dev`.
- No direct merges to `main`.
- Each PR must be reviewed by at least one teammate.
- PR titles and branches must match `docs/project/ROLE_PR_MAP.md`.
- Use `.github/pull_request_template.md`.
- Keep PRs module-sized.
- Design, SECI taxonomy, QA, documentation, and presentation PRs count when they are reviewable repository artifacts.
- Every sprint must end with a demonstrable integrated slice, not isolated unfinished files.
- Database and RLS work should be committed in `db/` PRs and verified before UI features depend on them.
- Final delivery requires live deployment, QA evidence, user manual, and presentation-ready documentation.

## Sprint 1 - Foundation, OAuth, Profiles, Feed Base, and SECI Setup

Weeks 1-2.

Gate: Users can sign in using OAuth, complete first-time profile setup, land on the Universal Feed, view the app shell, and interact with the initial field, tag, and SECI-driven content structure.

### M1 - Project Manager / Scrum Master

Expected outputs:

- Repository workflow finalized with main, dev, and member feature branches.
- GitHub Projects board, milestones, issue labels, and Definition of Done configured for the revised MVP.
- Decision Log opened with major decisions for OAuth-only auth, feed-first UX, and simplified scope.
- Standup template and Week 1 coordination notes filed in the repo.
- Prompt log started for AI-assisted planning and coordination work.

### M2 - Full Stack Developer / Technical Lead

Expected outputs:

- Project scaffold initialized with React, Vite, TypeScript, Tailwind, and Supabase-ready structure.
- Google OAuth authentication connected with protected routes and session persistence.
- Profiles, fields, skills, and feed-base schema prepared in Supabase with role and user-type support.
- Universal Feed baseline, first-time setup flow, and shared navigation shell wired to the app.
- ADR folder and initial technical decisions documented.

### M3 - UX/UI Designer / Front-End Contributor

Expected outputs:

- Wireframes completed for login, first-time setup, universal feed, and profile pages.
- Design system foundation finalized for colors, typography, spacing, cards, forms, and responsive layout.
- Frontend implementation completed for OAuth login, setup flow, feed shell, and profile shell.
- Design rationale started with SECI-aligned layout explanation.

### M4 - Knowledge Management Analyst

Expected outputs:

- SECI mapping rewritten for posts, comments, tags, fields, voting, and badges.
- Predefined field taxonomy and skill-tag logic documented for the revised MVP.
- Initial content structure drafted for feed posts, post types, and tagged alumni behavior.
- KM Analyst prompt log started.

### M5 - QA & Documentation Lead

Expected outputs:

- QA template created for auth, first-time setup, profile creation, and feed-shell access.
- README and CONTRIBUTING updated for revised stack, OAuth usage, and PR flow.
- Sprint 1 documentation checklist and QA prompt log created.

## Sprint 2 - Posts, Comments, Search, Voting, Alumni Discovery, and Authority

Weeks 3-4.

Gate: A user can create posts, comment on feed content, search by name, field, tags, and skills, browse alumni contributors, vote on users, and see authority score updates and notification previews without dead navigation.

### M1 - Project Manager / Scrum Master

Expected outputs:

- Sprint 2 integration coordinated across posts, comments, search, voting, and profile visibility.
- Decision Log updated for the comments-based interaction model.
- GitHub board maintained with blockers, review status, and integration checkpoints.
- Sprint 2 demo path coordinated from feed to profile to leaderboard.

### M2 - Full Stack Developer / Technical Lead

Expected outputs:

- Posts, comments, tags, voting, and authority-score logic implemented in the backend and connected to UI flows.
- Search functionality implemented for name, field, tags, and skills across users and content.
- Profile contribution metrics implemented for posts created, posts tagged in, comments activity, badges, and authority score.
- Notification preview data and simple analytics scaffolding prepared for later moderation use.

### M3 - UX/UI Designer / Front-End Contributor

Expected outputs:

- Universal Feed UI completed with post composer, filters, comments, and post-type options.
- Search results page, Alumni / Mentors page, and profile contribution views implemented.
- Leaderboard and notifications modal designed and connected to the app shell.
- UI states completed for loading, empty, and error cases across core discovery pages.

### M4 - Knowledge Management Analyst

Expected outputs:

- Voting and authority score rationale documented to explain contribution quality and recognition.
- Search and retrieval logic refined for fields, skills, tags, and alumni discovery.
- Posting and comment standards documented for Information versus Question post types.

### M5 - QA & Documentation Lead

Expected outputs:

- At least 10 test cases prepared for posting, comments, search, profile metrics, and voting.
- GitHub issues filed for defects or UX problems found in Sprint 2 integration.
- Wiki and QA logs updated with sprint evidence and retest results.

## Sprint 3 - Leaderboard, Moderation, Badges, Analytics, QA, and Release

Weeks 5-6.

Gate: The live MVP is accessible, students and alumni can complete their feed-centered flows, leaderboard and badges are active, Admin and Moderator tools work for blocking users and moderating content, basic analytics are visible, and final QA and documentation are complete.

### M1 - Project Manager / Scrum Master

Expected outputs:

- Final release coordinated with page-map acceptance, QA evidence, and role demo coverage.
- Decision Log completed with final scope, moderation, analytics, and release decisions.
- Final presentation and defense support materials coordinated with all members.
- PM reflection and prompt log completed.

### M2 - Full Stack Developer / Technical Lead

Expected outputs:

- Badge awarding logic, leaderboard queries, moderation actions, user blocking, and analytics endpoints completed.
- Admin and Moderator role permissions enforced for content moderation and user management.
- Deployment finalized and production verification completed with final integration fixes.

### M3 - UX/UI Designer / Front-End Contributor

Expected outputs:

- User Management page completed for Admin and Moderator use.
- Final UI polish applied to leaderboard, badges, moderation screens, analytics summary, and notifications modal.
- Accessibility and navigation audit completed across the full MVP page map.

### M4 - Knowledge Management Analyst

Expected outputs:

- Badge criteria, moderation rules, and field governance guidelines finalized.
- SECI evidence summary completed for oral defense and submission.
- Analytics interpretation notes prepared so Admin and Moderator metrics remain meaningful and simple.

### M5 - QA & Documentation Lead

Expected outputs:

- Final production QA completed across auth, setup, feed, comments, search, alumni page, leaderboard, moderation, analytics, and badges.
- README, wiki, user guide, and failure analysis finalized.
- Outdated messaging and community-approval assumptions removed from final QA documentation.
- Final acceptance checklist confirms all revised MVP pages are reachable and usable in the live app.
