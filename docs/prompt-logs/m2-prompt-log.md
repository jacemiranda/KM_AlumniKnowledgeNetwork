# M2 Prompt Log

Member: M2
Role: Full Stack Developer / Technical Lead

## Entry 1

Date: 2026-04-26
Sprint: Sprint 1 - Foundation
PR: PR-01: Project Scaffold OAuth Shell
Tool / AI Used: GitHub Copilot Chat

Prompt:

```text
Scaffold a Vite + React + TypeScript app structure with route placeholders for login, setup, feed, profile, alumni, leaderboard, and notifications.
```

Output Used:

- Proposed app folder structure and base route map.
- Suggested page placeholders and shell layout wiring.

Changes Made After Review:

- Adjusted folder naming to match team conventions.
- Kept only revised MVP pages; excluded messaging pages.

Reflection:

- What helped? Faster baseline structure planning.
- What did you verify? Page map alignment with MVP and sprint deliverables.
- What did you change manually? Route organization and import paths.

## Entry 2

Date: 2026-04-26
Sprint: Sprint 1 - Foundation
PR: PR-01: Project Scaffold OAuth Shell
Tool / AI Used: GitHub Copilot Chat

Prompt:

```text
Generate a protected route pattern for authenticated-only routes in React Router with clear unauthenticated redirects.
```

Output Used:

- `ProtectedRoute` wrapper approach using outlet composition.
- Redirect behavior guidance for unauthenticated users.

Changes Made After Review:

- Integrated with existing auth context status model.
- Added loading-state handling before redirect logic.

Reflection:

- What helped? Reliable route-guard skeleton.
- What did you verify? Redirect behavior and auth-state transitions.
- What did you change manually? Guard edge-case handling.

## Entry 3

Date: 2026-04-26
Sprint: Sprint 1 - Foundation
PR: PR-02: Profile Field Skill Feed Schema
Tool / AI Used: GitHub Copilot Chat

Prompt:

```text
Draft a Supabase SQL migration for profiles, fields, skills, and feed-base tables using revised MVP scope and role-aware access.
```

Output Used:

- Table and enum structure candidate.
- Initial RLS policy direction and indexing suggestions.

Changes Made After Review:

- Tightened constraints and FK relationships.
- Removed out-of-scope messaging-related entities.

Reflection:

- What helped? Fast first-pass schema outline.
- What did you verify? Scope boundaries and relational integrity.
- What did you change manually? Policy details and migration ordering.

## Entry 4

Date: 2026-04-26
Sprint: Sprint 1 - Foundation
PR: PR-02: Profile Field Skill Feed Schema
Tool / AI Used: GitHub Copilot Chat

Prompt:

```text
Suggest RLS policies for profiles, posts, and taxonomy tables with moderator/admin controls and user self-service boundaries.
```

Output Used:

- Role-check helper function pattern.
- Policy templates for select/insert/update controls.

Changes Made After Review:

- Aligned policy checks to existing role enum values.
- Reviewed for least-privilege behavior in user updates.

Reflection:

- What helped? Reduced policy design iteration time.
- What did you verify? Policy correctness against moderator and end-user paths.
- What did you change manually? Final SQL policy clauses.

## Entry 5

Date: 2026-04-26
Sprint: Sprint 1 - Foundation
PR: PR-03: OAuth First-Time Setup
Tool / AI Used: GitHub Copilot Chat

Prompt:

```text
Implement an auth context that restores Supabase session on app load and keeps profile data in sync after auth events.
```

Output Used:

- Session initialization and auth-state subscription flow.
- Structured auth context value for session/profile/status/error.

Changes Made After Review:

- Mapped profile fields to app-session shape.
- Added defensive error messaging and status transitions.

Reflection:

- What helped? Clear lifecycle flow for auth bootstrap.
- What did you verify? Initial load behavior and auth-state updates.
- What did you change manually? Type shaping and fallback values.

## Entry 6

Date: 2026-04-26
Sprint: Sprint 1 - Foundation
PR: PR-03: OAuth First-Time Setup
Tool / AI Used: GitHub Copilot Chat

Prompt:

```text
Create first-time setup persistence logic for profile details, selected field, and selected skills using Supabase tables.
```

Output Used:

- Profile update flow with setup-complete flag update.
- Profile-skills replace strategy (delete then insert selected skills).

Changes Made After Review:

- Added error guards for unavailable queries.
- Ensured id-based update paths are explicit.

Reflection:

- What helped? Reduced boilerplate for CRUD flow.
- What did you verify? Setup data persistence and retrieval mapping.
- What did you change manually? Query type guards and field mapping.

## Entry 7

Date: 2026-04-26
Sprint: Sprint 1 - Foundation
PR: PR-03: OAuth First-Time Setup
Tool / AI Used: GitHub Copilot Chat

Prompt:

```text
Implement setup-gated routing so users without completed setup are redirected to /setup and completed users cannot revisit setup.
```

Output Used:

- `SetupGuard` conditional redirect pattern.
- Branching for loading, missing session, and completion states.

Changes Made After Review:

- Composed guards with existing protected routes.
- Verified default route lands on feed after completion.

Reflection:

- What helped? Straightforward route-gate expression.
- What did you verify? Redirect loops and completion transitions.
- What did you change manually? Guard composition order.

## Entry 8

Date: 2026-04-26
Sprint: Sprint 1 - Foundation
PR: PR-03: OAuth First-Time Setup
Tool / AI Used: GitHub Copilot Chat

Prompt:

```text
Write focused tests for auth context and setup page behavior with mocked Supabase clients.
```

Output Used:

- Test-case outline for success and error scenarios.
- Mock strategy for session/profile/query responses.

Changes Made After Review:

- Adapted test fixtures to project test setup utilities.
- Removed brittle assertions and kept behavior-focused checks.

Reflection:

- What helped? Better test case coverage planning.
- What did you verify? Auth/setup paths and failure handling.
- What did you change manually? Final assertions and fixture values.

## Entry 9

Date: 2026-04-26
Sprint: Sprint 1 - Foundation
PR: PR-04: ADR and Changelog Sprint 1 Revised
Tool / AI Used: GitHub Copilot Chat

Prompt:

```text
Draft ADR content for implemented Sprint 1 decisions: OAuth-only auth model, setup-gated feed-first routing, and Supabase schema baseline.
```

Output Used:

- ADR structure with required sections and accepted status.
- Decision rationale and tradeoff bullets tied to current implementation.

Changes Made After Review:

- Kept ADR scope limited to implemented decisions only.
- Removed deployment ADR from this PR scope.

Reflection:

- What helped? Fast conversion of implementation facts into ADR format.
- What did you verify? Section completeness and file naming conventions.
- What did you change manually? Final wording for scope precision.

## Entry 10

Date: 2026-04-26
Sprint: Sprint 1 - Foundation
PR: PR-04: ADR and Changelog Sprint 1 Revised
Tool / AI Used: GitHub Copilot Chat

Prompt:

```text
Produce a concise changelog update that includes only documentation artifacts completed in PR-04.
```

Output Used:

- Proposed docs-only Unreleased changelog bullet.
- Scope guard language to avoid runtime feature claims.

Changes Made After Review:

- Limited wording to ADR and prompt-log additions only.
- Ensured entry remains auditable against branch artifacts.

Reflection:

- What helped? Kept changelog concise and verifiable.
- What did you verify? No overstatement beyond branch deliverables.
- What did you change manually? Final phrasing and placement.