# Visual Source Registry

Status: **NO APPROVED SOURCE IMAGES** as of 2026-10-12. This is an empty approval index, not a mockup deliverable or implementation signoff.
Authority: [VSRC01–VSRC10](specs/visual-source-workflow-spec.md), [#54](https://github.com/arvin-ramezani/imarvin/issues/54), [Signal Studio](specs/visual-system-spec.md). Actual image creation/approval happens in [issue #56](https://github.com/arvin-ramezani/imarvin/issues/56) and its separate future PR. The registry is populated only after actual sources exist.

## Required entry per visual revision

| Field | Required information |
| --- | --- |
| Identity | Immutable source ID and revision/hash; PROPOSED / APPROVED / SUPERSEDED; predecessor/successor |
| Actual source | Durable retrievable versioned image or frame URL, file path; type (mockup/Figma/screenshot), provenance; app SHA if captured from implementation |
| UI coverage | Route/component, scenario/content state, theme, viewport dimensions, focus/interaction state; coverage/reuse; fixture dataset/TEST ONLY marker or real-content provenance |
| Authorities | Exact canonical spec commit/SHA and IDs, related issue/PR; actual media disclosure/provenance if real media is included |
| Owner signoff | Approving actor, date, explicit approval URL listing **this exact source revision and variants**; absent for PROPOSED |
| QA handoff | Separate implementation issue/PR; matching render SHA/environment and independent comparison result only when executed |

## Registry

No actual visual source revisions registered. No historical rendered direction screenshot or PR #51 implementation capture is implicitly approved here.

| Source ID @ immutable revision | Source/provenance | Screen, state, theme, viewport | Spec SHA + IDs | Status | Owner approval evidence | Follow-up QA |
| --- | --- | --- | --- | --- | --- | --- |
| — | No source files yet | — | — | — | — | — |

## Coverage before proposing images

For each screen set, record a compact matrix of wide/narrow (320px where applicable), Light/Dark and materially different content/loading/error/focus states. Use clearly identified synthetic fixture datasets per P18; the registry must preserve fixture provenance in image metadata even if screenshots display realistic-looking interface text. Register immutable images and approval links only when they exist. A mock screenshot or synthetic media slot is **not authentic project Evidence**; never mislabel it, and do not infer actual no-media status from unavailable assets.

[Content inventory](content-inventory.md#screen-scoped-visual-content-gates) keeps O01–O03 open for real publication **without blocking fixture-based mockups, development or tests**.
