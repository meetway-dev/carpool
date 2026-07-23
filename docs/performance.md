# Performance

- Use server-side initial data fetch for pages, then hydrate client with query data.
- `useInfiniteQuery` powers paginated ride lists and avoids fetching unnecessary pages.
- `connectToDatabase()` caches the Mongoose connection for serverless environments.
- `searchRides` uses MongoDB indexes on route, status, departure, featured, and searchText.
- API routes use cache headers for short-term CDN caching when applicable.
- `rate-limit.ts` provides lightweight request throttling without external dependencies.
- Keep repeated logic in services to avoid duplicated database queries.
