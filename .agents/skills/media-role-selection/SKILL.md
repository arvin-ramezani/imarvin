---
name: media-role-selection
description: Resolve ambiguous image, video, poster, Evidence identity, or no-media choices for imarvin UI using canonical repository specifications and existing authored content. Mandatory for agents implementing, designing, or reviewing public UI or related owner editor/preview/review when a media choice is not explicit. Skip unrelated UI with no media concern. Return a compact decision and OWNER DECISION REQUIRED when canonical rules cannot resolve valid alternatives or conflict. Never generate, acquire, or invent project media.
---

# Media Role Selection

## Authority and boundaries

Resolve a media decision only; do not create/edit assets, generate posters, search for substitute imagery, change authored selections, or implement UI through this skill.
Locate the imarvin repository root. Read current [agent rules](../../../AGENTS.md), [decisions](../../../docs/decisions.md) and [media/evidence](../../../docs/specs/media-evidence-spec.md), then the relevant companions below. Inspect the supplied surface and existing authored Story/Evidence records or fixtures; do not infer assets from filenames, screenshots in prior reviews, or implementation placeholders.

| Authority | Read for |
| --- | --- |
| [Public UX](../../../docs/specs/public-ux-spec.md) | Surface purpose, discovery, story and Experience presentation |
| [Components/interactions](../../../docs/specs/components-interaction-spec.md) | Component roles, controls and visible states |
| [Owner UX](../../../docs/specs/owner-ux-spec.md) | Authoring, exact saved preview candidate and publication review |
| [Accessibility/responsive](../../../docs/specs/accessibility-responsive-spec.md) | Alternatives, playback, reduced motion, keyboard/touch and reflow |
| [Visual system](../../../docs/specs/visual-system-spec.md) | Signal Studio composition, authentic colors/proportions and theme parity |
| [Content/publishing](../../../docs/specs/content-publishing-spec.md) | Snapshot identity, authorization, orthogonal project facts and reference lifecycle |
| [Navigation/state](../../../docs/specs/navigation-state-spec.md) | Inspection, deep links, focus/return and unavailable states |
| [UI skill policy](../../../docs/engineering/ui-skill-policy.md) | P16 motion boundary and companion skill routing |

Apply explicit owner instructions and confirmed decisions before proposals, with each document authoritative in its own scope. Canonical repo specs always override this skill's routing index and examples. Cite paths and stable IDs/sections supporting the decision. Surface genuine conflicts; do not silently rewrite authority.
Preserve proposed/pending status: P15 media layouts require later validation and bounded implementation authority. A selection decision does not approve assets, layouts, schema, dependencies or application code. Treat the roles below as design responsibilities, not new database fields/enums.

## Decision procedure

1. Identify the surface, visitor task and context: public snapshot, private saved candidate, or editor session. Determine whether a visual helps recognition, understanding or inspection (ME01–ME03); do not require media for completeness.
2. Resolve its role from the current placement map and companion contract. Check an existing explicit assignment first. Distinguish discovery cover from lead; they may differ. Do not substitute either for the other without an authored selection or applicable rule.
3. Trace the assignment to its existing Story identity, snapshot/candidate revision, Evidence identity, and source/poster/rendition as available. Public surfaces use only currently published authorized references; preview uses the exact saved candidate with published dependencies. Reuse references, never independent editable copies. Record actual identifiers or verified record locations; never fabricate IDs or schema support.
4. Check source readiness, permission, capture stage and required alternatives. Distinguish confirmed absence, a failed selected item, and content/identity that has not been supplied or cannot be inspected. Inaccessible or unknown content is not proof of no authored media.
5. Choose image, static video poster, explicit inline inspection/player, text/link Evidence, logo/name, or complete text-only presentation under the role rules below. An existing poster must depict the actual recording or identified same-build/state screenshot (ME07); never promise a missing video or generate a poster.
6. Specify playback, loading/failure/absence behavior and accessibility/truthfulness checks. If valid candidates remain equally suitable, a required assignment/fact is missing, or authorities conflict, stop the dependent choice and ask the owner as described below.

## Role routing

Use this index to locate the canonical rule, not to override later repository changes (media/evidence §2, ME05–ME08; public UX §§2–5). Keep discovery cover, lead media, contextual figure, Evidence item and company logo roles distinct. A video poster is a static representation of an Evidence item, not an actual playable recording or a separate editable copy; distinguish both from a no-media state.

| Surface | Media role and source | Presentation / playback |
| --- | --- | --- |
| Home featured work | Featured Story's published discovery cover | Existing image/static recording poster; Open work navigates; no player/autoplay |
| Work browse, related work, Experience project choice | Same referenced Story's published discovery cover | Static image/poster; ordinary Story action; no player/autoplay, separate invented thumbnail or hover playback |
| Story detail, embedded Experience main story | Story's published lead Evidence selection | Lead image or poster with explicit inline Play where supported; do not assume cover equals lead |
| Problem/Decision figure | Authored contextual reference to that Story's Evidence identity | Relevant figure beside explanation; inspect the same item in Evidence, without asset duplication |
| Evidence | Actual published ordered Evidence item | Image/diagram inspection, recording player, or text/link according to kind; ME05 |
| Company identity/header | Confirmed company logo/name | Logo with name fallback; never a project screenshot, company photo or project cover |
| Owner list/editor/preview/review | Existing candidate references, labelled public/candidate comparison where relevant | Compact identification/editing; exact saved preview composition; explicit content playback only; ME07 and owner UX |
| No authored media | No visual role/source | Complete text hierarchy/actions; no blank media slot, invented filler, or dead Play control |

For other surfaces, consult the placement map instead of extrapolating project media into personal context, contact, navigation, sign-in or share metadata. Preserve authored Evidence order and relationships; do not invent a feature, relation, crop or asset preference.

## Playback, fallback and checks

- Apply ME05: explicit user Play only; no load/scroll/hover/focus/deep-link/theme/resize/return playback, default loop or competing recordings. Stop playback/audio on close, hide, item change or leaving; retain the canonical focus/return behavior. Discovery remains static and does not preload all videos.
Keep these states separate under ME03/ME05/ME07–ME08, publishing §§3–6 and navigation/state §§4–5; loading stays local to selected media and retains known public caption/text/actions.

| Condition | Required decision / fallback |
| --- | --- |
| No authored media, confirmed | Complete text-only composition; omit empty slots/media controls; retain text Evidence where authored |
| Failed public media delivery | Retain selected published identity, caption/text and Story actions; scoped Retry/Close and existing authorized still/poster where permitted; no silent identity switch or currently playable claim |
| Missing video: no actual recording/source exists | A poster alone is not playable Evidence; omit Play, use only independently valid authored/authorized still/text, and request owner repair/selection if needed; never manufacture a recording/poster |
| Owner selected media pending or failed | Block publication until ready or explicitly removed and the saved candidate reviewed; retain input and current public snapshot; do not silently drop media or publish dependencies |
| Removed/nonpublic reference | Neutral unavailable state without leaking private identity/metadata; not equivalent to empty optional media |

- Check meaningful image alternatives and complex-figure explanations; use empty alternatives only for redundant linked visuals. Silent recordings need the equivalent state → action → transition → result description; meaningful audio needs captions/transcript and required visual description under accessibility §4. Keep meaning available without playback.
- Check visible keyboard/touch player controls and caption access, focus restoration, 320px/zoom reflow and narrow/medium/wide parity. Keep authentic media colors/proportions in both themes; owner-review any crop; expose full detail rather than forcing a thumbnail crop (ME06).
- Apply P16 separately to interface motion: owner/admin chrome remains motion-free; purposeful public motion follows the UI skill policy with an immediate reduced-motion equivalent. Reduced motion still permits explicitly requested project recording playback with its non-playback explanation; it never authorizes autoplay.
- Verify permission, personal contribution, proof limits and confirmed capture stage. Keep progress, release history, availability and capture stage distinct (ME04; publishing §2). Cancelled/never-shipped work remains eligible; Prototype/Local build/Production capture/Recreated local demo labels require confirmed facts. Never infer shipped from completed, production use from a recording, or outcomes from polished UI; omit unknown dates and dead live-demo actions.

## Owner ambiguity

Do not rank equally valid assets by aesthetics, newest file, first Evidence item or assumed featured project. Do not disguise an unresolved assignment as a no-media decision.
Return the resolvable fields and the exact marker `OWNER DECISION REQUIRED` in the ambiguity field and each unresolved field. List actual candidate identities/purposes/stages or the conflicting spec paths/IDs, then ask the smallest precise question that resolves the choice. Wait before implementing or approving dependent work; continue independent work only. If content has not been supplied, identify the missing fact without inventing candidates or asserting no media.

## Compact output

Return one block per surface; include the rule citation within the relevant field and state whether checks are verified, missing or unverified. Do not claim runtime/accessibility validation from a written decision.

```text
Surface: <surface and public/candidate/editor context>
Media role: <canonical role, none, or OWNER DECISION REQUIRED; authority>
Source identity: <existing Story/revision/Evidence/source/poster reference, none, or unresolved>
Presentation: <show/hide; image/static poster/inline inspection/player/text-only/logo-name>
Playback: <not applicable/prohibited/explicit Play only; stop conditions>
Fallback: <absent, loading, failed and nonpublic-reference behavior as applicable>
Accessibility/truthfulness checks: <relevant requirements and verified/missing/unverified status>
Ambiguity / owner decision required: <none, or OWNER DECISION REQUIRED; candidates/conflicting rules/blocker; smallest precise question>
```
