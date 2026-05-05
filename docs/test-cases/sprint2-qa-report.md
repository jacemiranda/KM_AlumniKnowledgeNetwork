# Sprint 2 QA Report

**Sprint**: 2
**Date**: 2026-05-05
**QA Lead**: Reyes, Diem Andreif F. (M5)

## Overview

This report summarizes the QA execution for the Sprint 2 Core Interaction deliverables, including feed posting, comments, search, voting, alumni discovery, and profile metrics.

## Test Execution Summary

- **Total Test Cases Executed**: 10
- **Passed**: 10
- **Failed**: 0
- **Blocked**: 0

*Note: Initial integration bugs found during manual testing were documented in the GitHub Issues QA Log (`docs/test-cases/sprint2-github-issues-qa-log.md`) and retested successfully after M2 developer fixes.*

## Feature Coverage

### 1. Feed and Comments
- Post composer correctly handles text, field selection, and tags.
- Post types (Information, Question) are properly displayed.
- Comments are successfully added to threads and counts increment accurately.

### 2. Search
- Global search accurately returns users and posts based on name and skill tags.
- Field filters successfully narrow down search results.

### 3. Alumni Discovery
- Alumni page loads profiles with correct field and skill indicators.
- Sorting by "Authority Score" correctly orders users from highest to lowest score.

### 4. Voting and Profile Metrics
- Upvoting a post author registers successfully.
- Upvoting on a user profile correctly increments the total vote count.
- Profile metrics accurately aggregate total posts, comments, tagged-in posts, and authority score.

## Known Issues (Deferred)

- None. All Sprint 2 critical paths are stable and verified.

## Sign-Off

The Sprint 2 deliverables meet the acceptance criteria and are approved for integration into the `dev` branch.
