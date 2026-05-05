# Week 3 Standup

Date: 2026-04-28
Sprint: Sprint 2 - Core Interaction
Facilitator: M1 - Miranda, Jermaine Carl P.

## Member Updates

### M1 - Project Manager / Scrum Master

- Done:
  - Sprint 1 board evidence and PM prompt log filed (PR-03 opened).
  - Sprint 2 kickoff coordination completed — sprint scope and demo path confirmed with all members.
  - GitHub milestones created for Sprint 1, Sprint 2, and Sprint 3.
- Doing:
  - Monitoring Sprint 2 PR flow across posts, comments, search, and voting.
  - Maintaining GitHub board with Sprint 2 issue assignments and milestone tagging.
- Blocked:
  - None.

### M2 - Full Stack Developer / Technical Lead

- Done:
  - Sprint 1 ADR and changelog PR (#10) merged.
  - All Sprint 1 deliverables closed.
- Doing:
  - Implementing posts, comments, tags, and feed filters (PR-01: Posts Comments and Tags).
  - Starting search service and alumni discovery logic in parallel.
- Blocked:
  - None — schema from Sprint 1 is stable and sufficient for Sprint 2 feature work.

### M3 - UX/UI Designer / Front-End Contributor

- Done:
  - All Sprint 1 UI deliverables merged (wireframes, OAuth shell UI, design system rationale).
- Doing:
  - Setting up Stitch API integration for AI-assisted UI generation (PR-01: Update Stitch Agent Rules).
  - Planning Universal Feed UI with post composer, filters, and comment thread layout.
- Blocked:
  - Stitch API connection required before UI generation can begin — M3 working to resolve MCP setup.

### M4 - Knowledge Management Analyst

- Done:
  - All Sprint 1 KM deliverables merged (SECI foundation, field taxonomy, feed post structure rules).
- Doing:
  - Drafting authority score and voting rationale (PR-01: Authority and Voting Rules).
  - Starting search and retrieval guidelines (PR-02).
- Blocked:
  - None.

### M5 - QA & Documentation Lead

- Done:
  - Sprint 1 QA checklist and documentation artifacts finalized.
- Doing:
  - Drafting Sprint 2 test cases for feed posting, comments, search, and profile metrics.
  - Preparing GitHub issues for Sprint 2 integration testing.
- Blocked:
  - Sprint 2 test cases depend on M2 feature PRs landing — starting with observable behavior planning until PRs merge.

## Decisions

- Sprint 2 integration order confirmed: posts and comments first, then search and alumni discovery, then voting and authority, then UI and documentation.
- M3 will use Stitch API for Sprint 2 UI generation once MCP connection is established.
- Sprint 2 demo path locked: Feed → Post Detail → Search → Alumni Page → Profile → Leaderboard.

## Risks / Blockers

- M3 Stitch API setup has a dependency on MCP connection — tracking as a Sprint 2 blocker. Fallback is manual Tailwind component implementation.
- M5 Sprint 2 test cases are gated on M2 PRs merging — expected mid-week.

## Next Actions

- M1: Open draft PR for Sprint 2 standup notes once Week 3 and Week 4 are complete.
- M2: Merge PR-01 (Posts Comments and Tags), then open PR-02 (Search and Alumni Discovery).
- M3: Resolve Stitch API connection and begin Universal Feed UI (PR-02).
- M4: Merge PR-01 (Authority and Voting Rules) and PR-02 (Search and Retrieval Guidelines).
- M5: Begin Sprint 2 test case drafts as M2 features land.
