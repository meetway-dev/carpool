# Refactor Command Template

- Keep responsibilities in place: UI in `components/` or `features/*/components`, server logic in `services/`, validation in `validators/`.
- Only refactor code that is duplicated or inconsistent with existing conventions.
- Prefer existing helper functions over new utilities.
- Do not change database models or API contracts unless necessary.
- Document any pattern consolidation in `docs/`.
