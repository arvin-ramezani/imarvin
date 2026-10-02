# Design Direction

Status: proposed concept A; depends on P01 approval. This document defines intent, not final screens or design tokens.

## Experience promise

A visitor should leave with a clear understanding of what Arvin worked on, what he owned, how he made decisions, and how to contact him.

Premium and simple means strong hierarchy, intentional spacing, restrained decoration, and meaningful content. Distinction comes from the story and perspective of the work.

## Homepage rhythm

Preserve Introduction → Work experience → Selected projects → About → Contact.

| Section | Proposed treatment |
| --- | --- |
| Introduction | A concise personal statement and clear work/contact links |
| Experience | Consistent company cards with role, dates, and one specific contribution |
| Selected projects | A few editorial summaries: problem, contribution, and one decision/outcome where evidence exists |
| About | Short human context connecting experience to current learning |
| Contact | Clear job/freelance invitation with approved contact destinations |

Treat these as a sequence of information, not an instruction to wrap every section in matching cards. Avoid repeated decorative headings and lengthy introductions.

## Company and work presentation

- Company cards use logos only; absent logos use company names.
- Use one clear card destination and action label, such as Explore my work.
- Keep a shared experience header across companies.
- For several projects, show concise summaries leading to project details.
- For the main company product, show the story directly, with no redundant card or click.
- A selected-project link can point to a stable section in that main story; final URL behavior belongs in the route specification.
- Lead detailed stories with problem and contribution; stack and implementation details remain easy to inspect.

## Content, media, and interaction

The essential story works as text. Existing project screenshots/recordings are optional evidence inside stories, never company-card decoration. Include captions explaining what the evidence demonstrates.

Use familiar links, natural scrolling, and clear back paths. Detail should deepen understanding rather than hide required information behind repeated accordions. A visitor need not interact with a terminal, game, or animation to find work/contact.

## Visual principles for later design

Proposed: readable editorial typography, a neutral base with restrained accent, clear hierarchy, subtle separators, and spacing that makes work comfortable to scan. Font names, palette values, dimensions, theme support, icon library, and tokens remain undecided.

Use motion only when it explains an interaction; preserve keyboard, touch, reduced-motion, and mobile usability. Important information cannot depend on hover.

## Avoiding a generic result

Prefer specific work and decision excerpts over slogan-only heroes, technology-logo walls, skill percentages, repeated feature grids, decorative metrics, and invented social proof.

No claims of architecture expertise, business impact, or current availability without evidence. A cancelled app is labeled; completed tasks and lessons still carry value.

## Later review

Evaluate scan clarity for both employers and clients; consistency with logos alone; multi/single-product behavior; reading on narrow screens; evidence placement; and direct contact access. Written principles are not visual QA or usability findings.
