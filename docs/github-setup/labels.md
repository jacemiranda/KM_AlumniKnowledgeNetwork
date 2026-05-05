# GitHub Issue Labels

This file defines all issue labels for Alumni Knowledge Network. Create these labels manually in the GitHub repository under **Settings > Labels**, or use the GitHub CLI commands below.

## Type Labels

| Name | Color | Description |
|---|---|---|
| `feat` | `#0075ca` | New feature or enhancement |
| `fix` | `#d73a4a` | Bug fix |
| `db` | `#e4e669` | Database schema or migration work |
| `docs` | `#0052cc` | Documentation only change |
| `test` | `#bfd4f2` | Test case or QA evidence |
| `chore` | `#e4e669` | Repo config, tooling, or governance |

## Sprint Labels

| Name | Color | Description |
|---|---|---|
| `sprint-1` | `#c2e0c6` | Sprint 1 - Foundation |
| `sprint-2` | `#c2e0c6` | Sprint 2 - Core Interaction |
| `sprint-3` | `#c2e0c6` | Sprint 3 - Final Release |

## Member Labels

| Name | Color | Description |
|---|---|---|
| `m1` | `#f9d0c4` | M1 - Project Manager / Scrum Master |
| `m2` | `#f9d0c4` | M2 - Full Stack Developer / Technical Lead |
| `m3` | `#f9d0c4` | M3 - UX/UI Designer / Front-End Contributor |
| `m4` | `#f9d0c4` | M4 - Knowledge Management Analyst |
| `m5` | `#f9d0c4` | M5 - QA and Documentation Lead |

## Status Labels

| Name | Color | Description |
|---|---|---|
| `blocked` | `#b60205` | Work cannot proceed — dependency or blocker |
| `in-review` | `#fbca04` | PR opened and awaiting review |
| `approved` | `#0e8a16` | PR approved and ready to merge |
| `needs-revision` | `#e99695` | Changes requested by reviewer |

## Priority Labels

| Name | Color | Description |
|---|---|---|
| `priority-high` | `#b60205` | Must be resolved this sprint |
| `priority-medium` | `#fbca04` | Should be resolved this sprint |
| `priority-low` | `#c5def5` | Nice to have — can slip to next sprint |

## GitHub CLI Quick Setup

Run these commands once to create all labels (requires `gh` CLI and repo write access):

```bash
# Type labels
gh label create feat --color 0075ca --description "New feature or enhancement"
gh label create fix --color d73a4a --description "Bug fix"
gh label create db --color e4e669 --description "Database schema or migration work"
gh label create docs --color 0052cc --description "Documentation only change"
gh label create test --color bfd4f2 --description "Test case or QA evidence"
gh label create chore --color e4e669 --description "Repo config, tooling, or governance"

# Sprint labels
gh label create sprint-1 --color c2e0c6 --description "Sprint 1 - Foundation"
gh label create sprint-2 --color c2e0c6 --description "Sprint 2 - Core Interaction"
gh label create sprint-3 --color c2e0c6 --description "Sprint 3 - Final Release"

# Member labels
gh label create m1 --color f9d0c4 --description "M1 - Project Manager / Scrum Master"
gh label create m2 --color f9d0c4 --description "M2 - Full Stack Developer / Technical Lead"
gh label create m3 --color f9d0c4 --description "M3 - UX/UI Designer / Front-End Contributor"
gh label create m4 --color f9d0c4 --description "M4 - Knowledge Management Analyst"
gh label create m5 --color f9d0c4 --description "M5 - QA and Documentation Lead"

# Status labels
gh label create blocked --color b60205 --description "Work cannot proceed — dependency or blocker"
gh label create in-review --color fbca04 --description "PR opened and awaiting review"
gh label create approved --color 0e8a16 --description "PR approved and ready to merge"
gh label create needs-revision --color e99695 --description "Changes requested by reviewer"

# Priority labels
gh label create priority-high --color b60205 --description "Must be resolved this sprint"
gh label create priority-medium --color fbca04 --description "Should be resolved this sprint"
gh label create priority-low --color c5def5 --description "Nice to have — can slip to next sprint"
```
