# API Command Template

- Use `app/api/*/route.ts` for HTTP endpoints.
- Use `NextResponse.json()` for all responses.
- Keep API handlers server-only and `dynamic = "force-dynamic"` when data is fresh.
- Parse query params with `validators/search.schema` or dedicated Zod schemas.
- Call service functions from `services/` to access database and business logic.
- Keep error messages user-friendly and avoid leaking internal details.
