---
name: media-role-selection
description: Resolve ambiguous image, video, poster, Evidence identity, or no-media choices for imarvin UI using canonical repository specifications and existing authored content. Mandatory for agents implementing, designing, or reviewing public UI or related owner editor/preview/review when a media choice is not explicit. Skip unrelated UI with no media concern. Return a compact decision and OWNER DECISION REQUIRED when canonical rules cannot resolve valid alternatives or conflict. Never generate, acquire, or invent project media.
---

# Media Role Selection

## Authority and boundaries

Resolve a media decision only; do not create/edit assets, generate posters, search for substitute imagery, change authored selections, implement UI, or change schema/storage/upload behavior through this skill.
Locate repository root. Read [agent rules](../../../AGENTS.md), [decisions](../../../docs/decisions.md), P19–P25 [requirements checkpoint](../../../docs/ux-requirements-checkpoint.md), [public](../../../docs/specs/ux-public-checkpoint.md), [Project/Story](../../../docs/specs/project-story-spec.md), and [media/evidence](../../../docs/specs/media-evidence-spec.md), then scoped companions. Inspect the supplied surface and existing authored Project/Story/media records or fixtures; do not infer assets from filenames, screenshots in prior reviews, or implementation placeholders.

| Authority | Read for |
| --- | --- |
| [Public UX](../../../docs/specs/public-ux-spec.md) | Current Project/Story surfaces, optional no-media, historical Work boundaries |
| [Components/interactions](../../../docs/specs/components-interaction-spec.md) | Component roles, controls and visible states |
| [Owner UX](../../../docs/specs/owner-ux-spec.md) | Authoring, exact saved preview candidate and publication review |
| [Accessibility/responsive](../../../docs/specs/accessibility-responsive-spec.md) | Alternatives, playback, reduced motion, keyboard/touch and reflow |
| [Visual system](../../../docs/specs/visual-system-spec.md) | Signal Studio composition, authentic colors/proportions and theme parity |
| [Content/publishing](../../../docs/specs/content-publishing-spec.md) | Snapshot identity, authorization, orthogonal project facts and reference lifecycle |
| [Navigation/state](../../../docs/specs/navigation-state-spec.md) | Inspection, deep links, focus/return and unavailable states |
| [UI skill policy](../../../docs/engineering/ui-skill-policy.md) | P16 motion boundary and companion skill routing |

Apply explicit owner instructions and confirmed decisions before proposals, with each document authoritative in its own scope. Canonical repo specs always override this skill's routing index and examples. Resolve from current P19 Project/Story roles and existing authored selections. Project and Story own independent optional media; do not reuse historical Story discovery/Evidence identity as a new Project's automatic source. Never infer a full-product component/gallery role from a legacy W43 test fixture. If role/source remains unspecified, conflicting or incompatible, return `OWNER DECISION REQUIRED`; never supply a missing product rule. Cite paths and stable IDs/sections; do not silently rewrite authority.
Preserve proposed/pending status: P15 media layouts require later validation and bounded implementation authority. A selection decision does not approve assets, layouts, schema, dependencies or application code. Treat the roles below as design responsibilities, not new database fields/enums.

## Decision procedure

1. Identify the surface, visitor task and context: public snapshot, private saved candidate, or editor session. Determine whether a visual helps recognition, understanding or inspection (ME01–ME03); do not require media for completeness.
2. Resolve role/source from the current placement map and companions plus existing authored selections compatible with those contracts. For P19: Projects browse uses Project's own authored public cover; Stories browse uses Story's independently authored public visual; each may have none. Historical W43 Work browse/multi-project Experience choices reused Story discovery-cover projections; that mapping applies **only to the historical slice**, not new P19 UI (media/evidence §2). If no canonical role/source exists or authored choices are insufficient/incompatible, return `OWNER DECISION REQUIRED`; examples cannot create product rules.
3. Trace the assignment to its existing **Project or Story** identity, snapshot/candidate revision, media identity and source/poster/rendition where available; legacy Work Evidence IDs apply only to that slice. Public surfaces use only currently published authorized references; preview uses the exact saved candidate with published dependencies. Reuse references, never independent editable copies. Record actual identifiers or verified record locations; never fabricate IDs or schema support.
4. Check source readiness, permission, capture stage and required alternatives. Distinguish confirmed absence, a failed selected item, and content/identity that has not been supplied or cannot be inspected. Inaccessible or unknown content is not proof of no authored media.
5. Choose image, static video poster, approved inspection/player if applicable, authored text/link, logo/name, or complete text-only presentation under the role rules below. An existing poster must depict the actual recording or identified same-build/state screenshot (ME07); never promise a missing video or generate a poster.
6. Specify playback, loading/failure/absence behavior and accessibility/truthfulness checks. If valid candidates remain equally suitable, a required assignment/fact is missing, or authorities conflict, stop the dependent choice and ask the owner as described below.

## Role routing

The current P19 roles below take precedence; exact full-product gallery/player component designs are still open. Legacy W43 examples/fixtures remain read-only historical inputs, not new product requirements.

| Current surface | Media identity/source | Presentation and absence |
| --- | --- | --- |
| Home Featured Project | **Published Project's own** authored optional cover/poster | Static identity/contribution + Explore Project; no autoplay; full text hero without media |
| Projects browse | Same Project's authorized authored public discovery image/poster, if any | Opens Project; no forced thumbnail or video player |
| Stories browse | Story's **independent** optional published media, if any | Opens Story; do not borrow Project or private parent media |
| Project detail | Project's own optional cover/showcase after contribution (P25) | Zero/one/many media, truthful captions/stages, complete text without media |
| Story detail | Story's own optional contextual media inside explanation | No mandatory Problem/Decisions/Evidence tabs, gallery or media count |
| Public Project-related Stories | Only currently published children; each Story's own authored public media | Hide section when none; no private child/parent disclosure |
| Home Experience | Company logo/name, optional published Project link | No company-header screenshot, Experience detail page or embedded main-product Story |
| Owner editor/preview/review | Exact Project or Story candidate media, independently private until publication | Never Apply arrangement as Publish or borrow private Story media |
| No authored media | No media assignment | Complete text/no blank slot, no dead Play action |

**Historical W43-only source roles:** Story discovery cover for Work browse, multi-project Experience choices, and Story lead/Evidence identity are W43-only. P17 figure-to-Evidence Close/focus behavior applies wherever that interaction exists; W43 supplies historical implementation/test evidence only. Their IDs and script fixtures are not an authority for new P19 Project/Story layouts. Unknown actual authored source means `OWNER DECISION REQUIRED`, not invented no-media content.

## Playback, fallback and checks

- For any approved playback surface apply ME05's no-autoplay/accessibility bounds; exact full-product gallery/player/zoom/return components still need design. Do not impose a second Play control or historical Work Evidence UI on P19 Stories. Stop playback/audio on close, hide, item change or leaving; retain the canonical focus/return behavior. Discovery remains static and does not preload all videos.
Keep these states separate under media/evidence §5, ME03/ME05/ME07–ME08, publishing §§3–6 and navigation/state §§4–5; loading stays local to selected media and retains known public caption/text/actions.

| Condition | Required decision / fallback |
| --- | --- |
| No authored media, confirmed | Complete Project or Story text and its opening action; omit empty media slots/controls. Historical Work text Evidence remains when authored. |
| Failed discovery delivery | Keep affected Project or Story context and its own opening action usable; retain media identity for recovery, never silently substitute assets. Historical W43 Experience choice follows its Work behavior. |
| Failed Project showcase / Story media delivery | Keep affected Project/Story content, published caption and navigation usable; scoped Retry for failed selected media. Close only if an approved inspection is actually open (P17 where figure-to-Evidence applies); historical W43 lead/Evidence keeps its original Close. Never substitute media; an authorized poster remains static without video. |
| Missing actual recording/source | An existing valid authored/authorized poster can remain static only; omit Play and never manufacture playable video/source. Request owner repair/selection only if a dependent requested choice remains unresolved |
| Owner selected media pending or failed | Block publication until ready or explicitly removed and the saved candidate reviewed; retain input and current public snapshot; do not silently drop media or publish dependencies |
| Removed/nonpublic reference | Neutral unavailable state without leaking private identity/metadata; not equivalent to empty optional media |

- Check meaningful image alternatives and complex-figure explanations; use empty alternatives only for redundant linked visuals. Silent recordings need the equivalent state → action → transition → result description; meaningful audio needs captions/transcript and required visual description under accessibility §4. Keep meaning available without playback.
- Check visible keyboard/touch player controls and caption access, focus restoration, 320px/zoom reflow and narrow/medium/wide parity. Keep authentic media colors/proportions in both themes; owner-review any crop; expose full detail rather than forcing a thumbnail crop (ME06).
- Apply P16 separately to interface motion: owner/admin chrome remains motion-free; purposeful public motion follows the UI skill policy with an immediate reduced-motion equivalent. Reduced motion still permits explicitly requested project recording playback with its non-playback explanation; it never authorizes autoplay.
- Verify permission, personal contribution, proof limits and confirmed capture stage. Keep progress, release history, availability and capture stage distinct (ME04; publishing §2). Cancelled/never-shipped work remains eligible; Prototype/Local build/Production capture/Recreated local demo labels require confirmed facts. Never infer shipped from completed, production use from a recording, or outcomes from polished UI; omit unknown dates and dead live-demo actions.

## Owner ambiguity

Do not rank equally valid assets by aesthetics, newest file, first historical Evidence item or assumed featured Project. A valid authored public Project/Story media identity resolves its own canonical browse role without escalation; legacy Story discovery-cover only resolves historical Work browse/Experience choices. Escalate genuine conflicts, missing roles/sources or incompatible/insufficient authored choices, not a known delivery failure or confirmed absence. Confirmed no authored media resolves to complete text; never disguise an unresolved assignment as absence or substitute lead for an absent cover.
If a supplied authored candidate choice contradicts a canonical mapping, retain resolvable public fields but return `OWNER DECISION REQUIRED` for candidate repair; do not silently replace its selection or approve dependent candidate work.
Return the resolvable fields and the exact marker `OWNER DECISION REQUIRED` in the ambiguity field and each unresolved field. List actual candidate identities/purposes/stages or the conflicting spec paths/IDs, then ask the smallest precise question that resolves the choice. Wait before implementing or approving dependent work; continue independent work only. If content has not been supplied, identify the missing fact without inventing candidates or asserting no media.

## Compact output

Return one block per surface; include the rule citation within the relevant field and state whether checks are verified, missing or unverified. Do not claim runtime/accessibility validation from a written decision.
For historical W43 role regression checks only, use [synthetic fixture inputs](references/fixtures.json); their Story/Evidence/Experience record shapes remain deliberately historical. Current P19 mockup inputs follow [screen-scoped P18 fixtures](../../../docs/content-inventory.md#screen-scoped-visual-content-gates). Neither defines a schema, product rule, real media or implementation asset. Derive decisions from the current canonical specs, not fixture expectations.
For maintenance validation, run `python .agents/skills/media-role-selection/scripts/check_fixtures.py` from the repo root; pass `--decisions <json>` to check fresh fixture outputs. This checker is test-only, never a media selector or implementation authority.

```text
Surface: <surface and public/candidate/editor context>
Media role: <canonical role, none, or OWNER DECISION REQUIRED; authority>
Source identity: <verified Project-or-Story identity and published snapshot/private candidate revision; optional authored media/source/poster reference; W43 Evidence ID only where applicable; none or unresolved otherwise>
Presentation: <show/hide; image/static poster/approved inspection/player if applicable/text-only/logo-name; no invented gallery controls>
Playback: <not applicable/prohibited/explicit Play only; stop conditions>
Fallback: <absent, loading, failed and nonpublic-reference behavior as applicable>
Accessibility/truthfulness checks: <relevant requirements and verified/missing/unverified status>
Ambiguity / owner decision required: <none, or OWNER DECISION REQUIRED; candidates/conflicting rules/blocker; smallest precise question>
```
