# High-level UX journey audit
Status: document/conversation audit; four identified high-level gaps resolved by P24, detail hierarchy approved by P25. NOT runtime, visual, accessibility or security verification.
Audited: 2026-10-15, Asia/Tehran | Starting PR: [#55](https://github.com/arvin-ramezani/imarvin/pull/55) at `85e2549cfa3cd4c1e10dd6f729a4bbd03c3e4acc`.
Authority: [checkpoint](ux-requirements-checkpoint.md), [decisions](decisions.md); canonical scoped records own the later P24/P25 approvals; the audit is a coverage/closure index.
Scope: visitor/owner high-level paths, original audit through 01:30 plus recorded owner approvals through 02:22; not component design or implementation.
Sources inspected: root AGENTS/README/PRD, decisions/checkpoint, public/relationship/Contact/owner-content checkpoints, owner UX, navigation/state, content/publishing, accessibility/responsive and specification plan.
The scoped checkpoints override overlapping legacy models. Retained legacy history is not a current feature requirement; reconciliation is deferred until discovery completion.

## Journey coverage — J01–J12
Covered = a high-level path is defined by current scoped authority, not proof that implementation works or every detail is approved.
| ID | Journey | Product-level result / gap | Authority |
| --- | --- | --- | --- |
| J01 | Enter Home → explore featured Project | Combined identity/feature and relative section order defined; no-feature policy resolved by UXH09 | Public UXH01–UXH08 |
| J02 | Browse Projects/Stories → label → Load more → detail → return | One filter first, pins then latest; restore filter/loaded items/order/scroll | Public UXN01–UXN06 |
| J03 | Open Project → related Stories | Complete UI/CLI/backend overview; optional links/media; only published Stories, hide empty section | Public UXC01–UXC07 |
| J04 | Open standalone/private-parent/public-parent Story → continue | Designed concise flexible explanation; privacy-safe optional Project link; no automatic recommendations | Public UXC03/UXC05/UXC06/UXC08/UXC09; PS01–PS05 |
| J05 | Home About/offerings/Experience → dedicated About/Contact | Home anchors and direct dedicated-page navigation; credibility without duplicate About CV/company/service pages | Public UXH06–UXH08/UXN02–UXN03 |
| J06 | Contact → direct channel OR form → confirmation/retry → follow-up | Telegram preferred; agreed fields; acceptance confirmation in place; email inbox handling; privacy note/page | Contact CT01–CT12 |
| J07 | Owner sign in → edit → leave/sign out/session/conflict recovery | Single owner/private input/preview; established P12 recovery applies without automatic public edits | PRD R12/R18/R19; compatible owner UX P12 |
| J08 | Create Project/Story → save privately → preview → Publish/Update | Publishing minima and separate public snapshot; incomplete drafts/private parent supported | Public UXD06–UXD07; PS01–PS05/PS11–PS12 |
| J09 | Pin or curate Home → Apply/Discard → leave/retry | Two management views/separate editors; Apply arrangements only; republish pin lifecycle resolved by UXN07 | Public UXN05; OWN01–OWN05 |
| J10 | Change Home selection → apply → unpublish/delete | Live manual selection blocks direct/indirect removal until successful Apply; automatic latest refills | PS08–PS10; OWN05 |
| J11 | Project publish/unpublish/delete → selected/all/retained Stories | Scope choices/no Ready flag/permanent-delete semantics defined; confirmed bulk failure outcome resolved by PS13 | PS06–PS08 |
| J12 | Maintain Experience/settings/labels → public presentation | Management areas/explicit private edits defined; label rename/removal outcome resolved by OWN06 | OWN01/OWN03; public UXN04; compatible P02/P12 |

## Four audited decisions — RESOLVED JG01–JG04
The proposal history is retained by these IDs; canonical records below own final requirements. All times are 2026-10-15 Asia/Tehran.
| ID | Audited choice | Owner-approved resolution | Authority / approval |
| --- | --- | --- | --- |
| JG01 | Home without a configured feature | Keep identity/available sections, omit feature area/action; no automatic replacement | Public UXH09; 01:47 |
| JG02 | Confirmed Project bulk action failure | Chosen scope succeeds together or affected entries stay unchanged; retain pending input/selection; reconcile unknown outcomes | Relationship PS13; 01:49 |
| JG03 | Pin priority after unpublish → republish | Preserve saved pin state/old priority while private; republish restores it; repin deliberately raises priority | Public UXN07; 02:03 |
| JG04 | Correct/remove reusable labels | Rename existing uses; delete label/associations while preserving every Project/Story | Owner content OWN06; 02:04 |

P25 separately approves Project/Story detail information hierarchy (public UXD01–UXD02) at 02:21/02:22. These approvals do not choose a hero/editor/group layout, schema/transaction, file cascade, sort tie-breaker or taxonomy-management page.

## Not additional high-level approval questions
- Routine states: retain input/retry, no dead actions/filler, usable empty/error navigation, keyboard/mobile equivalents, no autoplay. Preserve current defaults; detail them at the proper design/spec stage.
- Component phase: Project/Story hierarchy realization, fields/editor/media arrangement, navigation labels/active/mobile layout, gallery/player composition, Home no-feature appearance and Privacy placement/copy presentation.
- Bounded implementation specs: exact limits/formats, publication units, persistence, stale revisions/unknown outcomes, deterministic sorting ties, delivery durability/idempotency/spam, privacy retention/providers, media sharing/cleanup and cache behavior.
- Compatibility: old work/company URLs and snapshots need migration/redirect/data-preservation rules before affected implementation; no deletion/redirect authorization here.
- Factual inputs: O01–O03 company/role/dates, truthful contribution/outcomes, actual Projects/Stories/destinations/permitted assets and Privacy handling. They gate real publication; fictional TEST ONLY visual fixtures remain P18.
- Verification: full legacy companion/skill/fixture/acceptance reconciliation after discovery, exact-revision visual approval, then bounded implementation and appropriate runtime checks. No screenshot was captured or user test run for this audit.

## Completion condition
JG01–JG04 are resolved and their current journey references aligned. The reviewed high-level checkpoint is closed within this audit's scope; full UX/visual/runtime approval is not claimed. Complete the previously deferred legacy companion/skill/fixture/acceptance reconciliation before affected design/implementation.
Component design must retain UXC05/UXC08 and P08: simple creation/implementation plus designed hierarchy, flexible Story contexts, no mandated rich-text/plain-paragraph/repeatable-group solution.
