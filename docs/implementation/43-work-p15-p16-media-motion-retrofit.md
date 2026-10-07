# Issue #43 — Work P15/P16 Media and Motion Retrofit

Status: implementation-ready planning contract | Issue: #43 | Parent: #42 | Roadmap: #13 | Base: `c94bf2857a4308d23a61bf3c98532d7232fd748d`
Authority: [AGENTS](../../AGENTS.md), [PRD](../../PRD.md), [decisions](../decisions.md) P02/P08/P09/P11/P13–P16/T02/T04, [media](../specs/media-evidence-spec.md), [publishing](../specs/content-publishing-spec.md), [owner UX](../specs/owner-ux-spec.md), [public UX](../specs/public-ux-spec.md), [accessibility](../specs/accessibility-responsive-spec.md), [runtime](../architecture/runtime-operations.md), [#23](23-work-story-summary.md).

## 1. Current-state baseline

- #23 has `Story` as the private UUID working copy and one-to-one `PublishedStory` as the public text snapshot; `workingRevision`, public `revision`, and `sourceWorkingRevision` guard Save/Publish/Update. No media/depth schema exists.
- Owner routes `/studio/work`, `/new`, `/{storyId}/edit`, `/preview`, `/publish` re-authorize reads/writes; Save stays private, Preview reads the exact saved candidate, and Publish/Update uses a Serializable revision-checked transaction.
- `/work` and `/work/[storyId]` read `PublishedStory` only. Current rendering is title/problem/contribution/progress/outcome/stack; neutral unavailable and text-only empty states already exist.
- Tests cover private/public isolation, concurrent Save/Publish, stale public revisions, editor error focus/retained input, full Save→Preview→Publish→private edit→Update, 320px/keyboard, theme, and long-text reflow.
- Gap W43-B0: P15 roles/assets/readiness/delivery/Evidence and P16 public motion are absent; #23 evidence cannot satisfy MV01–MV08. Owner UI must remain motion-free.

## 2. Media data and identity

| ID | Contract |
| --- | --- |
| W43-D1 | `Evidence` is a stable UUID child of `Story`: kind `IMAGE | RECORDING | DIAGRAM | TEXT_LINK`, authored order, title/caption, confirmed capture stage when supplied, permission confirmation, accessibility text, and source references. `TEXT_LINK` stores text plus optional validated `https:` URL and no binary. |
| W43-D2 | `MediaAsset` is a stable UUID owned by one saved Story, with opaque storage key, media type, byte size/type, dimensions/duration when known, readiness `PENDING | READY | FAILED`, and immutable bytes once Ready. Binary upload is unavailable until the new Story has first been saved privately. |
| W43-D3 | Image/diagram Evidence references one Ready image source. Recording Evidence references a Ready video source plus an explicit Ready image poster for publication; optional WebVTT caption-track asset and transcript/equivalent description follow accessibility rules. Poster is a representation of that recording, not separate Evidence. |
| W43-D4 | `Story.discoveryCoverEvidenceId` and `leadEvidenceId` are nullable same-Story Evidence refs; cover/lead accept IMAGE or RECORDING-with-poster only and may differ. Current #23 Problem contextual figures use the same Evidence identities via ordered problem-figure refs; do not create media copies or a Decision model. |
| W43-D5 | `PublishedEvidence` snapshots Evidence metadata/order/asset refs by the same Evidence identity; `PublishedStory` snapshots cover/lead refs. Public reads never join editable Evidence metadata. Future Decision figures must reference Evidence identity rather than duplicate media. |
| W43-D6 | Draft validation allows incomplete media. Publication requires every selected/referenced asset Ready, permission/capture facts required by its content, role-valid refs, and required alternatives/captions/descriptions. `Selected/Uploading` are UI states over PENDING; no Processing state exists without a real processor. |
| W43-D7 | Upload/readiness alone does not increment `workingRevision`; saving Evidence metadata/order/roles/figures does. Save validates asset ownership and current revision. Publish rechecks candidate/public revisions plus current role/reference/readiness inside the existing Serializable publication transaction. |
| W43-D8 | Migration adds nullable refs/new child tables only: existing Story/PublishedStory rows backfill to no Evidence/no cover/no lead and remain valid text-only publications; create no placeholder media. |
| W43-D9 | Removing Evidence from a candidate first identifies cover/lead/figure uses and requires clearing them in the same saved candidate. Ready replacement always creates a new asset identity. Bytes/rows are cleanup-eligible only after zero working, published, poster/track/rendition references. |

No Experience associations, company media fields, unrelated taxonomy, Decision content model, structured release/availability expansion, or duplicate editable media records are added here; unknown shipped/live facts remain omitted rather than inferred.

## 3. Upload, storage, and delivery trust boundary

- W43-S1: every upload/private read/retry/removal action re-runs owner authorization and verifies the target saved Story. Public delivery authorizes only a MediaAsset reachable from the current `PublishedStory`/`PublishedEvidence` graph; nonexistent/private/removed IDs return the same neutral 404 with no metadata leak.
- W43-S2: configure server-only `MEDIA_STORAGE_ROOT`; dev/test set an isolated writable root, production uses a durable root outside deploy and `public/` (default operational target `/var/lib/imarvin/uploads`). Original filenames are display metadata only; storage paths use generated opaque keys, `path.resolve` containment checks, and never user path fragments.
- W43-S3: per file limit remains 10 MiB. Allow JPEG/PNG/WebP images, MP4/WebM recordings, and UTF-8 WebVTT tracks only; extension + declared type must match and content/signature is checked where practical. Reject SVG/HTML, executable/unknown types, traversal names, multiple-file smuggling, and over-limit input before public use.
- W43-S4: authenticated upload creates PENDING metadata/key, writes under `<root>/.staging` with exclusive temporary name, validates, atomically renames into the opaque final path, then marks Ready. Failed/interrupted work becomes FAILED/not served; stale PENDING/staging files and unreferenced uploads older than 24h are reconciliation candidates after a fresh reference check.
- W43-S5: retry may reuse a not-Ready asset identity; a Ready asset is never overwritten. Candidate replacement points to a new asset. Failed physical cleanup leaves an inaccessible unreferenced row/file for later retry; it must never restore public authorization.
- W43-S6: private/preview responses use `Cache-Control: private, no-store`. Public media uses `Cache-Control: public, max-age=0, must-revalidate` (never `immutable`/positive shared TTL without revocation support), safe server-generated `Content-Disposition: inline`, exact allowlisted `Content-Type`, `X-Content-Type-Options: nosniff`, and single-range/206 support for recording seek; invalid ranges return 416.
- W43-S7: source is authoritative. Poster/track refs belong to one recording Evidence; any future rendition is derivative of one source and inherits its authorization/reference lifecycle, never independent Evidence. This retrofit does not add transcoding, automatic posters, rendition generation, object storage/CDN, resumable uploads, media editing/cropping, or public uploads.

## 4. Publication semantics

- W43-P1: preserve `Save → Preview → Publish / Update`: Save persists only the private working candidate; Preview resolves that exact saved Evidence/cover/lead/figures through owner-authorized delivery.
- W43-P2: pending/failed selected media or invalid/missing selected refs block publication until Ready or explicitly removed and saved; do not silently omit it.
- W43-P3: successful Publish/Update atomically replaces `PublishedStory` plus ordered `PublishedEvidence` and role/figure refs, then revalidates `/work` and `/work/[storyId]`; all Work projections resolve the same published discovery/lead identities.
- W43-P4: confirmed validation/conflict/storage/database failure leaves the prior public snapshot/asset authorization intact and retains the candidate. Outcome-unknown follows the existing contract: inspect current working/public revisions before success/failure/retry; never claim rollback without evidence.
- W43-P5: public HTML, metadata, counts, URLs, delivery responses and caches expose current published refs only. Removing/unpublishing a public media ref revokes its public delivery on the next revalidated request; draft replacements remain owner-only.

## 5. Owner Work workflow

- W43-O1: Evidence editing stays inside the Story editor, not a gallery dashboard: Add Image/Recording/Diagram/Text-link; upload/select source/poster/track; edit caption/stage/permission/alternatives; Move up/down; choose cover/lead; add/remove Problem figure refs; remove candidate Evidence with affected-role warning.
- W43-O2: normal file picker is required; drag is optional. All controls work by keyboard/touch with visible focus and position announcements. Failed upload/retry/save keeps authored text, successful assets, and other fields; an expired unsaved binary may require reselection without losing saved content.
- W43-O3: owner list uses compact media identification only. Private Preview renders the saved candidate with private media URLs and persistent label. Publication review compares candidate/public additions, replacements/removals, caption/stage/alternative/order/cover/lead/figure changes and affected `/work` projections.
- W43-O4: P16 is absolute on sign-in/`/studio/**`/private preview/publication review: no CSS/JS transitions, animated hover/press/focus, enter/exit/layout motion, spinner/shimmer, or animated responsive change. Explicit project recording playback is content and never autoplays.

## 6. Public `/work`

- W43-W1: `$media-role-selection` resolves Browse to the Story's published discovery-cover projection only: IMAGE or static RECORDING poster; no Browse-owned thumbnail, player, autoplay, hover playback, or lead substitution.
- W43-W2: no authored cover renders the complete existing text composition with no reserved slot. Failed discovery delivery retains title/status/problem and Open story action, with no silent asset substitution or broken-image chrome.

## 7. Public `/work/[storyId]`

- W43-T1: keep the #23 summary/return; place optional published lead IMAGE or RECORDING poster after title/contribution/status and before depth. Play appears only for an actual published recording source and starts only by explicit activation.
- W43-T2: ordered Evidence renders as the one added depth section (there is no Decision model in this retrofit). Image/diagram opens contained inspection; recording uses poster then explicit player; TEXT_LINK shows authored text/link. One inspection is active; Close restores its trigger.
- W43-T3: Problem contextual figures reference the same published Evidence identity and inspection; essential explanation remains text. Failed lead/Evidence keeps caption/context and offers scoped Retry plus Close when open. A poster with missing recording source remains static with no fabricated Play.
- W43-T4: no-media means summary-only/text Evidence as authored, without filler/dead controls. Cancelled status never implies shipped/failed; capture-stage labels come only from confirmed Evidence; absent release/live facts remain unclaimed. Never present prototype/local/recreated media as production proof.

## 8. Accessibility, responsive, and performance

- W43-A1: 320px, 200% text, 400%-to-320 reflow, keyboard/touch, visible focus, logical order and no page-level horizontal overflow are required. Media retains original aspect ratio/colors in Light/Dark; detailed inspection contains the full capture.
- W43-A2: meaningful images need alternatives; complex diagrams/screenshots need nearby readable explanation. Silent recordings need state→action→transition→result equivalent description; meaningful audio needs synchronized captions, transcript and required visual description. Playback controls remain visible/keyboard/touch operable.
- W43-A3: reserve known media dimensions; discovery never preloads recording sources; lower Evidence loads lazily/on demand and recording source loads only after Play. Media loading/failure stays scoped and never blocks summary/return/actions.

## 9. Public motion under P16

| ID / surface | Purpose and behavior | Narrow / medium / wide | Reduced motion / implementation |
| --- | --- | --- | --- |
| W43-M1 `/work/[storyId]` Evidence inspection reveal | Connect an explicit Evidence/figure selection to the newly revealed inline inspection: `opacity 0→1` plus max `4px` block-axis travel, 140ms ease-out; semantic content/focus are available immediately. Close/switch is immediate. | Same behavior at all widths; never hover-triggered. | Immediate appearance, zero travel/transition under `prefers-reduced-motion`; CSS `@starting-style`/transition only, graceful immediate fallback. |
| W43-M2 all other Work UI | No interface motion: Browse hover/focus/state, route navigation, lead load/failure, Retry, player chrome state and responsive rearrangement change immediately. Project video playback is content. | Same rule at all widths/input modes. | Already equivalent; no animation path. |

CSS is sufficient. **Framer Motion is not required and must not be added by this retrofit.** If later motion needs springs/layout/exit/gesture behavior, it needs separate bounded authority.

## 10. Tests and runtime acceptance

- W43-V1: Vitest unit tests cover media/ref validation, eligibility/readiness, safe URL/path/range helpers and fallback decisions; RTL covers owner labels/errors, retained input, reorder/role controls, focus return and motion-free states where observable.
- W43-V2: PostgreSQL integration uses explicit `.env.test`, `NODE_ENV=test`, the dedicated guarded `imarvin_test` database, real migrations, and a unique temporary `MEDIA_STORAGE_ROOT`; reset before each mutating scenario, seed only deterministic scenario data, clean temp roots, and serialize DB mutation unless each worker gets an isolated database.
- W43-V3: integration covers owner authorization, private/public delivery, traversal/type/size rejection, interrupted write/retry/cleanup, range delivery, reference-safe replacement/removal, pending/failed publication blocks, atomic media publish/update, stale revision/concurrency/failure, metadata/cache privacy, and no-media migration/backfill.
- W43-V4: focused Playwright covers upload→Save→exact Preview→Publish/Update; Browse static cover/no-media/failed-discovery; detail lead/Evidence/missing-recording/failure Retry+Close; explicit playback/stop/focus; reduced-motion W43-M1; 320px/zoom/theme. Use temporary synthetic test media/content only and never treat fabricated real-world claims as publication evidence.
- W43-V5: local runtime acceptance for implementation children uses temporary real image/video/VTT files and verifies browser playback/range, filesystem cleanup and public/private denial on the exact SHA; no production/VPS acceptance is implied.

## 11. Implementation decomposition

This does **not** fit one focused PR: it combines migration/data integrity, an upload/delivery trust boundary, deliberate publishing, meaningful owner UI, and public media/motion. Command Center should create these 3 children under #42 only after this spec passes review.

| Order | Proposed child / purpose | Exact acceptance boundary | Required gates |
| --- | --- | --- | --- |
| 1 | Media persistence + secure delivery foundation | Schema/migration/backfill; MediaAsset/Evidence snapshot/ref rules; owner upload/private read/public delivery; readiness/reconciliation; repository/security/integration tests. No Work UI retrofit. | Deterministic, Security Review, Independent Review, local runtime; Design QA N/R |
| 2 | Owner Work media + atomic publication | Story media editor, Save/Preview/review, reorder/cover/lead/Problem figures, publication blocking/snapshot/replacement/removal and retained failure/conflict state; owner UI remains motion-free. | Deterministic, Security Review, Design QA, Independent Review, local runtime |
| 3 | Public Work media + P16 CSS motion | `/work` discovery projection and fallbacks; detail lead/Evidence/inspection/playback/accessibility/performance; W43-M1 only; focused browser acceptance. | Deterministic, Security Review, `$animate`/`$review-animations`, Design QA, Independent Review, local runtime |

#43 itself is documentation-only: deterministic documentation verification, Security Review and Independent Review are required; Design QA/runtime acceptance are not required.
