# Feature Command Template

- Identify the feature folder under `features/`.
- Reuse existing components, hooks, actions, and validation.
- Avoid adding new top-level folders.
- If the feature needs a UI change, prefer `components/ui/` primitives.
- If the feature needs a server change, use `services/` or `features/*/actions`.
- Preserve route naming from `ROUTES` and API paths from `app/api`.
- Use Zod schemas from `validators/` for all input validation.
