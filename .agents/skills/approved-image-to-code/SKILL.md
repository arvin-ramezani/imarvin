---
name: approved-image-to-code
description: Verify approved visual sources and guide bounded imarvin implementation from those exact images. Use for implementation planning or separately authorized coding after the main-screen image phase; preserve canonical behavior, architecture and independent Design QA rather than treating a screenshot as a functional specification.
---

# Approved Image to Code

## Require concrete authority

Read the [shared workflow](../../../docs/engineering/image-first-design-workflow.md), [engineering workflow](../../../docs/engineering/spec-driven-development.md), current agent rules, scoped implementation spec and [UI skill policy](../../../docs/engineering/ui-skill-policy.md).
Verify repository root, branch/PR, baseline HEAD and worktree status before edits; preserve unrelated files. Require one bounded implementation issue rather than a tracker.
Verify completion of the owner's all-main-screen image phase, or explicit owner-approved deferrals with impact recorded. Approved images do not authorize coding: require separate implementation authorization and follow plan-first gates.
Open the registry's exact approved actual image revisions and durable owner approval evidence. Match screen/route/state, fixture content, viewport/theme and current spec SHA/IDs. Missing, inaccessible, unapproved or materially stale sources mean `BLOCKED — visual source` for affected work; do not fall back to an old screenshot or prose approximation.
For a genuinely minor/nonvisual VSRC01 exception, record `VISUAL SOURCE NOT REQUIRED` with scope/reason; do not use that exception to bypass the requested design-phase sequence for meaningful new UI.
If an image conflicts with current behavior/privacy/accessibility/motion rules, cite the conflict and return `OWNER DECISION REQUIRED`; do not silently change requirements or reinterpret the image as approval of new behavior.

## Plan before code

1. Map approved composition to existing components and semantic theme tokens. Inspect actual architecture and relevant code; use current Next.js guides per agent rules. Prefer reuse over new variants, dependencies or client boundaries.
2. Define files/components, required states, responsive transformation, theme parity and data/media identity. Images guide appearance; canonical specs own behavior, failure paths, privacy and publication semantics.
3. Resolve ambiguous media roles through `$media-role-selection`; never borrow independent/private assets. Use P18 fixtures for implementation comparison without treating them as production content. Preserve no-media and private-parent behavior.
4. Define meaningful positive/negative/boundary/regression verification for the scope, including keyboard/focus, 320px/reflow, Light/Dark/System, error recovery and content variability where affected. Do not generate tests that merely mirror markup.
5. Produce the bounded plan with source IDs/revisions, spec revision and baseline SHA. Stop at `PLAN ONLY` until required Independent Plan Review passes and implementation is authorized. A changed visual/spec scope invalidates affected plan approval, not unrelated evidence.

## Execute only the approved plan

When separately authorized, implement screen by screen within the approved issue/plan. Use repo-local shadcn, React/composition, test-engineering and next-dev-loop skills when triggered; do not install a replacement UI library just to resemble an image.
Retain semantic HTML, accessible names/focus, correct server/client boundaries and central config/logger contracts. Do not hardcode a screenshot as UI, rasterize interface text or ship synthetic fixtures as factual public content.
Owner/admin interfaces have no animation or transition. For authorized purposeful public motion, run `$animate` first, preserve immediate reduced-motion equivalence and route material changes to `$review-animations`; static visual approval does not approve new motion.
If correct behavior materially changes the approved composition, stop dependent work for a revised source/owner decision. Do not silently redesign to make coding easier or alter backend contracts through a visual task.

## Verification and handoff

Run scoped deterministic checks. Use `$break-ui` for variable content and `$mobile-native` for touch/mobile within its owner no-motion limits. Capture the implementation using the approved fixture/state/viewport/theme without leaking private content.
Route independent Design QA to the existing [$design-qa](../design-qa/SKILL.md): compare exact owner-approved source and rendered current-head UI in the same comparison input. Do not self-certify an independent gate; implementation screenshots can be evidence but cannot retroactively prove prior fidelity.
Preserve Security Review, Independent Review and runtime acceptance when required by the task. Never replace those with image critique or a passing build.
Use the repository/user HANDOFF contract: include exact PR HEAD, issue/plan/spec/source revisions, actual checks, captures, remaining gates and blockers. Changed code invalidates affected implementation evidence; changed images require fresh owner approval and affected plan/QA checks under VSRC10.
Do not merge, deploy, mark production-ready or close design trackers through this skill. Return the one exact next gate; owner authorization remains required for merge in this workflow.
