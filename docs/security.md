# Security

- Environment variables are validated in `config/env.ts`.
- `getServerEnv()` is restricted to server-only modules.
- Rate limiting is applied to create rides, create requests, reports, and search.
- Device ownership is anonymous via `ownerKey` stored in `localStorage`.
- No explicit authentication system exists; do not add one without repository support.
- API route handlers avoid exposing raw errors and return generic failure messages.
- Duplicate ride detection protects against repeated posts.
- Driver status is checked via `upsertDriverFromRide` and blocked numbers may be rejected.
