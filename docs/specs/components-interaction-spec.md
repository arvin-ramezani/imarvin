# Components and Interaction Contract

Status: P19–P26 responsibilities; scoped public presentation approved, exact components/editor widgets unapproved; P17 origin-aware Close/focus accepted wherever applicable; W43 implementation evidence historical. Updated: 2026-10-15.
Authority: [public checkpoint](ux-public-checkpoint.md), [owner content](owner-content-checkpoint.md), [relationships](project-story-spec.md), [Contact](contact-ux-checkpoint.md); [visual system](visual-system-spec.md) keeps approved art direction.
Authority: [visual system](visual-system-spec.md), [public UX](public-ux-spec.md), [navigation/state](navigation-state-spec.md), [owner UX](owner-ux-spec.md), [publishing](content-publishing-spec.md). Trace: R01–R27; A01–A12.
Names describe design responsibilities, not React components, library choices, database models, or coding assignments. [W43](../implementation/43-work-p15-p16-media-motion-retrofit.md) bounds accepted Work behavior/roles without a Decisions model; proposals here do not expand it. New substantive composition needs [visual-source approval](visual-source-workflow-spec.md).

## 1. Public component roles

| Role | Content/action and scope | States / responsive/accessibility |
| --- | --- | --- |
| Shared header / theme | Home name returns to top; Home section anchors, dedicated-page navigation; System/Light/Dark | Active destination and visible focus, keyboard/touch, no lost state |
| Combined identity + Featured Project hero | Brief identity, one published manually configured Project, contribution, Explore Project, secondary Contact | No configured feature: identity/eligible sections only; no fallback or media requirement |
| Home Stories / More Projects | UXH10 compact Story rows / smaller Project previews; existing four/three limits and Home curation | No duplicate featured Project; View all, absent/fewer items no fillers |
| Home Experience / About / offerings | Logo/name, concise factual contributions and optional Project links; brief About; three offerings | No company page, About repetition, service selector or fabricated links |
| Projects/Stories collections | Distinct items, one reusable label filter, published-only results, Load more | **Filter → pinned last-pinned-first → unpinned newest**; preserve filter/load/scroll |
| Project detail | Name/overview → individual contribution → optional showcase → secondary facts/links → public Stories | UXD08 single scroll, openly visible opening; UXD09 vertical authored media order/optional captions; no empty areas |
| Story detail | Title/introduction → concise designed explanation, optional contextual media/labels/public parent | UXD10 shared presentation, media with relevant explanation; no label templates; private-parent/standalone complete |
| Image/player content | Optional authored real capture, truthful stage and alternatives; explicitly controlled playback | No autoplay; vertical Project showcase approved; exact sizing/zoom/player design pending; text remains complete |
| Contact / Privacy | Email-or-phone form, conditional Telegram identity, direct channels; privacy note/page | Sending/safe accepted/failure statuses; no uploads, dashboard inbox or fake read receipt |
| Public feedback | Loading/empty/unavailable/error and valid recovery | No leaked private data, dead CTA, misleading status or motion-only meaning |

Where a contextual figure opens Evidence, P17 restores the originating section/figure with safe visible focus fallback; Evidence-origin/direct-entry Close retains valid Evidence focus. W43 tabs, Evidence IDs and lead/cover roles are historical, not required P19 Story components. Old Story-as-Project, company-detail and automatic related-Story controls are superseded. Treat the table as responsibilities, **not** a React component list, rich-text editor, chosen gallery design or visual approval.

## 2. Owner component roles

| Role | Visible requirement | Accessible/recovery scope |
| --- | --- | --- |
| Private management | Projects, Stories, Experience, Site settings; Projects/Stories All items and Home selection | Title, Private/Published, Edit, published Pin/Unpin; Project filter in All Stories |
| Home/pin arrangement | Published Featured Project/More Projects/Home Stories; shared pins; Experience order in its list | Home-only manual order, Move up/down; pending **Apply changes/Discard**; leaving Apply/Discard/Stay |
| Item editor / private preview | Separate Project/Story edit; UXD06–UXD07 minima, optional facts/media/labels/parent at creation | Explicit Save → Preview → Publish/Update; private input retained; no mandatory grouping/widget |
| Publication / deletion review | Project bulk Publish/Unpublish/Delete scoped selection, Keep/Unpublish/Delete child choices | PS13 together-or-unchanged confirmed; counts, applied-Home selection blocker, conflict/unknown recovery |
| Site settings / labels | Identity/About/offerings/Contact; reusable labels can be renamed/deleted | No Home ordering under settings or mandatory taxonomy page; never auto-publish entry edits |
| Confirmation/status | Separate public/private/unsaved, candidate/public comparison | Focus containment, Escape/Cancel, no animated owner UI chrome |

Meaningful labels, selected/focus distinction, accessible names and no-motion owner rule remain. [OWN01–OWN06](owner-content-checkpoint.md) own actions; [PS](project-story-spec.md) owns publication/destruction; exact widget/layout/schema remains undecided.

## 3. Interaction boundaries

Navigation/return/focus follow [navigation](navigation-state-spec.md), privacy/versions follow [publishing](content-publishing-spec.md), and media ownership follows [media](media-evidence-spec.md). Do not invent autosave, Story suggestions, attachment transfers, company-detail route, per-Project manual rank or automatic publication. Public motion is purposeful, with reduced-motion equivalents; owner/admin motion is absent.
Substantive new compositions require [VSRC](visual-source-workflow-spec.md) actual image/version approvals before implementation planning. Never pass off old W43 renders as matching new P19 screens; P18 synthetic TEST ONLY visual fixtures are not real project captures.

## 4. State coverage for future design review

| Surface | Representative states not yet visually approved |
| --- | --- |
| Combined Home | Feature/no-feature; Stories/More Projects 0/fewer/full; Experience/About/offerings/Contact |
| Collections | Pins/unpinned, labels/filter-before-sort, Load more/return, zero results, long title, media absent/failed |
| Details | UI/CLI/backend Project; Story standalone/private parent/public parent; zero/one/many optional media/links; no related Stories |
| Contact / Privacy | Email-only, phone-only, Telegram username conditional, safe send/failed retry, form note/page |
| Owner lists / arrangement | All items/Home selection, pending/Apply/Discard/fail, preserved pin priority on republish |
| Editor / bulk / deletion | Minimal publish, incomplete draft, old public candidate, selected child bulk atomicity, Keep Stories, Home blocker, conflict/expiry |
| Theme/mobile | Light/Dark/System, 320px, focus/keyboard, no owner animation, media no-autoplay |

These are design-review inputs, not screens already drawn or checks already executed. See [refinement review](../visual-refinement-review.md) for public/owner wide/narrow contracts. Use [acceptance](acceptance-spec.md) and [design review](../design-review.md) to record evidence at the correct stage.
