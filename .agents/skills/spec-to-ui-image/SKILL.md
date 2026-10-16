---
name: spec-to-ui-image
description: Generate actual proposed imarvin UI mockup images from current UX specifications and a direction brief. Use for authorized image-first screen design or image revision, including desktop/mobile, Light/Dark and materially different states; never substitute prompts for images or approve the output yourself.
---

# Spec to UI Image

## Host and source resolution

Read the bundled [Work source access guide](references/work-source-access.md) first. In a verified Codex checkout, retain the repository-relative links below. In an individually installed ChatGPT Work package, resolve external workflow/specification/cross-skill links through that guide at verified GitHub SHAs; never assume sibling files exist or substitute remembered requirements.

For standalone Work, use bundled [design craft](references/design-craft.md) and its [license](references/LICENSE.emilkowalski); the original sibling craft link below remains for Codex.

## Verify the brief

Read the [shared workflow](../../../docs/engineering/image-first-design-workflow.md) and its scoped authorities; verify current source SHA and canonical IDs. Read [design craft](../ui-art-director/references/design-craft.md) when interpreting the art direction.
Require an authorized bounded image-design task, screen task, direction brief, coverage matrix and fixture dataset. Derive missing design preparation from current specs; use `$ui-art-director` for initial divergent composition. Do not demand real project assets when P18 fixtures suffice.
Confirm actual image-generation and image-viewing capabilities. Follow the available image tool's instructions. If unavailable, report `BLOCKED — image generation unavailable` or `BLOCKED — image inspection unavailable`; return any prepared brief separately as incomplete delivery. Do not create a coded prototype as a substitute.

## Produce actual mockups

1. Record screen/route/state, source SHA/IDs, fixture identities, viewport, theme, direction and reuse/exclusions. Cover materially different states and 320px where applicable; do not multiply trivial variations.
2. Use consistent fictional TEST ONLY data across connected screens. Use sample media only with explicit synthetic provenance; never imply authentic customer evidence, real launches, working contact endpoints or permission for actual media. Keep fixture labels in source metadata even when interface copy reads naturally.
3. Resolve ambiguous media roles through `$media-role-selection`; preserve independent Project/Story media and safe private-parent presentation. Separate missing actual assets from a deliberately no-media fixture. Never borrow private Story media into a public Project.
4. Turn the brief into a precise generation request: concrete content, reading hierarchy, composition/spacing/type roles, approved palette, task affordances, viewport/theme and prohibited deviations. Preserve fixed Home order and P26 presentation. Depict open behavior only after a separately recorded owner decision; otherwise defer the affected variant.
5. For initial alternatives, generate three comparable composition images using the same content/theme/viewport. Do not reduce divergence to color changes. For the selected direction, generate the necessary desktop/mobile and Light/Dark variants and material no-media/empty/error variants, with justified reuse.
6. Generate actual viewable screen images using the available image tool. Present the real outputs, not a prompt or a textual reconstruction. Inspect each at readable size; check glyphs/copy, missing content, false controls, cropping, hierarchy, palette and cross-screen consistency.
7. Revise obvious generation defects and pass actual image revisions plus the source brief to `$senior-design-critic`. Preserve image identities; never claim the generator has proven interactions, focus order, contrast conformance or runtime behavior.

Do not generate production media, application code, HTML/CSS prototypes, schemas or dependency changes. Owner chrome stays motion-free; any public motion intent remains a separately verifiable note, not evidence from the still.

## Revision and approval handoff

Return each actual image with a compact source record compatible with VSRC06:

```text
Status: PROPOSED
Screen / route / state / direction:
Image ID + immutable revision/hash + retrievable image reference:
Spec SHA + requirement/scenario IDs:
Fixture dataset + TEST ONLY provenance (including any sample media):
Viewport dimensions / theme / depicted focus state:
Coverage / reuse / exclusions / unresolved decisions:
Critique status + exact reviewed image revisions:
Issue/PR + approval evidence: pending
```

Use measured image dimensions; record the intended viewport separately if generation size differs. If scale is unclear, flag it for revision rather than claim exact viewport fidelity. Never fabricate a hash, saved path or durable image URL.
Show exact revisions for owner approval only after required corrections are addressed. Selection of a direction or broad praise is not approval of every variant. If approval is ambiguous, leave status `PROPOSED` and request explicit IDs/revisions/variants under VSRC07.
When authorized to register sources, preserve immutable approved bytes and durable owner actor/date/comment evidence in the existing registry. If durable storage or approval recording fails, report incomplete registration. Changed revisions need fresh critique and owner approval; retain superseded history.
Repeat across the #58 screen set; do not begin coding before the shared workflow's all-main-screen design-phase gate is met.
