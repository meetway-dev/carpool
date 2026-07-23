# Component Command Template

- Use existing UI primitives in `components/ui/` first.
- Use `cn()` for class merging and `buttonVariants` style patterns for variants.
- Keep components small and focused.
- Use `use client` only when browser APIs or hooks are required.
- Prefer composition with `asChild` and Radix primitives already in the repo.
- Do not add new UI libraries or styling paradigms.
