# Database

## Models
- `models/ride.model.ts`: ride postings with denormalized route, driver, vehicle, departure, status, searchText, duplicateHash, and ownerKey.
- `models/ride-request.model.ts`: passenger requests with ownerKey and auto-expiry.
- `models/favorite.model.ts`: anonymous favorites by ownerKey for rides, drivers, and routes.
- `models/search-history.model.ts`: anonymous search records by ownerKey.
- `models/notification.model.ts`: owner-specific notifications.
- `models/driver.model.ts`: driver profile records with verification and linked rides.

## Patterns
- Use Mongoose schema indexes for query patterns.
- `connectToDatabase()` caches connections for serverless environments.
- Services call `connectToDatabase()` before queries.
- Data access is centralized in `services/` and helper modules.
- `types/` defines DTO interfaces for UI-safe serializable data.

## Notes
- Anonymous device identity is persisted in `localStorage` via `useDeviceKey()`.
- `ownerKey` is used for favorites, search history, reports, notifications, and ride ownership.
- `duplicateHash` and `searchText` are stored on rides for deduplication and search filtering.
