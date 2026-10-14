# Navigation and State Specification

Status: reconciled P19–P25 public destinations/return; route encoding and old-URL migration open. Updated: 2026-10-15.
Current authority: [UXN01–UXN07](ux-public-checkpoint.md), [Contact](contact-ux-checkpoint.md) and [relationship](project-story-spec.md). P17 is scoped to historical Work Evidence behavior.
Depends on [public UX](public-ux-spec.md), [PRD](../../PRD.md), [decisions](../decisions.md). Trace: R07, R11, R19–R25; A03–A04, A07–A09, A11.
URL shapes below are conceptual contracts; routing implementation and storage are deferred to architecture. Public delivery uses published content only; this document does not approve P02's authoring lifecycle.

## 1. Public destinations

| Destination | Public content / independent entry |
| --- | --- |
| Home | Combined identity and featured Project when configured, available sections and Home anchors |
| Projects / Project detail | Separate published collection and Project overview, published related Stories |
| Stories / Story detail | Separate published collection and independent public Story; optional public parent |
| About | Dedicated personal context; Home About preview links here |
| Contact | Dedicated form/direct channels; Home invitation links here |
| Privacy | Simple page linked from Contact form |

Header section anchors scroll **on Home only**; header Projects/Stories/About/Contact on dedicated pages navigate directly (UXN02–UXN03). Logo/name returns to Home top. Route names and parameters are not approved here; historical `/work` and `/experience` paths need separate migration/redirect review before change. Stable public item identity survives title edits and is independent of prior browser navigation.

## 2. State vocabulary

| State | Contract |
| --- | --- |
| Destination + item | Stable published Project/Story identity, independently shareable |
| Collection filter/order | One optional published label; filter first then shared pinned (last pinned first), then unpinned first-publication latest |
| Load more / origin | Restore loaded subset, filter, order, invoking item, scroll and valid focus after detail |
| Relationship | Public Story exposes Project only while parent is public; private parent never leaks |
| Media inspection | Optional content-controlled presentation; no autoplay on deep link/theme/resize |

History persistence, tie-breakers and exact route encoding are implementation contracts, not chosen here.

## 3. Transition contracts

| Trigger | Result and recovery |
| --- | --- |
| Home section link or other header link | Scroll within Home; otherwise navigate directly to dedicated destination, focus relevant heading |
| Filter/clear label | Keep focus, announce count, recalculate **matching** pinned-first/latest order, clear returns All |
| Load more → open Project/Story | Preserve filter/order/loaded subset/scroll; Back/Return restores invoking item or safe heading |
| Project → published linked Story | Separate Story destination; Back restores Project position |
| Browser Back/Forward / Return | Restore valid origin without duplicate history; direct entry falls back to safe collection or Home |
| Submit Contact | Stay on Contact with sending, accepted confirmation or retained input/Retry; direct channels remain usable |
| Inspect/play actual media | Explicit user control only; leaving/hiding stops audio; no unnecessary Back steps |

No automatic Story suggestions, company detail destination or mandated Story section selector. Historical W43 section/evidence selection retains its **own** replace-history and P17 figure-origin Close/focus contract.

## 4. Share and invalid locations

Nonexistent/private/deleted item locations share a neutral unavailable response; never disclose private names, parent IDs, assets or counts. Invalid/removed label resets to All with explanation. Missing published parent on a public Story omits parent metadata, not the Story. Shared links never require stored filter/origin or client-only private data. Old company/Work URLs require explicit preservation/migration rules; no redirect assumed. Private preview is authorized separately.

## 5. Loading, empty, failure, and absence

| Condition | Visible state / next action |
| --- | --- |
| No Home feature configured | Keep identity/available sections, omit feature CTA; no automatic replacement (UXH09) |
| Empty collection or label results | Honest empty/zero count, All reset, Home and Contact access |
| Network request failed/stale | Scoped Retry, preserve selected filter/origin, ignore late obsolete result |
| Optional media/link absent or failed | Keep complete text/detail/action; omit dead controls, scoped Retry for failed selected media |
| Item becomes nonpublic | Neutral unavailable content, no leaked titles/assets/metadata |
| Contact pending/failed/accepted | In-place status, preserved input on confirmed failure, safe accepted confirmation only |

For the **historical Work implementation**, P17 figure-opened Evidence Close restores Problem/Decisions source figure or safe visible heading; Evidence-origin/direct Close stays in Evidence with valid focus. Selection changes replace history, stop playback when leaving; this rule does **not** require Problem/Decisions/Evidence sections in P19 Stories. No forced gallery/player components or autoplay.

## 6. Public privacy contract

Only approved published fields/assets may appear in public rendering, shared metadata, indexing, navigation, filters, or error responses. Draft-only items do not create collection counts or choices.
Owner preview is a separate private path, not a public section/state. Authorization, asset delivery, cache invalidation, and index removal belong to later architecture/publishing specifications; privacy is not proven here.

## 7. Review scenarios

| ID | Action | Expected result |
| --- | --- | --- |
| NS01 | Filter/Load more → detail → Back | Restore label, pin order, loaded items, position and item |
| NS02 | Deep link to public Story with private parent | Story available with no private parent metadata; safe Return |
| NS03 | Project → published Story → Back/Forward | Correct separate destinations and preserved Project origin |
| NS04 | Stale label/nonpublic Project/Story link | Neutral published-only fallback |
| NS05 | Request fails; retry; selection changes | Current selection wins, no duplicate history |
| NS06 | Keyboard/mobile same journey | Accessible heading/focus/Return; no hidden control |
| NS07 | Historical W43 figure/Evidence/direct link → Close | P17 valid focus/fallback without extra Back steps |

Checks are pending implementation. Companion [accessibility contract](accessibility-responsive-spec.md) governs focus and announcements. Detailed route encoding, history restoration mechanism, and delivery failures remain technical-spec work.
