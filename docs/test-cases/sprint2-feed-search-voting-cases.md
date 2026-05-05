# Sprint 2: Feed, Search, and Voting Test Cases

`TC-001`
- Feature: Feed
- Role: Student / Alumni
- Sprint: 2
- Priority: High
- Preconditions: User is logged in and on the Universal Feed page.
- Steps:
  1. Click on the post composer.
  2. Enter valid text content.
  3. Select a post type (e.g., Information).
  4. Submit the post.
- Expected Result: The post is created and appears at the top of the feed.
- Actual Result: 
- Status: Draft
- Evidence: 
- Related Issue / PR: PR-01

`TC-002`
- Feature: Feed
- Role: Student / Alumni
- Sprint: 2
- Priority: Medium
- Preconditions: User is logged in and on the Universal Feed page.
- Steps:
  1. Click on the post composer.
  2. Enter text content.
  3. Select a specific field and add relevant skill tags.
  4. Submit the post.
- Expected Result: The post displays the selected field and tags correctly on the feed.
- Actual Result: 
- Status: Draft
- Evidence: 
- Related Issue / PR: PR-01

`TC-003`
- Feature: Comments
- Role: Student / Alumni
- Sprint: 2
- Priority: High
- Preconditions: User is logged in and viewing a specific post.
- Steps:
  1. Click on the comment input field below a post.
  2. Enter a valid comment.
  3. Submit the comment.
- Expected Result: The comment is added to the post's comment thread and the comment count increments.
- Actual Result: 
- Status: Draft
- Evidence: 
- Related Issue / PR: PR-01

`TC-004`
- Feature: Search
- Role: Student / Alumni
- Sprint: 2
- Priority: High
- Preconditions: User is logged in and on the Search page.
- Steps:
  1. Enter a known user's name or a specific skill in the search bar.
  2. Press Enter or click search.
- Expected Result: The search results display relevant users and posts matching the query.
- Actual Result: 
- Status: Draft
- Evidence: 
- Related Issue / PR: PR-02

`TC-005`
- Feature: Search
- Role: Student / Alumni
- Sprint: 2
- Priority: Medium
- Preconditions: User is logged in and on the Search page.
- Steps:
  1. Perform a search query.
  2. Apply a field filter from the available options.
- Expected Result: Search results are filtered to only show items related to the selected field.
- Actual Result: 
- Status: Draft
- Evidence: 
- Related Issue / PR: PR-02

`TC-006`
- Feature: Alumni Discovery
- Role: Student
- Sprint: 2
- Priority: High
- Preconditions: User is logged in and on the Alumni / Mentors page.
- Steps:
  1. View the list of alumni.
  2. Change the sorting option to "Authority Score".
- Expected Result: The alumni list reorders to display users with the highest authority score first.
- Actual Result: 
- Status: Draft
- Evidence: 
- Related Issue / PR: PR-02

`TC-007`
- Feature: Voting
- Role: Student / Alumni
- Sprint: 2
- Priority: High
- Preconditions: User is logged in and viewing a post by another user.
- Steps:
  1. Click the upvote button on the post's author.
- Expected Result: The vote is registered, and the UI reflects the upvoted state.
- Actual Result: 
- Status: Draft
- Evidence: 
- Related Issue / PR: PR-03

`TC-008`
- Feature: Voting
- Role: Student / Alumni
- Sprint: 2
- Priority: Medium
- Preconditions: User is logged in and viewing another user's profile.
- Steps:
  1. Click the upvote button on the user's profile.
- Expected Result: The vote is registered, and the profile's vote count increments.
- Actual Result: 
- Status: Draft
- Evidence: 
- Related Issue / PR: PR-03

`TC-009`
- Feature: Profile Metrics
- Role: Student / Alumni
- Sprint: 2
- Priority: High
- Preconditions: User is logged in and viewing their own or another user's profile.
- Steps:
  1. Observe the metrics section on the profile.
- Expected Result: The post count, comment count, and tagged-in count accurately reflect the user's activity.
- Actual Result: 
- Status: Draft
- Evidence: 
- Related Issue / PR: PR-03

`TC-010`
- Feature: Authority Score
- Role: Student / Alumni
- Sprint: 2
- Priority: High
- Preconditions: User A has an existing authority score. User B is logged in.
- Steps:
  1. User B navigates to User A's profile.
  2. User B upvotes User A.
  3. Refresh the page or observe UI update.
- Expected Result: User A's authority score increases according to the voting logic.
- Actual Result: 
- Status: Draft
- Evidence: 
- Related Issue / PR: PR-03
