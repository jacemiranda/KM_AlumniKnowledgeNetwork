# Search and Retrieval Guidelines

## Search Dimensions
The MVP search system supports four dimensions:

| Dimension | Searches Across | Use Case |
|---|---|---|
| Name | User profiles | Find a specific alumni or student by name |
| Field | Profiles and posts | Find people or content in a specific domain |
| Tag | Posts | Find posts about a specific topic |
| Skill | Profiles | Find alumni with a specific expertise |

## Search Results
- Search results include both users and posts
- User results show: name, field, skills, authority score, badges
- Post results show: title, field, tags, post type, author

## Retrieval Behavior
- Search is keyword-based in the MVP (no fuzzy matching required)
- Tags and skills are matched by exact name or slug
- Field matching is exact (selected from predefined list)
- Name search should support partial match (e.g. "Cruz" returns "Angelo Cruz")

## Alumni Discovery (Alumni / Mentors Page)
- The Alumni page filters the user list to show only alumni user type
- Filters available: Field, Skill
- Alumni are ranked by authority score by default
- Badge visibility is shown on alumni cards

## Leaderboard Retrieval
- Global leaderboard: all users ranked by authority score
- Field-filtered leaderboard: users in one field ranked by authority score
- Leaderboard updates reflect current vote totals

## KM Notes
- Search supports the Combination phase of SECI by connecting knowledge seekers with relevant content and experts
- Skills and tags are the primary retrieval handles for tacit-to-explicit knowledge mapping
