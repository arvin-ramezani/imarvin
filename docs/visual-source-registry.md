# Visual Source Registry

Status: **NO APPROVED SOURCE IMAGES** as of 2026-10-12. This is an empty approval index, not a mockup deliverable or implementation signoff.
Authority: [VSRC01–VSRC10](specs/visual-source-workflow-spec.md), [#54](https://github.com/arvin-ramezani/imarvin/issues/54), [Signal Studio](specs/visual-system-spec.md). Actual image creation/approval happens in [issue #56](https://github.com/arvin-ramezani/imarvin/issues/56) and its separate future PR. The registry is populated only after actual sources exist.

## Required entry per visual revision

| Field | Required information |
| --- | --- |
| Identity | Immutable source ID and revision/hash; PROPOSED / APPROVED / SUPERSEDED; predecessor/successor |
| Actual source | Durable retrievable versioned image or frame URL, file path; type (mockup/Figma/screenshot), provenance; app SHA if captured from implementation |
| UI coverage | Route/component, scenario/content state, theme, viewport pixel dimensions, focus/interaction state; coverage matrix reference; exclusions/reuse |
| Authorities | Exact canonical spec commit/SHA and IDs, related issue/PR, factual-media permissions where needed |
| Owner signoff | Approving actor, date, explicit approval URL listing **this exact source revision and variants**; absent for PROPOSED |
| QA handoff | Separate implementation issue/PR; matching render SHA/environment and independent comparison result only when executed |

## Registry

No actual visual source revisions registered. No historical rendered direction screenshot or PR #51 implementation capture is implicitly approved here.

| Source ID @ immutable revision | Source/provenance | Screen, state, theme, viewport | Spec SHA + IDs | Status | Owner approval evidence | Follow-up QA |
| --- | --- | --- | --- | --- | --- | --- |
| — | No source files yet | — | — | — | — | — |

## Coverage before proposing images

For each selected screen set, record a compact matrix of wide/narrow (320px where applicable), Light/Dark and materially different content/loading/error/focus states in its visual-design issue. Attach the exact source revision(s), explicit reuse/exclusion reasons and approval links here only after the image files or stable versioned frames exist. Never register customer screenshots or project Evidence as UI mockups without permission/provenance. Do not turn an unconfirmed asset into a no-media claim.

[Content dependencies](content-inventory.md#screen-scoped-visual-content-gates) are input gates; unknown featured work, project facts, capture rights and Contact destinations remain unresolved.
