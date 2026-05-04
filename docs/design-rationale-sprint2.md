# Design Rationale

Role: M3 UX/UI Designer / Front-End Contributor  
Sprint: Sprint 2  
PR: PR-05: Design Rationale Sprint 2 Revised

This document explains how the Sprint 2 interface evolved from the Sprint 1 feed-first shell into a broader discovery and recognition layer. The design goal was not to add isolated screens, but to extend the existing Liquid Material system so users can move naturally between feed, search, alumni discovery, authority signals, and lightweight notifications without losing orientation.

## 1. Navigation & App Shell Evolution

Sprint 2 expanded the app shell from a single feed-centered layout into a multi-surface navigation model that supports the Universal Feed, Search, Alumni Discovery, Leaderboard, and floating Notifications Modal. The main design decision was to keep navigation persistent and visible rather than hiding core destinations behind nested menus or dead-end routes. That matters because Sprint 2’s user journey is no longer only “log in and browse the feed”; it is now “discover, compare, evaluate, and return.”

The Universal Feed remains the primary home surface because it anchors the social rhythm of the product. Search and Alumni Discovery function as adjacent entry points that help users move from broad content browsing into targeted retrieval and expert finding. The Leaderboard sits alongside those surfaces as a recognition layer, not a detached scoreboard, so users can quickly compare contributors after exploring posts, profiles, or alumni expertise. The Notifications Modal floats above the shell as a lightweight interrupt layer, giving users updates without forcing them to leave the current context.

The shell therefore evolved into a simple but complete wayfinding system. Feed supports ongoing participation, Search supports retrieval, Alumni Discovery supports expert lookup, Leaderboard supports contribution visibility, and Notifications support return visits. Keeping those destinations in one consistent shell reduces cognitive load and prevents the app from feeling like a set of disconnected pages. Mobile and desktop layouts both follow the same logic: the shell must preserve the user’s current place while still making the next relevant action obvious.

## 2. Authority Display & Gamification

Sprint 2 introduces a more explicit visual language for authority and recognition. The profile surface uses a “Helpfulness Rating” style treatment with five Gold Stars in `#ffb95f` to communicate contribution quality in a way that feels immediate, readable, and aspirational. Gold was chosen because it aligns with the existing Liquid Material palette while also carrying a familiar recognition cue that is easy to understand at a glance. The intention is to make authority feel earned, not mechanically scored.

The leaderboard extends that same recognition language with a top-3 highlight system. Rank 1 uses the strongest Gold treatment, rank 2 uses Silver, and rank 3 uses Bronze. That hierarchy makes the most meaningful contributors stand out without forcing users to parse numbers first. The goal is not to create a competitive gaming atmosphere, but to provide a clear and graceful ranking structure that rewards helpful participation and lets users quickly identify who is leading in the community.

Badges complete the gamification layer. In Liquid Material terms, badges act like compact trust markers embedded into the same glass-and-glow visual system as the rest of the interface. They work because they are small, legible, and attached to contribution history rather than being purely decorative. The badge grid on profiles reinforces the idea that progress in the platform is cumulative and visible. Together, the stars, leaderboard highlights, and badges form a single recognition system: stars describe helpfulness, leaderboard highlights show relative standing, and badges communicate milestones and sustained contribution.

## 3. SECI Alignment (Sprint 2 Focus)

Sprint 2 strengthens the SECI model by making knowledge retrieval and expert discovery more intentional. Search and the Alumni Grid are the key Combination surfaces. They organize explicit knowledge by name, field, tags, and skills, allowing users to combine separate knowledge fragments into useful context. A student can search a concept, find a relevant post, then move into the alumni grid to locate a contributor with the right expertise. That flow turns scattered explicit information into a structured learning path.

Those same discovery tools also support Internalization. Once users find a useful post or expert, they can absorb the information into their own understanding and use it in future decisions. The profile metrics, authority indicators, and badges reinforce that learning cycle by showing that the platform values repeated contribution and applied knowledge. In other words, the UI does not stop at retrieval; it makes it easier for users to recognize what they have learned and how they are progressing.

Leaderboard and Notifications support Socialization by keeping participation visible and socially rewarding. The leaderboard tells users that answering questions, posting useful advice, and contributing consistently is noticed by the community. Notifications close the loop by surfacing replies, upvotes, badge events, and other participation signals in a lightweight way that encourages follow-up interaction. Together, they create a feedback loop where users are nudged to return, respond, and keep exchanging tacit knowledge through public interaction.

The Sprint 2 UI therefore extends the SECI model beyond the feed. Search and Alumni Discovery organize explicit knowledge for Combination and Internalization, while Leaderboard and Notifications reward ongoing Socialization. This makes the interface a learning system as much as a navigation system, which is exactly what the revised MVP needs.
