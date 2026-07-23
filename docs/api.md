# API

## Route handlers
- `app/api/*/route.ts` defines HTTP endpoints.
- All API routes use `NextResponse.json()`.
- Handler modules typically set `export const dynamic = "force-dynamic"`.
- Query params are parsed with Zod schemas in `validators/`.
- Errors return JSON with `error` and appropriate HTTP status.

## Style
- Use a service function from `services/` for DB operations.
- Keep route handlers thin and focused on request parsing.
- Use `try/catch` around service calls and log server errors.
- Use rate limiting from `lib/rate-limit.ts` when needed.

## Existing APIs
- `GET /api/rides`: paginated ride search.
- `GET /api/rides/by-ids`: fetch rides by `ids` query values.
- `GET /api/favorites`: fetch saved rides/drivers/routes by `ownerKey`.
- `GET /api/notifications`: fetch notifications by `ownerKey`.
- `GET /api/search-history`: fetch recent search history by `ownerKey`.
