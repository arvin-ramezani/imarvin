# UX Principles

Status: design knowledge and proposed review contracts, not empirical research. Applies to PRD R01–R26.

## Grounding

Derived from Product Design's brief-first workflow, concept variation by structure/interaction, focused primary-screen guidance, information hierarchy, core-journey completeness, feedback, and later visual verification.

Owner feedback: prior direction felt boring and résumé-like. Inspected documents prescribed a linear career/work page and quiet editorial treatment. This is a document diagnosis, not a screenshot audit. No visual reference was inspected in this revision.

## Reusable rules

| ID | Rule | Observable condition |
| --- | --- | --- |
| UX01 | Start with user intent and outcome | Every interaction names what the visitor is trying to understand/do |
| UX02 | Focus the first screen | One primary action; supporting content does not become a feature inventory |
| UX03 | Creativity changes the experience | Choosing/inspecting changes meaningful content, not only decoration |
| UX04 | Group by meaning before adding boxes | Hierarchy uses composition, spacing, type, and contrast; not every section/item becomes a card |
| UX05 | Reveal depth progressively | Summary explains the work; optional detail exposes decisions/evidence without blocking basic comprehension |
| UX06 | Maintain orientation | Selected item, active state, title, back/reset and deep link are predictable |
| UX07 | Keep freedom and recovery | Browsing/contact do not require tour completion; empty/error states provide next actions |
| UX08 | Preserve parity | Keyboard/touch/mobile/reduced-motion paths can perform the same core tasks |
| UX09 | Use evidence honestly | Purposeful stills aid discovery; recordings explain actual behavior; captions distinguish capture stage from release history; no-media/failed-media work remains complete (ME01–ME04) |
| UX10 | Validate the actual experience later | Written contracts are followed by visual and interaction checks; aesthetics/usability are not certified by prose |

## Compact interaction template

- Intent: what the user wants.
- Trigger: one clear action.
- State/result: what visibly changes and what remains in context.
- Recovery: back, reset, empty, loading, error, and unavailable paths.
- Parity: mobile, keyboard, reduced motion.
- Evidence: acceptance condition and later verification method.

Example (proposed, no new facts): select a Unixsee project → its story becomes active → inspect an authored decision → return to the same collection → use the same actions by keyboard/mobile. Missing decision evidence shows the confirmed contribution and status instead of fabricated content.

## Later validation tasks

- Visitor opens work, identifies one real contribution, inspects a decision/evidence, and returns.
- Visitor reaches relevant contact without completing exploration.
- Visitor repeats the core loop without optional imagery, with keyboard/reduced motion, and at 320px.
- Visitor identifies what a cancelled/never-shipped project's image/recording demonstrates, plays it explicitly or uses its equivalent explanation, and returns without losing context; [MV01–MV08](specs/media-evidence-spec.md#7-verification-boundary) define media checks.
- Owner edits and previews a work story; private/public state remains clear.

These tasks define what to evaluate, not claimed user-research results. Define concrete success/failure criteria in the acceptance specification.
