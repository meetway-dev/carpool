# Features

## Search & Rides
- Search filters are URL-driven via `features/search/hooks/use-search-query.ts`.
- `searchParamsSchema` validates route query strings and is shared by server and client.
- Ride search results use infinite scroll via `useInfiniteRides()`.
- Ride listing pages prefetch initial data on the server and hydrate with initial query data.

## Favorites
- Favorites are anonymous and keyed by device-specific `ownerKey`.
- Toggle favorites through server actions in `features/favorites/actions/`.
- Client cache is kept optimistic with TanStack Query.
- Saved routes trigger route follower notifications.

## Notifications and History
- Notifications are fetched via `GET /api/notifications`.
- Search history is recorded only when route filters exist and results resolve.
- Trending routes use search history aggregation in `services/search-history.service.ts`.

## Ride Posting
- Ride creation uses `features/rides/actions/create-ride.ts`.
- Input is validated with Zod schema and duplicate detection is performed server-side.
- Driver records are upserted from ride posting.
- The app uses `ownerKey` and rate limiting to prevent abuse.
