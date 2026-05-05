# Role PR Map

This file is the exact source of truth for AI agents creating branches and draft PRs.

Rules:

- Use the exact branch listed here.
- Use the exact GitHub PR title listed here.
- Target `dev` unless this file says otherwise.
- Use `.github/pull_request_template.md`.
- Do not invent PR titles.

## Sprint 1 - Foundation

### M1 - Project Manager / Scrum Master

#### PR-01
Title: `PR-01: Repo Governance Revised`
Branch: `chore/repo-governance-revised`
Target: `dev`
Deliverable: Branch rules, labels, PR template, and revised board setup.

#### PR-02
Title: `PR-02: Decision Log and Standups Revised`
Branch: `docs/decision-log-and-standups-revised`
Target: `dev`
Deliverable: Decision Log, standup template, and Week 1 note.

#### PR-03
Title: `PR-03: Sprint 1 Tracking Revised`
Branch: `chore/sprint1-tracking-revised`
Target: `dev`
Deliverable: Sprint board evidence, milestones, and PM prompt log.

### M2 - Full Stack Developer / Technical Lead

#### PR-01
Title: `PR-01: Project Scaffold OAuth Shell`
Branch: `feat/project-scaffold-oauth-shell`
Target: `dev`
Deliverable: App structure, routing baseline, and protected shell.

#### PR-02
Title: `PR-02: Profile Field Skill Feed Schema`
Branch: `db/profile-field-skill-feed-schema`
Target: `dev`
Deliverable: Profiles, fields, skills, and feed-base schema.

#### PR-03
Title: `PR-03: OAuth First-Time Setup`
Branch: `feat/oauth-first-time-setup`
Target: `dev`
Deliverable: Google OAuth, first-time setup, and session flow.

#### PR-04
Title: `PR-04: ADR and Changelog Sprint 1 Revised`
Branch: `docs/adr-and-changelog-sprint1-revised`
Target: `dev`
Deliverable: Initial ADRs, CHANGELOG, and developer prompt log.

### M3 - UX/UI Designer / Front-End Contributor

#### PR-01
Title: `PR-01: Wireframes Feed Profile Auth`
Branch: `docs/wireframes-feed-profile-auth`
Target: `dev`
Deliverable: Annotated wireframes for login, setup, feed, and profile.

#### PR-02
Title: `PR-02: OAuth Setup Feed Shell UI`
Branch: `feat/ui-oauth-setup-feed-shell`
Target: `dev`
Deliverable: Login, first-time setup, and feed shell UI.

#### PR-03
Title: `PR-03: Design System Rationale Revised`
Branch: `docs/design-system-rationale-revised`
Target: `dev`
Deliverable: Design system notes, rationale, and designer prompt log.

### M4 - Knowledge Management Analyst

#### PR-01
Title: `PR-01: SECI Foundation Revised`
Branch: `docs/seci-foundation-revised`
Target: `dev`
Deliverable: Revised SECI model aligned to posts, comments, and voting.

#### PR-02
Title: `PR-02: Field and Skill Taxonomy`
Branch: `docs/field-and-skill-taxonomy`
Target: `dev`
Deliverable: Predefined field list, skills guidance, and retrieval rules.

#### PR-03
Title: `PR-03: Feed Post Structure Rules`
Branch: `docs/feed-post-structure-rules`
Target: `dev`
Deliverable: Post types, tagging rules, and alumni tagging guidance.

### M5 - QA & Documentation Lead

#### PR-01
Title: `PR-01: Sprint 1 OAuth Profile Feed Checklist`
Branch: `test/sprint1-oauth-profile-feed-checklist`
Target: `dev`
Deliverable: Auth, setup, and feed-shell acceptance checks.

#### PR-02
Title: `PR-02: README Contributing Revised`
Branch: `docs/readme-contributing-revised`
Target: `dev`
Deliverable: Setup guide, workflow rules, and contributor notes.

#### PR-03
Title: `PR-03: QA Sprint 1 Log Revised`
Branch: `docs/qa-sprint1-log-revised`
Target: `dev`
Deliverable: QA prompt log and Sprint 1 documentation checklist.

## Sprint 2 - Core Interaction

### M1 - Project Manager / Scrum Master

#### PR-01
Title: `PR-01: Standups Sprint 2 Revised`
Branch: `docs/standups-sprint2-revised`
Target: `dev`
Deliverable: Sprint 2 standups, blocker tracking, and coordination notes.

#### PR-02
Title: `PR-02: Decision Log Sprint 2 Revised`
Branch: `docs/decision-log-sprint2-revised`
Target: `dev`
Deliverable: Interaction, moderation, and UX decision updates.

#### PR-03
Title: `PR-03: Sprint 2 Board Audit Revised`
Branch: `chore/sprint2-board-audit-revised`
Target: `dev`
Deliverable: Board evidence, review readiness, and integration tracking.

### M2 - Full Stack Developer / Technical Lead

#### PR-01
Title: `PR-01: Posts Comments and Tags`
Branch: `feat/posts-comments-and-tags`
Target: `dev`
Deliverable: Feed posting, comments, tags, and post-type flow.

#### PR-02
Title: `PR-02: Search and Alumni Discovery`
Branch: `feat/search-and-alumni-discovery`
Target: `dev`
Deliverable: Search system and alumni browse logic.

#### PR-03
Title: `PR-03: Voting Authority and Profile Metrics`
Branch: `feat/voting-authority-profile-metrics`
Target: `dev`
Deliverable: Voting system, authority score, and profile metrics.

#### PR-04
Title: `PR-04: Search Voting Architecture`
Branch: `docs/adr-search-voting-architecture`
Target: `dev`
Deliverable: ADRs, changelog updates, and technical reflection notes.

### M3 - UX/UI Designer / Front-End Contributor

#### PR-01
Title: `PR-01: Universal Feed Posting UI`
Branch: `feat/ui-universal-feed-posting`
Target: `dev`
Deliverable: Feed, composer, filters, and comments UI.

#### PR-02
Title: `PR-02: Search and Alumni Page UI`
Branch: `feat/ui-search-and-alumni-page`
Target: `dev`
Deliverable: Search results and alumni discovery UI.

#### PR-03
Title: `PR-03: Profile Leaderboard Notifications UI`
Branch: `feat/ui-profile-leaderboard-notifications`
Target: `dev`
Deliverable: Profile metrics, leaderboard, and notifications modal UI.

#### PR-04
Title: `PR-04: Design Rationale Sprint 2 Revised`
Branch: `docs/design-rationale-sprint2-revised`
Target: `dev`
Deliverable: Navigation, authority display, and SECI-aligned UI rationale.

### M4 - Knowledge Management Analyst

#### PR-01
Title: `PR-01: Authority and Voting Rules`
Branch: `docs/authority-and-voting-rules`
Target: `dev`
Deliverable: Authority score explanation and voting standards.

#### PR-02
Title: `PR-02: Search and Retrieval Guidelines`
Branch: `docs/search-and-retrieval-guidelines`
Target: `dev`
Deliverable: Search dimensions and retrieval behavior.

#### PR-03
Title: `PR-03: Post and Comment Quality Rules`
Branch: `docs/post-and-comment-quality-rules`
Target: `dev`
Deliverable: Information/question standards and tagging guidance.

### M5 - QA & Documentation Lead

#### PR-01
Title: `PR-01: Sprint 2 Feed Search Voting Cases`
Branch: `test/sprint2-feed-search-voting-cases`
Target: `dev`
Deliverable: Test cases for feed, search, comments, and authority flows.

#### PR-02
Title: `PR-02: GitHub Issues QA Log Revised`
Branch: `test/github-issues-qa-log-revised`
Target: `dev`
Deliverable: Bug reports, reproduction notes, and retest comments.

#### PR-03
Title: `PR-03: Wiki and QA Update Sprint 2`
Branch: `docs/wiki-and-qa-update-sprint2`
Target: `dev`
Deliverable: Wiki structure, QA report, and contribution evidence.

## Sprint 3 - Final Release

### M1 - Project Manager / Scrum Master

#### PR-01
Title: `PR-01: Final Release Coordination Revised`
Branch: `chore/final-release-coordination-revised`
Target: `dev`
Deliverable: Release checklist, deployment readiness, and page-map acceptance.

#### PR-02
Title: `PR-02: Final Decision Log and Board Revised`
Branch: `docs/final-decision-log-and-board-revised`
Target: `dev`
Deliverable: Final decisions, board closure, and standup archive.

#### PR-03
Title: `PR-03: PM Reflection and Presentation Revised`
Branch: `docs/pm-reflection-and-presentation-revised`
Target: `dev`
Deliverable: PM reflection, final demo flow, and prompt log.

### M2 - Full Stack Developer / Technical Lead

#### PR-01
Title: `PR-01: Badges Leaderboard and Analytics`
Branch: `feat/badges-leaderboard-and-analytics`
Target: `dev`
Deliverable: Badge logic, leaderboard, and basic analytics.

#### PR-02
Title: `PR-02: Moderation and User Management`
Branch: `feat/moderation-and-user-management`
Target: `dev`
Deliverable: Block users, moderate posts/comments, and role-aware controls.

#### PR-03
Title: `PR-03: Deploy and Hardening Revised`
Branch: `chore/deploy-and-hardening-revised`
Target: `dev`
Deliverable: Deployment, environment verification, and final integration fixes.

### M3 - UX/UI Designer / Front-End Contributor

#### PR-01
Title: `PR-01: User Management and Moderation UI`
Branch: `feat/ui-user-management-and-moderation`
Target: `dev`
Deliverable: User management, moderation, and analytics UI.

#### PR-02
Title: `PR-02: Final UI Polish Revised`
Branch: `feat/ui-final-polish-revised`
Target: `dev`
Deliverable: Leaderboard, badges, notifications modal, and final accessibility polish.

### M4 - Knowledge Management Analyst

#### PR-01
Title: `PR-01: Badge and Authority Guidelines`
Branch: `docs/badge-and-authority-guidelines`
Target: `dev`
Deliverable: Badge criteria and recognition rationale.

#### PR-02
Title: `PR-02: Moderation and Field Governance`
Branch: `docs/moderation-and-field-governance`
Target: `dev`
Deliverable: Moderation rules, blocking guidance, and field governance.

#### PR-03
Title: `PR-03: SECI Evidence and Analytics Notes`
Branch: `docs/seci-evidence-and-analytics-notes`
Target: `dev`
Deliverable: Final SECI summary and analytics interpretation notes.

### M5 - QA & Documentation Lead

#### PR-01
Title: `PR-01: Final E2E Page Map Revised`
Branch: `test/final-e2e-page-map-revised`
Target: `dev`
Deliverable: Final role-flow QA evidence and page-map verification.

#### PR-02
Title: `PR-02: README and Wiki Final Revised`
Branch: `docs/readme-and-wiki-final-revised`
Target: `dev`
Deliverable: Final README, user guide, and wiki updates.

#### PR-03
Title: `PR-03: Failure Analysis Report Revised`
Branch: `docs/failure-analysis-report-revised`
Target: `dev`
Deliverable: Failure analysis and lessons learned.

#### PR-04
Title: `PR-04: QA Reflection and Signoff Revised`
Branch: `docs/qa-reflection-and-signoff-revised`
Target: `dev`
Deliverable: QA reflection, prompt log, and final sign-off.
