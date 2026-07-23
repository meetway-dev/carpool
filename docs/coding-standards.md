# Coding Standards

## Naming
- Components use `PascalCase` and file names match component names.
- Hooks use `use*` prefix.
- Services and actions use domain descriptors: `createRide`, `getFavoritesByOwner`, `toggleRideFavorite`.
- Constants use `SCREAMING_SNAKE` or `CamelCase` for object keys.
- API route handlers use `GET`, `POST` exports in `route.ts`.

## Validation
- Use Zod schemas from `validators/` for all input validation.
- Prefer `.safeParse()` in actions and server logic.
- Use `z.coerce` for query parameter parsing.
- Share validation logic between client and server where possible.

## Error Handling
- Catch and log server-side errors; return user-friendly JSON error messages.
- Rate limit create actions and search endpoints using `lib/rate-limit.ts`.
- Use `fieldErrors` in action results for form validation failures.

## React
- Use `useQuery`, `useMutation`, and `useInfiniteQuery` from TanStack Query.
- Keep client components focused; defer data loading to hooks and services.
- Use `useEffect` for side effects like recording search history and infinite-scroll sentinel behavior.
- Use `useMemo` and `useCallback` to stabilize derived values and callbacks.
