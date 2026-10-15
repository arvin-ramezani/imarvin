# Image-first design skills

Status: workflow guidance for #59; no images, new product decisions or visual approvals. Baseline inspected: `4fca09c9bd449c57c8461a2987b0d89a6a0a9858`.
Use [#58](https://github.com/arvin-ramezani/imarvin/issues/58) for screen sequencing and [#56](https://github.com/arvin-ramezani/imarvin/issues/56) for image delivery/approval. Those issues retain their own completion criteria.

## Shared authority and inputs

Before each task, verify current repository/issue state and exact source SHA; read only scoped companions. Treat this document as routing, never a replacement specification.

| Read | Purpose |
| --- | --- |
| [Agent rules](../../AGENTS.md), [PRD](../../PRD.md), [decisions](../decisions.md) | Authority, audiences, outcomes, exclusions and approved versus open choices |
| [Requirements checkpoint](../ux-requirements-checkpoint.md), [public checkpoint](../specs/ux-public-checkpoint.md) | Current scoped requirements; preserve P20 order and P26 presentation |
| [Signal Studio](../specs/visual-system-spec.md) | Palette, composition, hierarchy, responsive/theme and motion boundaries |
| [VSRC](../specs/visual-source-workflow-spec.md), [registry](../visual-source-registry.md) | Exact visual revisions, coverage, approval and invalidation |
| [Content inventory](../content-inventory.md#screen-scoped-visual-content-gates) | P18 fictional TEST ONLY datasets, distinct from actual project Evidence |
| [Project/Story](../specs/project-story-spec.md), [media](../specs/media-evidence-spec.md) | Independent content/media, optional parents, privacy and complete no-media layouts |
| [Navigation](../specs/navigation-state-spec.md), [accessibility](../specs/accessibility-responsive-spec.md) | Return/focus, keyboard/touch, reflow and later behavioral verification |
| [Contact](../specs/contact-ux-checkpoint.md), [owner content](../specs/owner-content-checkpoint.md), [owner UX](../specs/owner-ux-spec.md), [publishing](../specs/content-publishing-spec.md) | Load when the selected task involves these behaviors |

If current authorities conflict, cite exact paths/IDs and return `OWNER DECISION REQUIRED` for dependent work. Do not settle open behavior through a mockup. Continue independent variants with documented exclusions.
Choose typography, spacing and composition within the visual contract without demanding approval of every pixel. Do not reopen approved decisions. Ambiguous media role/source additionally triggers [$media-role-selection](../../.agents/skills/media-role-selection/SKILL.md).

## Roles and sequence

| Skill | Input | Output and boundary |
| --- | --- | --- |
| [$ui-art-director](../../.agents/skills/ui-art-director/SKILL.md) | Scoped screen brief, requirements, established direction | Three defensible composition hypotheses and tradeoffs; no code or automatic image generation |
| [$spec-to-ui-image](../../.agents/skills/spec-to-ui-image/SKILL.md) | Verified brief, direction(s), coverage matrix and fixtures | Actual proposed images with revision/provenance handoff; no self-approval |
| [$senior-design-critic](../../.agents/skills/senior-design-critic/SKILL.md) | Actual image revisions and their brief/spec evidence | Evidence-based corrections and design-review status; no edits or implementation QA |
| [$approved-image-to-code](../../.agents/skills/approved-image-to-code/SKILL.md) | Approved exact sources plus separate bounded implementation issue | Plan first, then separately authorized implementation; existing engineering gates remain |

1. Select one bounded screen set under #58, starting with Home when authorized; use #56's shared image contract. Do not implement a tracker.
2. Run art direction for the initial visual language or an explicitly requested rethink. Explore three materially different compositions under the same requirements and fixtures; later screens inherit the selected language instead of repeating divergence automatically.
3. Generate actual image alternatives with the image skill; critique visible revisions and refine required defects. Return changed revisions for a fresh critique. A critic verdict is a recommendation, never owner approval.
4. Present exact viewable images to Arvin; obtain explicit revision/variant approval and register immutable sources under VSRC06–VSRC07. Selecting a direction alone does not approve all screens or variants.
5. Repeat screen by screen. **Finish all applicable main-screen images and major variants before beginning application coding**, per the owner's requested sequence. Record any owner-approved deferral and its impact explicitly; never silently omit a screen or critical state.
6. Once that design phase is complete, obtain separate bounded implementation authorization and deliver incrementally screen by screen. Reuse the existing implementation roadmap; preserve plan/review gates.

Cover desktop/mobile, Light/Dark and materially different states; include 320px where applicable. Document justified reuse/exclusions instead of generating every trivial permutation. Do not require unresolved backend mechanics for unrelated composition work.
Preserve complete no-media layouts, independent Project/Story identity, safe private-parent presentation, P17 where applicable, and motion-free owner interfaces. Public motion remains separately specified and checked; still images cannot certify motion or interactions.

## Using the skills in ChatGPT and Codex

Repo-local skills are discoverable in a supporting Codex checkout. Merely committing them does **not** install them as ChatGPT skills/plugins or grant GitHub/image-generation capabilities.
In Work, load the selected `SKILL.md`, this workflow and its referenced craft guidance through available GitHub/file tools. In normal ChatGPT, attach/paste those instructions and the scoped current specifications if repository access is unavailable. Supply the exact source revision; never claim to have fetched unavailable files.
Use an available image-generation capability for actual mockups. If it is absent, report `BLOCKED — image generation unavailable`; a brief or prompt can be preparation only, never completed image delivery. Use actual image viewing for critique; report inaccessible sources rather than reviewing from filenames.
Persist approvals in retrievable issue/PR evidence; chat recollection alone is insufficient. Installation into account-wide skill storage is a separate operation, not performed by this repository PR.

Example design-phase request:

```text
Load ui-art-director and the shared image-first workflow from current imarvin.
For the authorized Home design issue, verify source SHA and scoped requirements.
Prepare three different compositions within Signal Studio; no code.
Then use spec-to-ui-image only when actual image generation is authorized.
Use senior-design-critic on the resulting visible revisions before my approval.
```

## Evidence and limits

Record source SHA/IDs, screen task, direction, fixture dataset, route/state, viewport/theme, actual image ID/revision/hash and exclusions in the design handoff. Keep registry fields canonical; do not fabricate entries, approval URLs or claims.
Approved images govern appearance within canonical behavior. A changed image or relevant requirement invalidates affected approvals/plans/comparisons; unchanged variants may be reused by immutable reference under VSRC10.
Static critique does not establish accessibility conformance, usability results, implementation fidelity, security or runtime acceptance. Those require their own observed evidence at the applicable revision.
For upstream knowledge and local adaptations, read [design craft provenance](../../.agents/skills/ui-art-director/references/design-craft.md). Existing vendor skills and `skills-lock.json` remain unchanged.
