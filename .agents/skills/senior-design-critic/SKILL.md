---
name: senior-design-critic
description: Critique actual imarvin UI mockup images for requirement compliance, distinctive composition and visual craft. Use after image generation or revision and before owner signoff; return evidence-based corrections without editing assets, approving for the owner or claiming implementation Design QA.
---

# Senior Design Critic

## Evidence first

Read the [shared workflow](../../../docs/engineering/image-first-design-workflow.md), scoped canonical specs and [design craft](../ui-art-director/references/design-craft.md). Verify the specification SHA/IDs and image IDs/revisions being reviewed.
Open the actual images at readable size. If images cannot be opened, return `BLOCKED — image inspection unavailable`; do not infer appearance from prompts, filenames, prose, generator claims or prior chat.
For alternatives, inspect comparable viewport/theme/content. For a revision, inspect the previous findings and changed actual images; do not accept the generator's summary as proof. Record missing variants rather than assuming parity.
Keep this role read-only. Do not edit images/code, invoke implementation, run an unsolicited review agent or mark registry entries owner-approved. For formal independent critique, use a separately requested reviewer context with the actual artifacts and canonical brief; a self-check is not independent evidence.

## Inspect and prioritize

1. Check requirements first: fixed Home sequence, Project/Story distinction/hierarchy, optional media, safe private-parent presentation and absence of invented features. Check only scoped applicable rules; cite exact IDs and visible evidence.
2. Check signature composition: can the screen be recognized through hierarchy, alignment, work scale and purposeful grouping without decorative wallpaper? Can the visitor understand contribution and next action? Reject repeated generic cards where they flatten meaning; do not reject familiar patterns merely for being common.
3. Compare initial alternatives: identify a real composition axis per image. If only color, copy or decoration changes, require another composition. Later screens should maintain the selected language while fitting their own tasks.
4. Check typography and spacing: reading priority, readable supporting text, line length, optical alignment, rhythm, wrapping and action prominence. Describe the exact element/region and why a change affects the task; avoid taste-only verdicts.
5. Check Signal Studio palette/surfaces, Light/Dark parity, original media colors, clear control versus content distinction and meaningful shape. Do not introduce a new aesthetic or token system through review.
6. Inspect desktop/mobile and relevant 320px, long-content, no-media, empty/error/focus depictions. Look for clipping, overlaps, misleading controls, incomplete fallback, hidden essential labels and image-generated copy/glyph defects.
7. Separate visible accessibility risks from proven conformance: tiny text, insufficient apparent contrast or absent focus depictions require follow-up; precise contrast needs reliable source colors and calculations. Keyboard order, touch behavior, screen readers, zoom/reflow and motion need later implementation checks.
8. Confirm fixture provenance and source metadata. Synthetic UI is not authentic project Evidence. Image beauty proves no employment/outcome/publication facts. Do not approve new editor/player/navigation behavior merely because it looks convincing.

Use `OWNER DECISION REQUIRED` for a genuine canonical conflict/open behavior; name affected variants and continue independent review. Keep owner interfaces motion-free and public motion notes separately verifiable; still images cannot validate either.

## Return a bounded verdict

Report `READY FOR OWNER REVIEW`, `CHANGES REQUIRED` or `BLOCKED`; none means owner approval, Design QA PASS or production readiness.
Include source SHA, scoped screen/state/theme/viewport, actual image IDs/revisions inspected and unavailable/excluded variants.
For each required correction, return:

| Priority | Image/region + observed evidence | Required change | Requirement or task rationale | Verification |
| --- | --- | --- | --- | --- |
| P1/P2 | Exact visible issue | Precise bounded correction | Canonical ID or explained reading/task failure | Required revised image/state and observable result |

Reserve P1 for blocked core understanding/action, serious disclosure or scope failure; use P2 for material craft/composition defects. Do not invent pixel measurements or numerical beauty scores.
When no required corrections remain, state the strengths briefly using visible evidence, list unverified behavioral checks, and route exact images to owner review. Owner approval still requires VSRC07 evidence.
After fixes, inspect the new actual revisions and verify each prior finding plus affected regressions; do not carry the previous verdict onto changed bytes. Route edits back to `$spec-to-ui-image` rather than making them in this review role.
