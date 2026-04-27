# ADR-0001: OAuth-Only Authentication and Session Model

## Status

Accepted

## Context

Sprint 1 implements authentication through Supabase Auth with Google OAuth. The product scope explicitly excludes password-based authentication and private messaging, and the app requires session persistence and profile-aware routing for the feed-first flow.

Current implementation behavior:

- `AuthProvider` initializes from `auth.getSession()` and subscribes to `onAuthStateChange`.
- Sign-in uses `signInWithOAuth` with provider `google` and app-origin redirect.
- Session state is enriched with profile data from `profiles` before route access decisions.

## Options Considered

- OAuth-only with Google via Supabase Auth.
- OAuth + email/password local credentials.
- Custom JWT/session service outside Supabase Auth.

## Decision

Adopt OAuth-only authentication for Sprint 1 using Supabase Auth with Google provider, and maintain a profile-backed application session model in the frontend auth context.

## Consequences

- Supports revised MVP scope and avoids out-of-scope password flows.
- Reduces authentication implementation surface area and security maintenance burden.
- Requires correct OAuth redirect configuration per environment.
- Depends on profile availability for role, user type, and setup-completion state.