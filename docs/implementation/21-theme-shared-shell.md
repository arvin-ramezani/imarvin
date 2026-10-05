# Issue #21 — Theme Behavior + Shared App Shell

Status: accepted implementation contract | Issue: #21 | Parent: #13 | Base: `28d21de8ae983bd2f7a5b82cc1c3092abc21736a`

## Goal

Implement P14/R27 theme behavior and the smallest reusable public/owner shell without adding product feature UI or changing auth boundaries.

## Theme architecture

- No theme package: use one small client theme utility plus an inline first-paint bootstrap script.
- Preference values are `system | light | dark`; absence of a stored override means `system`.
- Storage key: `imarvin-theme`. Store only explicit `light`/`dark`; choosing `system` removes the key.
- Resolved mode is `light | dark`. System reads `prefers-color-scheme`; inability to resolve falls back to Light.
- The bootstrap script runs in the root document before visible content, updates the root `.dark` class, `color-scheme`, and data attributes before first paint, and tolerates storage/media-query failures.
- `suppressHydrationWarning` is limited to the root `html` because theme attributes/class are intentionally changed before hydration.
- The client utility listens for device-theme changes only while preference is System. Explicit Light/Dark ignores later device changes.
- Theme switching mutates only root theme state and local storage. It never reloads, navigates, touches history, scrolls, selection, dialogs, or form state.

## Theme utility

- One compact disclosure-style control in shared navigation; not a permanent three-button strip.
- Trigger accessible name follows `Theme: <preference>, currently <resolved>`.
- Open state presents a labeled single-choice radio group with visible System / Light / Dark labels and small approved icons.
- Selecting an option applies the theme immediately, closes the utility, and restores focus to the trigger.
- Native keyboard/touch semantics are preferred over custom roving-focus code.
- No full-page theme transition; reduced motion requires no special alternate interaction because theme changes are immediate.

## Shared shell

- Add a server `AppShell` with a skip-to-main link, compact identity/navigation, theme utility, and reusable main-content slot.
- Public home uses the shell without placeholder product content.
- Keep one neutral `AppShell` reusable by both public pages and future authenticated owner layouts; do not create a misleading owner wrapper before an owner route exists.
- This issue does not create an owner route or modify `requireOwnerSession`; therefore Security Review remains not required.
- All styling uses existing Signal Studio semantic tokens and logical spacing/direction utilities.

## Testing

- Vitest pure tests cover stored preference parsing and resolved-mode behavior; Playwright verifies the pre-paint bootstrap in a real browser.
- React Testing Library + user-event cover current choice/name, selection, focus return, storage behavior, and live System device changes.
- Playwright covers browser-only behavior: first-paint resolved theme, reload persistence, System media changes, no navigation/history/state loss, reduced motion, and 320px overflow/focus.
- Browser tests use the real app shell only; temporary test state may be injected by the test rather than shipped as product UI.
- CI installs Chromium for the Playwright job and runs it after the deterministic unit/build checks.

## Acceptance mapping

- TH01/TH02/TH03: preference resolver + Playwright first-paint/persistence/device-change checks.
- TH04: RTL/Playwright state, scroll, history, input and focus preservation.
- TH05: Playwright 320px + reduced-motion and keyboard operation.
- TH06: first-paint coverage on implemented public shell; sign-in/preview/owner rendered routes remain deferred because this issue does not create those surfaces.
- AR01/AR02/AR04/AR05 apply only to the implemented shared shell surface.

## Non-goals

No new palette/tokens, auth/session changes, product IA, feature screens, server theme persistence, account sync, decorative transitions, media behavior, or production deployment changes.

## Gates

Deterministic verification, Design QA, Independent Review, and local runtime acceptance are required. Security Review is not required unless implementation changes auth/private-public boundaries.
