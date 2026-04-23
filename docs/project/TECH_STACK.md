# Approved Tech Stack

This project prioritizes fastest and safest 6-week delivery for the revised MVP.

## Recommended Stack

| Area | Tool |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router |
| Server State | TanStack Query |
| Forms | React Hook Form |
| Validation | Zod |
| Backend | Supabase |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth with Google OAuth |
| Authorization | Supabase RLS Policies |
| Storage | Supabase Storage |
| Deployment | Vercel |
| Unit Tests | Vitest |
| Component Tests | React Testing Library |
| E2E Tests | Playwright |

## Why This Stack

- It supports OAuth-only authentication cleanly.
- It fits the revised MVP without introducing extra backend complexity.
- Supabase supports roles, policies, voting logic, feed content, and basic moderation data well.
- Vite is fast and practical for a student team.
- TypeScript and Zod reduce errors in a compressed schedule.

## Do Not Use Without Approval

- Next.js
- Firebase
- Laravel
- Django
- Express-only backend
- Mobile-native stack

These are not wrong, but switching stacks would create schedule risk.
