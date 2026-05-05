# Failure Analysis Report

## Executive Summary

This report analyzes the key failures, challenges, and lessons learned during the development of the Alumni Knowledge Network. The most significant shift in the project was the transition from a highly complex initial scope to a refined, achievable Minimum Viable Product (MVP) within the 6-week timeline.

## 1. Scope Creep and Feature Overload

**Failure**: The initial project plan attempted to build a massive system including private messaging, real-time video calls, complex mentor-request workflows, and a recommendation engine. This led to blocked sprint progression and technical paralysis as the infrastructure required (e.g., WebRTC, real-time chat servers) was outside the approved technical stack and timeline.

**Impact**: Delayed progress in Sprint 1 as the team struggled to design the database for complex conversational and state-heavy flows.

**Lesson Learned**: Adhere strictly to the "Minimum Viable" aspect of the MVP. By pivoting to a posts-and-comments model centered around the SECI framework, we were able to deliver a robust, demonstrable product. Avoid adding features that are "nice to have" if they jeopardize the core interaction loop.

## 2. Authentication Complexity

**Failure**: Attempting to support custom password-based authentication alongside OAuth providers increased security risks, required complex password-reset flows, and bloated the user onboarding process.

**Impact**: Added unnecessary development overhead for credential management and email verification, which distracted from building the core knowledge-sharing features.

**Lesson Learned**: Leverage established ecosystem tools. By switching exclusively to Google OAuth via Supabase, we simplified the onboarding flow, aligned with the university's Google Workspace environment, and delegated security and password management to a trusted provider.

## 3. Ambiguous Navigation and UX

**Failure**: Initial UI wireframes directed users to specialized community pages or complex mentor-request dashboards upon login. This buried the primary value proposition (knowledge sharing) and led to "dead ends" where new users saw empty screens without knowing what to do.

**Impact**: The user experience was fragmented, making it difficult to demonstrate the core SECI knowledge loop during reviews.

**Lesson Learned**: Implement a "Feed-First" UX. Landing users immediately on the Universal Feed ensures they see the value of the platform instantly. Structuring navigation around immediate interaction (Feed, Profile, Leaderboard) rather than hierarchical communities creates a more engaging product.

## 4. Complex Database Relationships and Search

**Failure**: The original schema for tracking authority scores, voting, and search involved deeply nested relationships and heavy client-side filtering that caused performance bottlenecks during prototyping.

**Impact**: Difficulty in retrieving fast, unified search results and leaderboard standings, leading to slow page loads.

**Lesson Learned**: Use targeted generated columns (like `search_vector`) and dedicated helper functions (e.g., `compute_authority_score()`) directly in the database. This shifts the computational load away from the frontend/middleware and leverages PostgreSQL's native strengths, resulting in faster and cleaner TanStack Query hooks.

## Conclusion

The challenges faced during the Alumni Knowledge Network development ultimately led to a stronger, more focused product. The most critical lesson was recognizing when to pivot and reduce scope to protect the core deliverables. The decision to strip away messaging and video in favor of a SECI-aligned feed was the defining choice that allowed the team to succeed.
