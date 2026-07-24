# CarPool App — Professional Mobile-First UI Redesign Prompt

## Role
Act as a senior Figma designer and full-stack developer with 10+ years of experience building mobile-first, production-grade apps. The goal is to transform the existing carpool app into a clean, professional, highly usable mobile experience.

## Core Principles
- **Mobile-first**: Design for small screens first, then scale up. Most users will access the app on mobile.
- **Content density**: Remove unnecessary padding and whitespace. Show maximum useful data per screen without feeling cramped.
- **Speed & simplicity**: Drivers should publish a ride in the fewest taps possible. Passengers should find and book rides instantly.
- **Profile defaults**: Pre-fill driver name, phone, vehicle details, and preferred cities from the user profile so the create-ride flow is as short as possible.
- **Fully responsive**: The UI must adapt seamlessly from 320px mobile to tablet/desktop without breaking layouts.

## Navigation Changes
1. **Bottom Navigation Bar**
   - Remove the Profile icon from the bottom nav.
   - Replace it with a **Notifications / Alerts** icon (bell) so users can quickly see ride updates.
   - Keep: Home, Rides, Saved.
   - **Center FAB (Floating Action Button)**: Move the "Post a ride" (+) button to the absolute center of the bottom nav. Make it slightly larger than the other nav items (e.g., 12x12 with a soft shadow) so it feels primary and thumb-friendly.
   - Use a floating elevated style: the plus button should break out of the nav bar slightly with a subtle shadow.

2. **Top Header Bar**
   - Move the **Profile icon to the far right** of the top header (after notifications and theme toggle).
   - Use a clean circular avatar or User icon. If the user has a profile photo, show it; otherwise show initials or a default User icon.
   - Keep the app logo/brand on the left and page title centered or left-aligned.

## Search & Discovery UX
- **Home Search Card**: Compact, inline search with From / To cities, date, and seats. Use minimal vertical spacing between fields. Remove outer padding bloat.
- **Filter Sheet**: The filter bottom-sheet should feel native and compact:
  - Use tighter padding (reduce from 5rem to 3-4rem equivalent).
  - Group related filters with subtle dividers.
  - Make toggle switches and selects touch-friendly (min 44px height).
  - Show active filter count clearly on the filter button.
  - Keep the sticky action buttons at the bottom of the sheet.
- **Search Results**: Show more rides per screen. Reduce card padding from 1rem to ~0.85rem. Keep driver avatar, route, time, seats, price, and amenities visible without scrolling.

## Create Ride Flow — Minimal UI
- **Prefill from profile**: Auto-populate driver name, phone, vehicle type/model/color/number, and home city from the user's saved profile. The user should only need to set route, date, time, price, and seats.
- **Compact form fields**: Reduce label sizes to 11-12px, input heights to 40-44px, and vertical spacing between fields to 0.5rem.
- **Single-page or streamlined steps**: If multi-step, collapse the step indicator to a minimal progress bar. Reduce section heading sizes.
- **Preview card**: Keep the live preview compact so the user can verify the ride without excessive scrolling.

## Visual & Spacing System
- **Remove extra padding**: Audit all screens and reduce outer page padding from 1rem/1.5rem to 0.85rem/1rem where possible.
- **Tighter cards**: Reduce card internal padding so more cards fit on one screen.
- **Typography**: Use clear hierarchy — section headings at 14px semibold, body at 13-14px, helper text at 11-12px muted.
- **Touch targets**: Ensure all interactive elements are at least 40-44px for comfortable thumb use.
- **Shadows & elevation**: Use subtle shadows for the FAB and sticky headers to create depth without clutter.

## Accessibility & Polish
- Ensure sufficient color contrast for text and icons.
- Add subtle hover/active states for all tappable elements.
- Use skeleton loaders and empty states that match the compact design language.
- Support dark mode with the same density rules.

## Specific Files to Update
- `components/layout/bottom-nav.tsx` — nav items + centered FAB
- `components/layout/app-header.tsx` — profile icon on far right
- `features/search/components/filter-sheet.tsx` — compact filters
- `features/search/components/search-form.tsx` — minimal search inputs
- `features/search/components/search-header.tsx` — compact search header
- `features/rides/components/create-ride-form.tsx` — prefill + compact steps
- `features/rides/components/ride-card.tsx` — dense but readable cards
- `app/(main)/page.tsx` — home screen density
- `app/(main)/profile/page.tsx` — compact profile layout

## Success Criteria
- A driver can post a ride in under 30 seconds with minimal typing.
- Passengers can search, filter, and find a ride in under 15 seconds.
- The bottom nav feels native (similar to Uber, Lyft, or BlaBlaCar).
- No screen feels empty or padded out — every pixel shows useful information or a clear action.
- The app looks and feels like a professional, funded product, not a prototype.
