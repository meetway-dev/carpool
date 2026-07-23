# UI

## Primitives
- `components/ui/` contains reusable stylized primitives for buttons, cards, dialogs, selects, sliders, switches, tabs, inputs, labels, separators, sheets, skeletons, and toast support.
- UI primitives use Tailwind classes, `cva`, and `cn()`.
- `asChild` composition is used in button components to wrap Radix or link elements.

## Layout
- `components/layout/` holds `app-header.tsx` and `bottom-nav.tsx`.
- `AppProviders` wraps the app with theme and query providers.
- `ThemeProvider` uses `next-themes` with class strategy.
- `Toaster` uses `sonner` and theme sync.

## Client patterns
- `use client` is only present in components that use hooks, browser APIs, or client-only libraries.
- Shared UI components are used across pages to maintain visual consistency.
- Local state and interactions are handled inside feature components, while data fetching uses hooks and queries.
