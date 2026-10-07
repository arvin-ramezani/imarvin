# UI Skill Policy

Status: accepted implementation policy | Updated: 2026-10-07 | Issue: #32.
Authority: [decisions](../decisions.md) P16 and [Signal Studio](../specs/visual-system-spec.md). Third-party skills advise implementation; they never override product/UX specs.

## 1. Installed skills and mandatory triggers

| Work | Required skill | Rule |
| --- | --- | --- |
| Public UI or related owner editor/preview/review implementation/design/review with ambiguous project-media role, identity, presentation, playback or fallback | [$media-role-selection](../../.agents/skills/media-role-selection/SKILL.md) | Resolve before dependent work; reuse existing Story/Evidence references only under a resolved canonical/authored surface choice; return `OWNER DECISION REQUIRED` when current specs conflict or specs/content leave role/source unresolved; create no media; skip UI with no media concern |
| Data/authored-content UI with variable text/media/states | `$break-ui` | Stress the implemented surface before Design QA; use worst-case data as temporary/test-only evidence, never shipped demo chrome |
| Mobile/touch-facing UI or mobile defect | `$mobile-native` | Check capability queries, viewport height, on-screen keyboard, safe areas, touch/pointer behavior and hover capability. On owner/admin surfaces ignore animated press/hover feedback and every other motion recommendation; real-device evidence when required. |
| Add/change public UI motion | `$animate` | Run the motion gate before implementation; if it says no motion, keep the state change immediate |
| Review a PR that materially changes public motion | `$review-animations` | Run after source changes and before Design QA; evidence belongs to the exact SHA |

Meaningful React/Next.js UI work still uses the repo-local shadcn, Vercel React/composition, test-engineering and Design QA workflows when their existing triggers apply.

## 2. Motion boundary

P16 is strict: owner/admin UI has **no interface animation or transition at any viewport size**. Sign-in, `/studio/**`, private preview, publication review, owner dialogs, hover/press/focus feedback, responsive rearrangement, loading, validation, reordering, status changes and save/publish feedback update immediately. Do not use animated spinners/shimmers, press scale, hover travel, enter/exit motion, stagger or layout animation on owner/admin surfaces.
User-controlled project image/video/recording inspection is content; playback itself is not owner UI animation. The controls around it remain motion-free on owner surfaces and playback never autostarts.
Public motion must have a product purpose such as orientation, hierarchy, feedback, spatial continuity, state indication, inspection continuity, preventing a jarring change, or explaining behavior. Evaluate worthwhile motion on every public route and narrow/medium/wide presentation; do not make useful motion desktop-only or require hover to understand/operate the UI. Motion is not mandatory where it adds no UX value.
Use CSS transitions/`@starting-style` first. Framer Motion is the selected JS motion library for public springs, layout/exit animation, or gesture-driven values when CSS is insufficient. Upstream references to Motion/motion.dev are technique guidance, not dependency authority.
Do not add `framer-motion` speculatively. Add it in the first bounded public-motion issue that actually needs it, with bundle/client-boundary justification. Every public motion path includes reduced-motion handling, cannot be required to understand or complete a task, and must have an immediate equivalent when reduced motion is requested.

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

Before dependent public UI or related owner editor/preview/review implementation or review, resolve ambiguous media choices with `$media-role-selection`. Retain its compact decision and authority citations in task/PR evidence; unresolved choices block only dependent work. Follow canonical Story discovery projections for browse/Experience choices; do not request a redundant surface assignment for a valid mapped source. Ask the smallest precise owner question only when specs/content cannot resolve the choice or conflict. Skip UI with no media concern; explicit choices still require canonical review. This skill does not approve P15 layouts or replace media implementation/accessibility checks.
For public UI without motion: implementation → deterministic checks → `$break-ui` when variable content applies → `$mobile-native` when touch/mobile applies → Design QA.
For public UI with motion: load `$animate` before writing motion, then implementation → deterministic checks → `$break-ui`/`$mobile-native` as applicable → `$review-animations` → Design QA.
For owner/admin UI: implementation → deterministic checks → `$break-ui`/`$mobile-native` as applicable → Design QA. Animation skills must not be used to introduce owner UI motion.
If any source changes after a review/check, rerun only the affected exact-SHA evidence per the normal gate policy.
