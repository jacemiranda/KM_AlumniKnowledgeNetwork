# ADR-0002: Feed-First Route Architecture with Setup-Gated Access

## Status

Accepted

## Context

The revised MVP is feed-first, but users must complete first-time setup before accessing the main app shell. The current route structure uses guarded routing to enforce authentication and setup completion.

Current implementation behavior:

- `ProtectedRoute` gates private routes behind authenticated sessions.
- `SetupGuard` allows `/setup` only until profile setup is complete.
- The `AppShell` hosts the primary application routes, with `/` resolving to the feed.

## Options Considered

- Setup-gated routing with dedicated guard components.
- Single route with in-page setup modal before feed interaction.
- Allow feed access before setup and prompt completion later.

## Decision

Use route-level guards with an explicit setup gate so authenticated users must complete setup before entering feed-first routes under the app shell.

## Consequences

- Enforces consistent profile completeness before core interactions.
- Keeps routing logic explicit and testable via guard boundaries.
- Introduces redirect complexity that must be covered by auth/setup tests.
- Requires setup page and guard behavior to stay aligned with profile completion semantics.