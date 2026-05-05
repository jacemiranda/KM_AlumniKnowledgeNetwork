# Sprint 1 - OAuth, Profile Setup, and Feed Shell Acceptance Checklist

Sprint: 1 - Foundation
Author: M5 - QA & Documentation Lead
PR: PR-01: Sprint 1 OAuth Profile Feed Checklist
Branch: `test/sprint1-oauth-profile-feed-checklist`

---

## OAuth Authentication

### TC-001

- Feature: Google OAuth Login
- Role: All (Student, Alumni, Moderator, Admin)
- Sprint: 1
- Priority: Critical
- Preconditions: User has a valid Google account. App is running. No active session.
- Steps:
  1. Navigate to `/login`.
  2. Click "Sign in with Google".
  3. Complete the Google OAuth consent screen.
- Expected Result: User is redirected to `/setup` if profile is incomplete, or `/` (feed) if profile is already complete. Session is persisted.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-01, M2 PR-03

### TC-002

- Feature: Login Page Renders Correctly
- Role: All
- Sprint: 1
- Priority: High
- Preconditions: No active session.
- Steps:
  1. Navigate to `/login`.
  2. Verify the page heading reads "Sign In to Alumni Knowledge Network".
  3. Verify the "Sign in with Google" button is visible and enabled.
  4. Verify the terms notice is displayed.
- Expected Result: All elements render. No broken layout. Button is clickable.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-01, M3 PR-02

### TC-003

- Feature: OAuth Error Display
- Role: All
- Sprint: 1
- Priority: Medium
- Preconditions: No active session.
- Steps:
  1. Navigate to `/login`.
  2. Trigger an OAuth failure (network disconnect, invalid redirect, or provider error).
- Expected Result: An error alert appears below the heading with a descriptive message. The login button becomes re-enabled.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-01

### TC-004

- Feature: Session Persistence on Refresh
- Role: All
- Sprint: 1
- Priority: High
- Preconditions: User is logged in with a valid session.
- Steps:
  1. Refresh the browser on any authenticated page.
  2. Observe "Loading session..." state.
- Expected Result: After loading, the user stays on the same page. No redirect to `/login`. Session is restored.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-03

### TC-005

- Feature: Sign Out
- Role: All
- Sprint: 1
- Priority: High
- Preconditions: User is logged in.
- Steps:
  1. Click "Sign Out" in the sidebar or navigation.
  2. Observe the redirect.
- Expected Result: User is redirected to `/login`. Session is cleared. Navigating to `/` redirects back to `/login`.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-03

---

## Route Protection

### TC-006

- Feature: Protected Route - Unauthenticated Redirect
- Role: Unauthenticated
- Sprint: 1
- Priority: Critical
- Preconditions: No active session.
- Steps:
  1. Navigate directly to `/` (feed).
  2. Navigate directly to `/profile`.
  3. Navigate directly to `/setup`.
- Expected Result: All routes redirect to `/login`. No feed, profile, or setup content is rendered.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-01

### TC-007

- Feature: Setup Guard - Incomplete Profile Redirect
- Role: All
- Sprint: 1
- Priority: Critical
- Preconditions: User is logged in. Profile setup is not complete (`profileCompleted = false`).
- Steps:
  1. Attempt to navigate to `/` (feed).
  2. Attempt to navigate to `/alumni`.
  3. Attempt to navigate to `/search`.
- Expected Result: All routes redirect to `/setup`. No feed content is rendered until profile is complete.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-03

### TC-008

- Feature: Setup Guard - Completed Profile Redirect
- Role: All
- Sprint: 1
- Priority: High
- Preconditions: User is logged in. Profile setup is complete (`profileCompleted = true`).
- Steps:
  1. Navigate to `/setup`.
- Expected Result: User is redirected to `/` (feed). The setup page is not accessible after profile is complete.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-03

---

## First-Time Profile Setup

### TC-009

- Feature: Setup Page Renders All Fields
- Role: All (first-time user)
- Sprint: 1
- Priority: High
- Preconditions: User is logged in. Profile is incomplete.
- Steps:
  1. Navigate to `/setup`.
  2. Verify that the following fields are visible: Full Name, Profile Picture URL, "I am a..." (Student / Alumni), Academic Field dropdown, Short Bio, Core Skills and Interests.
  3. Verify the "Complete Profile" submit button is visible.
- Expected Result: All form fields render correctly. Field dropdown is populated from the database. Skills are displayed as toggleable chips.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-03, M3 PR-02

### TC-010

- Feature: Profile Setup - Successful Submission
- Role: All (first-time user)
- Sprint: 1
- Priority: Critical
- Preconditions: User is logged in. Profile is incomplete.
- Steps:
  1. Navigate to `/setup`.
  2. Enter a Full Name.
  3. Select "Student" or "Alumni".
  4. Select an Academic Field from the dropdown.
  5. Optionally enter a Short Bio and Profile Picture URL.
  6. Select one or more skills.
  7. Click "Complete Profile".
- Expected Result: Profile is saved to the database. User is redirected to `/` (Universal Feed). Subsequent login goes directly to the feed.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-03

### TC-011

- Feature: Profile Setup - Validation Error
- Role: All (first-time user)
- Sprint: 1
- Priority: High
- Preconditions: User is logged in. Profile is incomplete.
- Steps:
  1. Navigate to `/setup`.
  2. Leave Full Name empty.
  3. Leave Academic Field unselected.
  4. Click "Complete Profile".
- Expected Result: An error message appears: "Please provide your full name and academic field before continuing." The form is not submitted.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-03

### TC-012

- Feature: Profile Setup - User Type Selection
- Role: All (first-time user)
- Sprint: 1
- Priority: High
- Preconditions: User is logged in. Profile is incomplete.
- Steps:
  1. Navigate to `/setup`.
  2. Click "Student" card.
  3. Verify it is highlighted (emerald border/background).
  4. Click "Alumni" card.
  5. Verify the selection switches to Alumni.
- Expected Result: Only one user type is selected at a time. Visual feedback (border and background color) reflects the active selection.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-03

### TC-013

- Feature: Profile Setup - Skill Toggle
- Role: All (first-time user)
- Sprint: 1
- Priority: Medium
- Preconditions: User is logged in. Profile is incomplete. Skills are loaded from the database.
- Steps:
  1. Navigate to `/setup`.
  2. Click a skill chip to select it.
  3. Verify the chip changes to the selected style (emerald).
  4. Click the same skill chip again to deselect it.
  5. Verify it returns to the default style.
- Expected Result: Skills toggle between selected and deselected states. Multiple skills can be selected simultaneously.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-03

---

## Universal Feed Shell

### TC-014

- Feature: Feed Page Loads After Login
- Role: All (profile complete)
- Sprint: 1
- Priority: Critical
- Preconditions: User is logged in. Profile setup is complete.
- Steps:
  1. Navigate to `/` or complete profile setup.
  2. Observe the Universal Feed page.
- Expected Result: The feed page renders. The app shell (sidebar with navigation links) is visible. Feed content area is displayed (posts or empty state).
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-01, M2 PR-03

### TC-015

- Feature: App Shell Navigation Links
- Role: All (profile complete)
- Sprint: 1
- Priority: High
- Preconditions: User is logged in and on the feed page.
- Steps:
  1. Verify sidebar contains links: Feed, Profile, Alumni, Search, Leaderboard, Notifications.
  2. Click each navigation link.
- Expected Result: Each link navigates to the corresponding page without errors. Active page is visually indicated in the sidebar.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-01

### TC-016

- Feature: Feed Empty State
- Role: All (profile complete)
- Sprint: 1
- Priority: Medium
- Preconditions: User is logged in. No posts exist in the database.
- Steps:
  1. Navigate to `/`.
  2. Observe the feed content area.
- Expected Result: An appropriate empty state message or placeholder is displayed. No errors or blank screen.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-01

### TC-017

- Feature: Feed Loading State
- Role: All (profile complete)
- Sprint: 1
- Priority: Medium
- Preconditions: User is logged in.
- Steps:
  1. Navigate to `/`.
  2. Observe the initial loading behavior before posts appear.
- Expected Result: A loading indicator or "Loading..." message is shown while data is being fetched. The page transitions smoothly to the loaded state.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-01

### TC-018

- Feature: Feed Error State
- Role: All (profile complete)
- Sprint: 1
- Priority: Medium
- Preconditions: User is logged in. Database or API connection fails.
- Steps:
  1. Navigate to `/` with a simulated API failure.
- Expected Result: An error message is displayed. The app does not crash.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-01

---

## Cross-Cutting Checks

### TC-019

- Feature: Catch-All Route Redirect
- Role: All
- Sprint: 1
- Priority: Low
- Preconditions: User is logged in.
- Steps:
  1. Navigate to a non-existent route, for example `/nonexistent`.
- Expected Result: User is redirected to `/` (feed). No 404 page or blank screen.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M2 PR-01

### TC-020

- Feature: Responsive Layout - Mobile
- Role: All (profile complete)
- Sprint: 1
- Priority: Medium
- Preconditions: User is logged in.
- Steps:
  1. Resize the browser to mobile width (< 640px).
  2. Navigate to `/login`, `/setup`, and `/` (feed).
- Expected Result: All pages are usable at mobile width. No horizontal overflow. Navigation is accessible.
- Actual Result:
- Status: Not Tested
- Evidence:
- Related Issue / PR: M3 PR-02

---

## Summary

| Area | Test Cases | Critical | High | Medium | Low |
|---|---:|---:|---:|---:|---:|
| OAuth Authentication | 5 | 1 | 3 | 1 | 0 |
| Route Protection | 3 | 2 | 1 | 0 | 0 |
| First-Time Profile Setup | 5 | 1 | 3 | 1 | 0 |
| Universal Feed Shell | 5 | 1 | 1 | 3 | 0 |
| Cross-Cutting Checks | 2 | 0 | 0 | 1 | 1 |
| **Total** | **20** | **5** | **8** | **6** | **1** |
