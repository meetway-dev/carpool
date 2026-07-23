# AI Rules for RideConnect

- Always search for existing code before adding new code.
- Reuse `features/*` for domain behavior and `services/*` for server logic.
- Reuse `validators/*` for input and query validation.
- Reuse shared UI primitives in `components/ui/` and `components/layout/`.
- Reuse `ROUTES` constants instead of hard-coded paths.
- Use `cn()` for Tailwind class merging and keep JSX styling aligned with existing patterns.
- Keep `use client` only in components that require browser APIs or hooks.
- Keep API handlers thin; delegate database logic to `services/`.
- Keep server actions in `features/*/actions` with `use server`.
- Keep DTO shapes consistent with `types/index.ts`.
- Do not create new top-level folders unless the feature cannot fit within current structure.
- Do not introduce new libraries, architecture changes, or authentication systems.
- Do not duplicate logic already implemented in service, helper, or validator modules.
- Do not bypass Zod validation or custom request parsing.
- Do not modify app structure outside `app/`, `components/`, `features/`, `services/`, `models/`, `validators/`, `lib/`, `config/`, `types/`, `docs/`, `.claude/`.
