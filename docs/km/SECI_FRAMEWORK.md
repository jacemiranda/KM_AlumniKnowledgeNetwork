# SECI Framework — Alumni Knowledge Network

## Overview
The SECI model is the conceptual foundation of this platform.
It explains how tacit alumni experience becomes explicit, organized,
and reusable knowledge for students.

## SECI Phases and Platform Mapping

### Socialization (Tacit → Tacit)
Users share experience through direct interaction.
- Platform mechanism: Posts and comments
- Example: An alumni answers a student's question about internship applications in a comment thread
- Key tables: `posts`, `comments`

### Externalization (Tacit → Explicit)
Personal experience becomes captured, readable knowledge.
- Platform mechanism: Post creation (Information and Question types)
- Example: An alumni writes an Information post summarizing what to expect in a technical interview
- Key tables: `posts`, `tags`, `post_tags`

### Combination (Explicit → Explicit)
Structured knowledge is organized and made retrievable.
- Platform mechanism: Fields, tags, search, feed filtering, and leaderboard
- Example: Students filter posts by field (e.g. Software Engineering) and tag (e.g. internship)
- Key tables: `fields`, `tags`, `post_tags`, `profile_skills`

### Internalization (Explicit → Tacit)
Users apply knowledge and build personal understanding.
- Platform mechanism: Voting, badges, authority score, leaderboard
- Example: A student reads alumni posts, applies the advice, and earns a badge for their own contributions
- Key tables: `votes`, `badges`, `user_badges`

## Notes
- All four SECI phases are supported in the MVP without private messaging.
- Comments replace private messaging as the socialization channel.
- The authority score is the primary signal of internalization and contribution.
