# ADR-0008: Deployment and Hardening

## Status

Accepted

## Context

Sprint 3 requires the MVP to be deployable, verifiable, and ready for final QA. The approved stack names Vercel as the deployment target and Vite as the build tool. The app also depends on Supabase OAuth environment variables, so deployment failures should be caught before release whenever possible.

## Options Considered

- Deploy manually from a local `dist` folder.
- Use Vercel defaults with no repository deployment config.
- Add repository-owned Vercel config and a single verification script.

## Decision

Use Vercel with repository-owned `vercel.json` settings for the Vite build command, `dist` output directory, and SPA rewrites to `index.html`. Add `npm run verify:deploy` as the release verification command that runs lint, tests, and production build in sequence. Keep Supabase environment validation in the client config so missing or malformed OAuth configuration fails early.

## Consequences

- Positive: Final QA has one repeatable command before deployment.
- Positive: Browser refreshes and direct links work on protected app routes after Vercel deployment.
- Positive: Bad Supabase deployment configuration surfaces as a clear error.
- Tradeoff: Vercel remains the assumed deployment platform for the MVP.
