# RideConnect Claude Workspace Guide

## Project Overview
- Next.js 15 app with server components and client components.
- MongoDB via Mongoose for backend persistence.
- PKR carpool marketplace for intercity rides in Pakistan.
- Uses a device-based anonymous owner key in localStorage for favorites, history, and reports.

## Stack
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI primitives
- TanStack Query
- Zod validation
- Mongoose ODM
- Sonner toast
- next-themes

## Architecture Summary
- `app/` contains pages and route handlers.
- `components/` houses shared UI primitives, layout, feedback, and common controls.
- `features/` contains domain features, client hooks, UI components, actions, and queries.
- `services/` contains server-side data access and business logic.
- `models/` contains Mongoose schemas and model exports.
- `validators/` contains Zod schemas for request inputs and route query parsing.
- `lib/` contains helpers, DB connection, rate limiting, and utility functions.
- `config/` contains environment and site metadata.
- `types/` contains DTOs and shared type contracts.

## Conventions
- `use client` only in browser components/hooks.
- `app/api/*/route.ts` uses `NextResponse` and server route handlers.
- `features/*/actions/*.ts` are server actions with `use server`.
- Validate inputs with Zod schemas in `validators/` on both client and server.
- Use `connectToDatabase()` in server-only modules before Mongoose operations.
- Use `NextResponse.json()` in API handlers, with 500 error fallback.
- Use `useInfiniteQuery` in list pages and `fetch` to `/api/...` for client data.
- Reuse `ROUTES` constants rather than hard-coded paths.
- Use `cn()` utility for Tailwind class merging.
- Use `toast` from `sonner` for client notifications.

## Important Folder Responsibilities
- `app/`: page layouts, routing, metadata, API route handlers.
- `components/`: reusable UI primitives and layout shells.
- `features/`: domain-specific UI, hooks, materials, and actions.
- `services/`: server-side business logic and persistent operations.
- `models/`: Mongoose schemas and type exports.
- `validators/`: input validation and query parameter parsing.
- `lib/`: app helpers, DB, rate limiting, and formatting utilities.
- `config/`: environment validation and site settings.
- `types/`: DTO shapes and shared envelopes.

## Development Workflow
- `npm run dev` to serve locally.
- `npm run build` to compile production build.
- `npm run lint` for ESLint.
- `npm run typecheck` for TypeScript.
- Use existing components and feature actions instead of introducing new patterns.

## Rules Claude Must Follow
- Never change architecture or folder structure.
- Never introduce new libraries or replace existing ones.
- Reuse existing components, hooks, services, utilities, and validators.
- Keep feature changes aligned with `features/` module organization.
- Preserve route and API conventions in `app/api` and server actions.
- Use existing DTO shapes from `types/`.
- Avoid duplicate implementations and duplicate logic.

## Rules Claude Must Never Break
- Do not create new top-level folders unless strictly necessary.
- Do not invent features or behavior not present in the repository.
- Do not replace Tailwind / Radix / class-variance-authority conventions.
- Do not rewrite the data model or move business logic out of services.
- Do not bypass or duplicate Zod validation.
- Do not add authentication or permissions systems beyond current anonymous device key behavior.

## Response Expectations
- Provide concise, task-focused answers.
- Reference existing file names and symbols explicitly.
- Prefer small diffs and localized changes.
- If uncertain, state that information is inferred from existing code.

## Quality Checklist
- Match current naming and folder conventions.
- Reuse `ROUTES`, `cn()`, and existing UI primitives.
- Use `create...Schema` for input validation.
- Keep server logic in `services/` or `features/*/actions`.
- Keep client state in hooks and `useQuery`/`useMutation` patterns.
- Ensure route handlers return JSON responses with error text and status.
- Keep documentation in `docs/`, not in CLAUDE.md.
