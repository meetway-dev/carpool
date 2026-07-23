# Database Command Template

- Use Mongoose models from `models/`.
- Persist data through service functions in `services/`.
- Use `connectToDatabase()` before any Mongoose call.
- Keep schema changes minimal and consistent with existing model shape.
- Avoid new DB collections unless feature requires it.
- Reuse existing indexes and type-safe document mapping.
