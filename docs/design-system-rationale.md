# Design System Rationale

Role: M3 UX/UI Designer / Front-End Contributor  
Sprint: Sprint 1  
PR: PR-03: Design System Rationale Revised

## 1. Design System

### Liquid Material: Emerald and Gold Edition

The visual system is designed to feel scholarly, modern, and high-trust while still looking dynamic enough for a social knowledge platform. The style language combines dark liquid surfaces, emerald primary action cues, and warm gold secondary highlights.

### Color Tokens

Core palette used across login, setup, feed, and profile compositions:

- Background / Surface Base
  - `#0b1326` (background, surface-dim)
  - `#171f33` (surface-container)
  - `#131b2e` (surface-container-low)
  - `#222a3d` (surface-container-high)
  - `#2d3449` (surface-variant)
- Primary (Emerald)
  - `#4edea3` (primary)
  - `#10b981` (primary-container)
  - `#006c49` (inverse-primary)
  - `#6ffbbe` (primary-fixed)
- Secondary (Gold)
  - `#ffb95f` (secondary)
  - `#ee9800` (secondary-container)
  - `#ffddb8` (secondary-fixed)
- Text and Utility
  - `#dae2fd` (on-surface / on-background)
  - `#bbcabf` (on-surface-variant)
  - `#86948a` (outline)
  - `#93000a` (error-container)

### Typography Rules (Plus Jakarta Sans)

Primary family:

- Plus Jakarta Sans for all headings, labels, and body text.

Weight usage:

- 400: body reading copy
- 600: labels, metadata, supporting UI text
- 700 to 900: major headings and primary calls to action

Scale system:

- H1: 48px, line-height 1.1, weight 700
- H2: 36px, line-height 1.2, weight 700
- H3: 24px, line-height 1.3, weight 600
- Body MD: 16px, line-height 1.6, weight 400
- Body LG: 18px, line-height 1.6, weight 400
- Label SM: 13px, tight line-height, uppercase tracking emphasis for controls and status labels

### Shape, Depth, and Material Language

The interface consistently applies a liquid material hierarchy:

- Glassmorphism as the default panel treatment using translucent backgrounds, subtle borders, and blur layers.
- Heavy blur for cards and chrome (e.g., `backdrop-blur-2xl`) to create depth without hard separators.
- Floating elevations via layered shadows for cards, shell regions, and key controls.
- Hyper-rounded geometry (e.g., `rounded-[32px]` and full-pill controls) to keep interaction zones approachable and tactile.
- Soft ambient gradients and glow blobs in emerald and gold to guide focus across large canvases.

This creates a coherent visual language where users can quickly identify structural layers:

- Global shell and nav: persistent, elevated glass surfaces
- Primary content: mid-elevation cards
- Inputs and action controls: recessed/raised treatments to indicate interaction affordances

## 2. SECI Alignment

The layout and component structure intentionally support the SECI knowledge model in the revised MVP.

### Socialization

- The universal feed is the public interaction center where students and alumni exchange tacit experience through visible posts and replies.
- Prominent composer and comment-forward post cards reduce friction for conversation and peer response.

### Externalization

- Structured post blocks (title, body, tags, post type) turn informal know-how into reusable written artifacts.
- First-time profile setup captures identity context (role, field, skills, bio) so contributions are understandable and attributable.

### Combination

- Fields, tags, and skills are surfaced as navigable metadata for organizing explicit knowledge.
- Feed tabs and filtering affordances support retrieval and recombination of related content across topics.

### Internalization

- Profile and contribution surfaces make learning progress and participation visible over time.
- The experience design anticipates authority, badges, and leaderboard signals so users can apply what they learn and reinvest it into future contributions.

In summary, the UI is not only decorative; it is information architecture that makes SECI transitions legible and repeatable in daily use.

## 3. Prompt Log

The following prompts were used in Stitch AI to generate baseline UI markup patterns, later adapted for implementation.

### Prompt 01: OAuth Login Screen

"Create a premium dark-mode OAuth login page for a university alumni knowledge platform named EraLink. Use a liquid glass style with emerald primary accents and gold secondary accents. Include one centered login card, brand mark, short trust copy, and a dominant 'Sign in with Google' CTA. Keep layout mobile-first and responsive."

### Prompt 02: First-Time Setup Screen

"Design a first-time profile setup screen for EraLink after OAuth login. Use Plus Jakarta Sans, glassmorphism cards, rounded pill controls, and emerald-gold visual accents. Include full name, profile image placeholder, user type toggle (Student/Alumni), field selector, bio textarea, and skills chips. Keep spacing generous and responsive across mobile and desktop."

### Prompt 03: Universal Feed Screen

"Generate a universal feed UI for EraLink with a responsive shell. Include mobile top bar and bottom nav, desktop side nav, post composer, feed tabs (For You, Following, My Field), post cards with metadata/tags/actions, and a right rail for trending topics and suggested mentors. Preserve liquid material visuals with translucent panels and elevated rounded cards."

### Prompt 04: Profile Screen

"Create a profile page for an alumni contributor in EraLink using the same liquid material design system. Include identity card, contribution summary, skills, ratings/helpfulness indicators, content tabs (Posts, Tagged In, Comments, Badges), and achievement badge panels. Maintain dark emerald-and-gold visual hierarchy and high readability."

Prompt log purpose:

- Preserve design generation provenance.
- Enable repeatable UI iteration in later sprints.
- Keep design rationale traceable to Sprint 1 PR outputs.
