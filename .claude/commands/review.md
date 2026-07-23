# Review Command Template

- Review changes against existing patterns in `features/`, `services/`, `models/`, and `validators/`.
- Confirm no new folder structure is introduced.
- Confirm reuse of `ROUTES`, `cn()`, and shared utilities.
- Confirm API route handlers use `NextResponse.json()` and error fallback.
- Confirm client hooks use `useQuery`, `useMutation`, and `useInfiniteQuery` consistently.
- Confirm schema validation is reused from `validators/`.
