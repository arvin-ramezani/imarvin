# Signal Studio Theme + UI Lint Foundation

Status: implementation spec | Issue: #10.
Authority: `docs/specs/visual-system-spec.md`; architecture/workflow docs on `main`.
Goal: replace Nova scaffold values with approved Signal Studio tokens and activate bounded `@shadcn/lint` rules before product UI work.

## 1. Scope

Implement only theme primitives and lint policy.
Do not build public/owner screens, install a component catalog, add theme-toggle behavior, or select a final typeface.
Base UI + Nova remain the component foundation; Signal Studio is the visual authority.

## 2. Approved token source

Use these approved roles exactly unless accessibility testing proves a technical adjustment is required and that change is returned for review.

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | `#F4F2ED` | `#15171B` |
| Surface | `#FFFFFF` | `#1E2128` |
| Ink | `#171A1F` | `#F1F3F6` |
| Muted ink | `#515861` | `#B4BBC6` |
| Signal | `#244BDB` | `#93ABFF` |
| Signal wash | `#E4EAFF` | `#252F4D` |
| Boundary | `#747C8A` | `#737E90` |
| Destructive | `#AE2634` | `#FF8792` |
| Action fill | `#244BDB` | `#3B63EF` |
| Action ink | `#FFFFFF` | `#FFFFFF` |

Expose explicit Tailwind semantic names for these roles through `@theme inline` so UI code can use names such as `bg-canvas`, `bg-surface`, `text-ink`, `text-muted-ink`, `text-signal`, `border-boundary`, and `bg-action-fill`.

## 3. shadcn semantic mapping

Map standard shadcn roles to Signal Studio without creating extra colors:
- `background` → Canvas; `foreground` → Ink.
- `card` / `popover` → Surface with Ink foreground.
- `primary` → Action fill with Action ink foreground.
- `secondary` → Surface with Ink foreground.
- `muted` → Surface; `muted-foreground` → Muted ink.
- `accent` → Signal wash; `accent-foreground` → Ink.
- `destructive` → Destructive.
- `border` / `input` → Boundary.
- `ring` → Signal.

The Destructive token is a text/icon emphasis role. It does not authorize a filled destructive action; a future filled variant needs its own contrast-checked pair.

Remove generated chart/sidebar color tokens from the project theme until an approved feature needs those roles. This prevents the linter from treating unapproved scaffold colors as valid design tokens.

Set the base radius to `0.5rem` (8px). Generated smaller radius aliases may derive from it; component implementation must still respect the approved 4px-control / up-to-8px-grouping direction.
Keep the current Geist setup provisional. This issue does not approve it as the final brand typeface.
Keep Tailwind's normal spacing mechanics; `no-arbitrary-values` prevents one-off values, while the approved 4/8/12/16/24/32/48/64/96px scale remains a design-review contract until a stricter machine rule is justified.

## 4. @shadcn/lint policy

Enable for application UI:
- `shadcn/no-restyle`: error with `allow: ["layout"]`.
- `shadcn/no-raw-colors`: error.
- `shadcn/no-arbitrary-values`: error with `allow: ["layout"]`.
- `shadcn/no-inline-styles`: error.
- `shadcn/require-static-classes`: error.

For `components/ui/**`, disable `no-restyle`, `no-arbitrary-values`, and `require-static-classes` only; keep raw-color and inline-style checks active.

Introduce `shadcn/no-unknown-classes` as warning, run the full foundation, and promote it to error in the same PR only if the measured tree is clean or any required allowance is narrow and documented.

Do not use blanket disables. Any exception must be local and include a reason tied to an approved design requirement.

## 5. Agent contract

Update root `AGENTS.md` so UI agents:
- read the visual-system spec before styling;
- use semantic tokens instead of raw Tailwind palette colors;
- run `npm run lint` after UI changes and fix shadcn diagnostics;
- do not add new theme tokens, variants, or lint exceptions without issue/spec authority.

## 6. Verification

Required:
- inspect `app/globals.css` and confirm every project color token traces to an approved role;
- `npm ci`;
- `npm run lint`;
- `npm run build`;
- `npm audit --omit=dev`;
- verify light and dark variables exist for every approved role;
- confirm no chart/sidebar scaffold colors remain;
- report whether `no-unknown-classes` is warning or promoted to error and why.

No rendered visual approval is claimed by this foundation PR; rendered theme/contrast/focus validation remains a later implementation check.
