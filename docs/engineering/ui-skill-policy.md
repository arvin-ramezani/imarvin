# UI Skill Policy

Status: accepted implementation policy | Updated: 2026-10-07 | Issue: #32.
Authority: [decisions](../decisions.md) P16 and [Signal Studio](../specs/visual-system-spec.md). Third-party skills advise implementation; they never override product/UX specs.

## 1. Installed skills and mandatory triggers

| Work | Required skill | Rule |
| --- | --- | --- |
| Data/authored-content UI with variable text/media/states | `$break-ui` | Stress the implemented surface before Design QA; use worst-case data as temporary/test-only evidence, never shipped demo chrome |
| Mobile/touch-facing UI or mobile defect | `$mobile-native` | Check capability queries, viewport/keyboard/safe-area/tap behavior; real-device evidence when the issue requires it |
| Add/change public UI motion | `$animate` | Run the motion gate before implementation; if it says no motion, keep the state change immediate |
| Review a PR that materially changes public motion | `$review-animations` | Run after source changes and before Design QA; evidence belongs to the exact SHA |

Meaningful React/Next.js UI work still uses the repo-local shadcn, Vercel React/composition, test-engineering and Design QA workflows when their existing triggers apply.

## 2. Motion boundary

P16 is strict: UI motion is for public visitor-facing surfaces only. Do not animate sign-in, `/studio/**`, private preview, publication review, owner dialogs, status changes, save/publish feedback, validation, reordering, or other owner/admin UI chrome.
User-controlled project image/video/recording inspection is content; playback itself is not an owner UI animation. The controls around it remain motion-free on owner surfaces.
Public motion must have a product purpose such as feedback, spatial continuity, state indication, preventing a jarring change, or explaining behavior. It is never added merely to make the site feel busy.
Use CSS transitions/`@starting-style` first. Framer Motion is the selected JS motion library for public springs, layout/exit animation, or gesture-driven values when CSS is insufficient. Upstream references to Motion/motion.dev are technique guidance, not dependency authority.
Do not add `framer-motion` speculatively. Add it in the first bounded public-motion issue that actually needs it, with bundle/client-boundary justification. Every public motion path includes reduced-motion handling and cannot be required to understand or complete a task.

## 3. Deferred skills — install just in time

| Skill | Trigger to install/use |
| --- | --- |
| `find-animation-opportunities` | A dedicated public-motion polish pass or explicit request to find worthwhile motion; run read-only before proposing implementation |
| `improve-animations` | Several public animations exist and a codebase-wide motion audit/plan has clear value, especially before final public UI polish |
| `prototype` | A material public UI component has an unresolved design direction and the owner explicitly authorizes isolated variants; prototype code stays out of production until a winner is chosen |
| `emil-design-eng` | A focused public UI polish review needs broader craft guidance; Signal Studio remains the higher authority |
| `pick-ui-library` | A bounded issue genuinely needs a new UI library not already covered by shadcn/Base UI; inspect existing dependencies first |
| `ask-sonner` | Sonner is explicitly adopted for a bounded feature; do not install Sonner merely because the skill exists |
| `apple-design` | An approved public gesture/physical interaction needs that specific behavior guidance; never use it to replace Signal Studio aesthetics |

Do not install Expo/Swift-only skills for this web project.

## 4. Verification order

For public UI without motion: implementation → deterministic checks → `$break-ui` when variable content applies → `$mobile-native` when touch/mobile applies → Design QA.
For public UI with motion: load `$animate` before writing motion, then implementation → deterministic checks → `$break-ui`/`$mobile-native` as applicable → `$review-animations` → Design QA.
For owner/admin UI: implementation → deterministic checks → `$break-ui`/`$mobile-native` as applicable → Design QA. Animation skills must not be used to introduce owner UI motion.
If any source changes after a review/check, rerun only the affected exact-SHA evidence per the normal gate policy.
