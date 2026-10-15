# Project Images, Video, and Evidence

Status: P19–P25 media ownership reconciled; P17 origin-aware focus approved for applicable figure-to-Evidence flows; W43 evidence historical, P15 detailed inspection proposed. Updated: 2026-10-15.
Authority: [UXC01–UXC09 / UXD01–UXD02](ux-public-checkpoint.md), [PS01–PS13](project-story-spec.md). Historical [W43](../implementation/43-work-p15-p16-media-motion-retrofit.md) applies only to Work media/Problem figures.
Authority: [PRD](../../PRD.md), [decisions](../decisions.md). Companions: [public UX](public-ux-spec.md), [owner UX](owner-ux-spec.md), [publishing](content-publishing-spec.md), [visual system](visual-system-spec.md), [accessibility](accessibility-responsive-spec.md).
Trace: R04, R06, R08–R09, R13–R19, R20–R26; A01–A12. Documentation only: no asset creation, application changes, or upload infrastructure approval.
Scope: [W43 bounded Work retrofit](../implementation/43-work-p15-p16-media-motion-retrofit.md) accepts Work Evidence/lead/cover/Problem figures but does not include a Decisions content model or approve full-product P15 compositions. New actual visual revisions need [VSRC owner approval](visual-source-workflow-spec.md).

## 1. Purpose and choice

ME01: use a real, permitted visual when it helps identify work, understand a decision, or inspect behavior. Imagery participates in Signal Studio's work stage; it is not decorative wallpaper or a requirement for every object.
ME02: use screenshots for appearance/state, diagrams for relationships, and recordings for transitions, animations, or a task sequence. A still cannot establish motion; a recording cannot establish production use, authorship, or customer impact.
ME03: text explains the contribution and evidence limits before playback. No-media work remains eligible for feature/browse and has complete hierarchy; missing assets never require fabricated substitutes.

| Evidence kind | Good use | Required explanation |
| --- | --- | --- |
| Screenshot or detail crop | Real page, component, validation state, responsive layout | What to notice; captured build/stage; meaningful limits |
| Screen recording | Actual transition, animation, or workflow in a runnable build | Starting state → action → result; stage; duration; silent/with audio |
| Design/prototype capture | An authored design or prototype when the implementation is absent | Label Design or Prototype; distinguish intended behavior from implemented behavior |
| Diagram or comparison | Architecture/decision or an authentic before/after | Meaning, version/context, Arvin's contribution; no invented baseline |
| Text record or public link | Decisions/tests/source when visuals add little | What it supports; permission and usable destination |

## 2. Placement map

| Surface | Optional visual and source role | Absence/interaction |
| --- | --- | --- |
| Home combined hero | Featured **Project's own** authored published cover/poster, not borrowed from linked private Stories | Explore Project; no autoplay; full identity/contribution without media |
| Projects browse | Project's own published discovery visual if authored | Opens Project; no dedicated browse-only asset, autoplay or forced cover |
| Stories browse | Story's **independent** published visual if authored | Opens Story; no automatic borrowing of Project cover or mandatory thumbnail |
| Project detail | Project's optional independent cover/showcase after contribution (P25) | Zero/one/many images/videos; omit entire visual area when absent |
| Story detail | Optional independently authored contextual figures/recordings within explanation | Zero/one/many; no mandatory Problem/Decisions/Evidence section or gallery |
| Project-related Stories | Published child Story previews, using that Story's visual only if authored | Hide entire section if none published; do not leak private child/parent details |
| Home Experience | Company **logo/name only** with optional published Project links | No dedicated company page, company-photo cover or main-product embed |
| About / Contact / Privacy | Optional truthful About portrait; otherwise no project imagery needed | No media-driven requirement or filler |
| Owner editor / preview | Independent Project/Story candidates; optional media rights/stages and public/candidate comparison | No mandatory old Work Evidence editor/cover-lead duplication |
| Public share metadata | Published Project/Story authorized still when available | Text-only metadata valid; no draft assets |

ME01–ME03 remain: use purposeful real permitted captures, distinguish still versus recording proof, and keep no-media content complete. [UXC03](ux-public-checkpoint.md) makes Project and Story media independent; sharing mechanics unresolved, and private Story assets must never be automatically borrowed. Historical W43 Story discovery-cover and company-choice projections are not current full-product requirements.

## 3. Truthful unshipped work

ME04: preserve real-world progress, release history, current availability and capture stage as distinct facts. P21 simplifies public Project progress to an optional **In progress / Completed / Cancelled** label with optional factual notes/live links; unknown facts stay omitted. Never infer Shipped/Online from Completed, Private from never launched, or impact from a polished screenshot.
Label true Design, Prototype, Local build, Production capture or Recreated local demo stage if known. Explain completed/unfinished contribution and proof limits; confirmed cancelled/never-released Projects remain eligible for publishing and featuring. Fictional examples are TEST ONLY and never real Unixsee evidence.

## 4. Inspection and playback

ME05: image enlargement and standard user-controlled video playback without autoplay are routine usability direction; **exact** gallery, detail zoom/return, poster behavior, player variants, placement and metadata controls are unapproved full-product design. Use accessible labelled Play/Pause/seek/captions as relevant, non-playback descriptions and no automatic start on load/hover/deep-link/theme/resize/return. No required media modal, carousel, second Play step, proprietary player or media-editing suite is inferred.
**ME05 / P17 accepted:** wherever a contextual figure opens Evidence, Close restores its originating section and focuses the figure or a safe visible heading if figure/section is unavailable; Evidence-origin/direct-entry Close stays in Evidence with valid focus. Never focus hidden triggers; stop playback/audio on close or hide as applicable. W43's original Work Problem/Decisions figure-to-Evidence IDs/tests are historical, not a mandatory P19 section/schema/gallery.
Unknown gallery/playback semantics remain for component/visual design and bounded technical specification; no owner image approval follows from these text rules.

## 5. Composition and delivery experience

ME06: keep original colors and proportions in both themes; never recolor/invert project evidence. Use a neutral frame only for separation. Titles, status, captions and controls live outside busy imagery on readable surfaces.
Use the asset's aspect ratio in detail and contain the complete capture. A 16:10 discovery frame is a starting proposal for wide UI screenshots, not a forced crop. Tall/mobile captures retain their shape; paired captures stack on narrow views in authored reading order.
Allow a discovery crop only after owner review preserves the subject and truthful context; the detail view exposes the full capture. Prefer a focused excerpt plus full inspection over shrinking a long page until text is illegible. Captions wrap and controls reflow at 320px/zoom.
Reserve media space from known dimensions while loading; use responsive image renditions and a lightweight video poster. Load lower evidence on demand; do not download every recording for home/browse or before Play. Keep text/actions usable on slow connections, with reduced data or failed media delivery.
Use only an app-authorized published asset for public renditions/posters/share images. Provider embeds are not baseline scope; an external host is a labelled ordinary link unless a later spec addresses accessibility, privacy and delivery. Exact byte/duration/dimension/codec limits and performance budgets belong to a bounded upload/delivery spec; [T04](../architecture/runtime-operations.md#2-filesystem-media--t04) remains unchanged.

Fallback/failure states are distinct:

| State | Canonical behavior |
| --- | --- |
| No authored media | Render the complete text composition with no filler, reserved empty slot, or dead Play control. |
| Failed discovery media delivery | Keep the Project or Story discovery entry usable/openable with its known text/status/context; never expose a broken replacement or silently substitute another asset. |
| Failed selected Project-showcase/Story-media delivery | Keep caption/explanation and surrounding content usable with scoped Retry; historical Work Evidence inspection also retains its Close action. |
| Missing actual recording/source | A poster can remain a static visual only; never expose Play or fabricate a recording/source that is not available. |
| Owner selected media pending/failed | Publication remains blocked until the item is Ready or explicitly removed from the candidate; preserve candidate input and the existing public state. See [owner UX](owner-ux-spec.md#3-structured-authoring) and [publishing](content-publishing-spec.md#4-publication-checks). |

## 6. Authoring and publication

ME07: independent optional Project cover/showcase and Story media are edited in their own private candidates; text-only publication is complete. Do not force a Story-owned cover/lead/Evidence identity or prescribed media editor on either new content type. Selected real media must have truthful source, permission, captions/alternatives and actual readiness; a failed selected upload needs explicit resolution before Publish/Update, not silent dropping.
A file upload never implicitly Saves, Applies Home arrangement or Publishes entry content. Preview exact saved candidate privately; compare affected current public and candidate content. Files/posters/renditions/tracks remain reference-safe/private until authorized published snapshot uses them; replacement never overwrites public bytes. Sharing/asset ownership/cleanup, upload/codec/size limits and exact mechanisms require separate specs. Keep historical W43 ME07/ME08 cover/lead/figure behavior only for its existing implemented Work slice.
ME08: [publishing](content-publishing-spec.md) and PS13 own publication scope, privacy and confirmed together-or-unchanged Project bulk outcomes; media files are **not** automatically cascaded on delete.

## 7. Verification boundary

| Check | Observable future acceptance | Acceptance |
| --- | --- | --- |
| MV01 · ME01–ME03 | Project cover and independent Story media only where authored; no media is equally complete | A01/A04/A12 |
| MV02 · ME02/ME04 | Unshipped Project's captured stage/contribution truthful; no launch inference | A04/A10 |
| MV03 · ME05 | Explicit playback/alternatives where applicable, P17 origin-aware Close/focus; W43 tests historical | A03/A08–A09/A11 |
| MV04 · ME06 | Wide/320px/zoom/Light/Dark preserve media ratios, caption/access and readability | A09/A12 |
| MV05 · ME07 | Optional independent Project/Story media Save/Preview/Update does not auto-publish | A05–A06/A09 |
| MV06 · ME08 | Draft media denied publicly; atomic authorized reference/publication changes | A06–A08 |
| MV07 · ME03/ME05 | Screenshot/recording content understandable without playback, appropriate captions | A04/A09–A10 |
| MV08 · ME06 | Failed/slow media leaves Project/Story links/text usable; scoped Retry | A08–A09 |

All MV checks are **unrun for revised P19 screens**; historical W43/#23 evidence is retained for its own slice only. New image/gallery/player revisions need [VSRC](visual-source-workflow-spec.md) exact-owner approval. O01–O03 gate real published assets, not P18 fixture design.
