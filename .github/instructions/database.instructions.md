---
applyTo: "db/**/*.sql,**/*schema*.*,**/*supabase*.*,**/*migration*.*"
---

Use Supabase/Postgres best practices.

The revised MVP database supports:

- profiles
- fields
- skills
- profile_skills
- posts
- tags
- post_tags
- comments
- votes
- badges
- user_badges

Keep the schema aligned with:

- OAuth-only authentication
- role-aware moderation
- voting and authority score
- feed and comments interaction
- leaderboard and badge support

Do not add:

- conversations table
- messages table
- private messaging logic
- old community approval workflow tables

