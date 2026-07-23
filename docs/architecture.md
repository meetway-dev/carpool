# Architecture

## Overview
RideConnect is a Next.js 15 app using server components with selective client components. It follows a feature-oriented folder structure with shared UI primitives, domain services, and server-side route handlers.

## Core Layers
- `app/`: pages, layouts, metadata, API route handlers.
- `components/`: shared UI primitives, common controls, layout wrappers, feedback components.
- `features/`: domain-specific UI, hooks, actions, client-side queries, and feature components.
- `services/`: server-side business logic, data access, and notification triggers.
- `models/`: Mongoose schemas and model exports.
- `validators/`: Zod schemas for request body and query validation.
- `lib/`: helper functions, DB connection, rate limiting, and shared utilities.
- `config/`: environment validation and app metadata.
- `types/`: DTO shapes and shared type definitions.

## Routing and Rendering
- Pages use `app/(main)` route grouping with server-rendered content.
- API routes live in `app/api/*/route.ts` and return JSON via `NextResponse.json()`.
- Server actions use `use server` in feature action files.
- Client state uses TanStack Query with `QueryClientProvider`.

## Data Flow
- UI components call hooks in `features/*/hooks`.
- Hooks fetch data from API routes or actions via `fetch()`.
- API routes delegate to `services/*` for persistence.
- `services/*` use Mongoose models from `models/`.
- Validation is centralized in `validators/` and reused across client and server.

## Styling
- Tailwind CSS with `class-variance-authority`, `clsx`, and `tailwind-merge`.
- UI primitives in `components/ui/` provide buttons, cards, dialogs, selects, switches, tabs, etc.
- `cn()` is the canonical utility for class composition.
