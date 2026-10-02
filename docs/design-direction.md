# Design Direction

Status: Personal Studio (A/P01), owner-approved concept. Purpose: a creative personal web app; no résumé/portfolio layout. Detailed interaction contracts below remain drafts; this is not a final visual specification.

## Product contract

Primary loop: enter → choose work → inspect a decision/evidence → explore another item or contact.

Engineering Practice is an internal content structure. It does not require editorial pages, calm rows, neutral branding, or a chronological résumé.

Premium = crafted hierarchy and recognizable identity. Simple = few meaningful choices and predictable behavior. Neither requires visual quietness or blandness.

## Entry composition

- Establish Arvin's identity and one authored focal work item.
- Offer one clear primary action; limit supporting choices.
- Make composition memorable through asymmetry, expressive display typography, contrast in scale, and a coherent motif.
- Keep browsing and contact apparent; never require a tour.
- Do not reinstate introduction → experience → projects → about → contact as the page skeleton.
- Avoid a wall of panels, navigation items, filters, metrics, or technology badges advertising the whole application.

## Proposed interaction contract

| Intent | Action | Visible result | Recovery / alternate |
| --- | --- | --- | --- |
| Explore something interesting | Open featured work | Focused story, selected item/title, clear back path | Direct URL works independently |
| Find relevant work | Browse/select a confirmed group | Collection changes and active selection is explicit | Clear selection restores the collection |
| Understand judgment | Choose a decision | Constraint, alternatives, choice, consequence/evidence | Back returns to the same story |
| Inspect proof | Open available evidence | Contextual screenshot/diagram/recording or text | Missing media retains the full explanation |
| Continue exploration | Choose related work or return | Related story or prior collection context | Browser Back is consistent |
| Start a conversation | Open Contact from any public state | Approved contact destinations | No completion requirement |

Groups derive from available content (such as company); exact labels/filter count are unresolved. Do not create empty AI/UX/architecture categories to fill a layout.

## Work and company context

Let work objects vary meaningfully: a cancelled platform, an ongoing queue system, and a shop can have different emphasis without losing shared navigation.

Use company logos/name/role/dates in contextual entries. Company cards stay logos-only. Project evidence belongs inside the story/inspector, not on a company cover.

For Unixsee, select among its three projects. For the previous company's main shop, show that product directly. Multiple exploration paths reference the same authored story.

## Story rhythm and media

Lead with a concise problem and contribution. Give decisions and evidence their own visual moments; distribute detail instead of placing a long essay under every item.

Future screenshots, diagrams, authored transitions, or interactive inspection must explain something. Do not require every story to have imagery. No synthetic client results, fake product screenshots, fake dashboards, or invented diagrams used as proof.

## Motion and responsive behavior

Transitions maintain selected-item context and orientation. No scroll hijacking, autoplay narrative, forced game, or animation delay before work/contact.

Desktop may show collection and inspector together; mobile uses focused views with clear back/title. At 320px and with keyboard/reduced motion, all essential actions remain available. Important labels/actions cannot depend on hover.

## Open visual choices

Signature motif, palette, fonts, type scale, layout measurements, and theme policy require a later selected visual target. Asymmetry is intentional hierarchy, not random misalignment. Strong typography never sacrifices reading comfort.

## Rejection conditions

Reject a design whose distinctiveness is only a new accent color, oversized name, decorative gradient, or animation on a conventional CV. Also reject a crowded app dashboard, inaccessible spatial navigation, or a creative treatment that obscures purpose and actions.

The selected concept guides the next UX specifications. Review the draft contracts before implementation; visual quality and usability remain untested.
