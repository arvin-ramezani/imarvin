# High-level UX journey audit
Status: document/conversation audit; four proposals pending owner decision. NOT runtime, visual, accessibility or security verification.
Audited: 2026-10-15, Asia/Tehran | Starting PR: [#55](https://github.com/arvin-ramezani/imarvin/pull/55) at `85e2549cfa3cd4c1e10dd6f729a4bbd03c3e4acc`.
Authority: [checkpoint](ux-requirements-checkpoint.md), [decisions](decisions.md); the audit adds no accepted product rules.
Scope: visitor/owner high-level paths, including owner approvals after that head through 01:30; not component design or implementation.
Sources inspected: root AGENTS/README/PRD, decisions/checkpoint, public/relationship/Contact/owner-content checkpoints, owner UX, navigation/state, content/publishing, accessibility/responsive and specification plan.
The scoped checkpoints override overlapping legacy models. Retained legacy history is not a current feature requirement; reconciliation is deferred until discovery completion.

## Journey coverage — J01–J12
Covered = a high-level path is defined by current scoped authority, not proof that implementation works or every detail is approved.
| ID | Journey | Product-level result / gap | Authority |
| --- | --- | --- | --- |
| J01 | Enter Home → explore featured Project | Combined identity/feature and relative section order defined; missing feature policy open, JG01 | Public UXH01–UXH08 |
| J02 | Browse Projects/Stories → label → Load more → detail → return | One filter first, pins then latest; restore filter/loaded items/order/scroll | Public UXN01–UXN06 |
| J03 | Open Project → related Stories | Complete UI/CLI/backend overview; optional links/media; only published Stories, hide empty section | Public UXC01–UXC07 |
| J04 | Open standalone/private-parent/public-parent Story → continue | Designed concise flexible explanation; privacy-safe optional Project link; no automatic recommendations | Public UXC03/UXC05/UXC06/UXC08/UXC09; PS01–PS05 |
| J05 | Home About/offerings/Experience → dedicated About/Contact | Home anchors and direct dedicated-page navigation; credibility without duplicate About CV/company/service pages | Public UXH06–UXH08/UXN02–UXN03 |
| J06 | Contact → direct channel OR form → confirmation/retry → follow-up | Telegram preferred; agreed fields; acceptance confirmation in place; email inbox handling; privacy note/page | Contact CT01–CT12 |
| J07 | Owner sign in → edit → leave/sign out/session/conflict recovery | Single owner/private input/preview; established P12 recovery applies without automatic public edits | PRD R12/R18/R19; compatible owner UX P12 |
| J08 | Create Project/Story → save privately → preview → Publish/Update | Publishing minima and separate public snapshot; incomplete drafts/private parent supported | Public UXD06–UXD07; PS01–PS05/PS11–PS12 |
| J09 | Pin or curate Home → Apply/Discard → leave/retry | Two management views/separate editors; Apply arrangements only; republish pin lifecycle open, JG03 | Public UXN05; OWN01–OWN05 |
| J10 | Change Home selection → apply → unpublish/delete | Live manual selection blocks direct/indirect removal until successful Apply; automatic latest refills | PS08–PS10; OWN05 |
| J11 | Project publish/unpublish/delete → selected/all/retained Stories | Scope choices/no Ready flag/permanent-delete semantics defined; bulk failure outcome open, JG02 | PS06–PS08 |
| J12 | Maintain Experience/settings/labels → public presentation | Management areas/explicit private edits defined; label rename/removal outcome open, JG04 | OWN01/OWN03; public UXN04; compatible P02/P12 |

## Four remaining product decisions — JG01–JG04
Recommendations below are PROPOSED, not approved; they must not silently override canonical contracts.
| ID | Unresolved choice | Recommendation | Observable consequence if approved |
| --- | --- | --- | --- |
| JG01 | Home when no feature is selected, including initial/empty content | Keep Home available with identity and remaining published sections; omit absent work areas/actions, preserve relative order; no automatic featured replacement | Empty feature/zero work does not block Contact/About or expose drafts; no fabricated filler |
| JG02 | A confirmed Project bulk action fails midway | Complete the chosen record/publication operation together or leave entries unchanged; preserve selection/input and report affected scope for retry | Project + selected Story publication cannot report partial success; keep/delete/unpublish choice affects only confirmed scope |
| JG03 | Pin priority after unpublish → republish | Keep saved pin state/old priority while hidden; republish restores that priority, not a new pin time | Private entries stay absent; manual repin alone raises priority; first-publication date/Home curation unchanged |
| JG04 | Correct/remove owner-created reusable labels | Allow rename and removal; remove a label's associations without deleting Projects/Stories; shared rename affects uses deliberately | No content loss or implicit publication of unfinished entry text; references/filters handled by later bounded contract |

JG01 does not approve a new hero composition. JG02 does not select a schema/transaction or erase unknown-outcome handling; selected private Stories alone are checked, never every unpublished Story. JG03 does not approve a tie-breaker or timestamp mechanism. JG04 does not prescribe a taxonomy page, editor layout or immediate public mutation.

## Not additional high-level approval questions
- Routine states: retain input/retry, no dead actions/filler, usable empty/error navigation, keyboard/mobile equivalents, no autoplay. Preserve current defaults; detail them at the proper design/spec stage.
- Component phase: Project/Story hierarchy realization, fields/editor/media arrangement, navigation labels/active/mobile layout, gallery/player composition, Home no-feature appearance and Privacy placement/copy presentation.
- Bounded implementation specs: exact limits/formats, publication units, persistence, stale revisions/unknown outcomes, deterministic sorting ties, delivery durability/idempotency/spam, privacy retention/providers, media sharing/cleanup and cache behavior.
- Compatibility: old work/company URLs and snapshots need migration/redirect/data-preservation rules before affected implementation; no deletion/redirect authorization here.
- Factual inputs: O01–O03 company/role/dates, truthful contribution/outcomes, actual Projects/Stories/destinations/permitted assets and Privacy handling. They gate real publication; fictional TEST ONLY visual fixtures remain P18.
- Verification: full legacy companion/skill/fixture/acceptance reconciliation after discovery, exact-revision visual approval, then bounded implementation and appropriate runtime checks. No screenshot was captured or user test run for this audit.

## Completion condition
Resolve JG01–JG04 or explicitly defer their product scope; then verify the updated journey map for consistency before declaring high-level discovery complete.
Component design must retain UXC05/UXC08 and P08: simple creation/implementation plus designed hierarchy, flexible Story contexts, no mandated rich-text/plain-paragraph/repeatable-group solution.
