# Sprint 2: GitHub Issues QA Log

This document tracks the defects and UX problems found during the QA integration testing for Sprint 2 (Posts, Comments, Search, Voting, Alumni Discovery, and Authority). It includes bug reports, reproduction notes, and retest comments.

## Issue: #12 - Post composer does not clear after successful submission
- **Related Test Case:** TC-001
- **Severity:** Medium
- **Description:** After submitting a new post on the Universal Feed, the composer text area retains the drafted text instead of clearing out.
- **Reproduction Steps:**
  1. Navigate to Universal Feed.
  2. Type "Test post for QA" in the composer.
  3. Select "Information" post type and submit.
  4. Observe that the text "Test post for QA" remains in the input field.
- **Expected Behavior:** The composer input field should be emptied upon successful submission.
- **Retest Status:** Passed. Developer implemented a state reset on successful API response.

## Issue: #13 - Empty search queries return all users instead of asking for input
- **Related Test Case:** TC-004
- **Severity:** Low
- **Description:** Submitting an empty string in the search bar on the Search page returns the entire user database instead of prompting the user to enter a search term.
- **Reproduction Steps:**
  1. Navigate to the Search page.
  2. Clear the search bar and press Enter.
  3. Observe that all users are listed.
- **Expected Behavior:** The UI should show a message like "Please enter a search term" or disable the search button for empty inputs.
- **Retest Status:** Passed. Search button is now disabled when the input is empty.

## Issue: #14 - Alumni sorting by "Authority Score" fails to update the UI
- **Related Test Case:** TC-006
- **Severity:** High
- **Description:** Changing the sorting option to "Authority Score" on the Alumni / Mentors page triggers a network request but the UI list order does not change.
- **Reproduction Steps:**
  1. Navigate to the Alumni / Mentors page.
  2. Select "Authority Score" from the sort dropdown.
  3. Observe that the list remains in the default alphabetical order.
- **Expected Behavior:** The list should immediately reorder to show the highest Authority Score alumni at the top.
- **Retest Status:** Passed. Fixed state update dependency in the sorting hook.

## Issue: #15 - Comment count on feed posts doesn't update immediately after commenting
- **Related Test Case:** TC-003
- **Severity:** Medium
- **Description:** When a user adds a comment to a post, the comment thread updates, but the numeric comment count indicator on the post itself requires a page refresh to update.
- **Reproduction Steps:**
  1. Find a post with 0 comments.
  2. Add a comment and submit.
  3. Observe the comment appears, but the count still says "0".
- **Expected Behavior:** Optimistic UI update should increment the comment count immediately.
- **Retest Status:** Failed (First Retest) - still laggy on slow networks. Passed (Second Retest) - Optimistic update logic added.

## Issue: #16 - Upvoting a profile from the user profile page occasionally registers twice
- **Related Test Case:** TC-008
- **Severity:** High
- **Description:** Rapidly clicking the upvote button on a user's profile registers multiple votes, incorrectly inflating the vote count and authority score.
- **Reproduction Steps:**
  1. Go to an Alumni's profile.
  2. Double-click or rapidly click the upvote button 3 times.
  3. Refresh the page and observe the vote count increased by 3.
- **Expected Behavior:** The upvote button should be disabled while the request is pending, and a user should only be able to vote once per profile.
- **Retest Status:** Passed. Debounce implemented and backend constraint added to prevent duplicate votes from the same user.
