# Agent Rules

## Scope and authority

Source of truth: arvin-ramezani/imarvin. Product/UX and architecture documents are authoritative by scope; implementation begins only from a bounded issue/spec.

P01 Personal Studio is owner-approved. Use it as the product model; do not reopen the concept choice or combine unselected alternatives into V1 without owner direction. P05–P07 select one featured work, projects-first browsing, and summary then sections. P02–P04 confirm explicit publishing and focused English V1; P08 selects structured authoring. P09 approves Signal Studio as the visual direction; P11 approves the current visual system and rendered light/dark target; P13 prioritizes hierarchy/icons/shape/spacing/state with short supporting labels and selective purposeful decoration. Do not equate tab semantics with pill styling or require a cobalt active edge/background motif. P14 requires public/owner Light + Dark, with System default and a local theme preference. R27 governs theme parity/state preservation; do not confuse dark mode with Night Instrument or theme changes with publishing. P10 and P12 are owner-approved behavioral contracts. T01/T02 select the architecture baseline and spec-driven workflow. T03–T07 resolve O05 auth/recovery, filesystem media, VPS/OpenLiteSpeed deployment, off-host backup, and logging in docs/architecture/runtime-operations.md. Feature/bootstrap specs pin exact versions/commands/paths without reopening those choices. Read only assigned specs plus their companion state/lifecycle contracts; their presence does not authorize code.

The owner wants a creative personal web app and rejects a portfolio/résumé product. Do not restore a fixed introduction/experience/projects/about/contact homepage, chronological CV, or uniform résumé entries. Retain truthful work as content, not as a prescribed page template.

Do not create images, application code, dependencies, prototype, or deployment without a separate owner request. Do not inherit the older imarvin implementation, UI, P01–P06, or review gates.

## Read before editing

1. README.md, this file, docs/decisions.md, PRD.md.
2. For code/technical work, read docs/architecture/architecture.md, docs/architecture/runtime-operations.md, and docs/engineering/spec-driven-development.md.
3. Read only the product/UX/implementation specs needed for the assigned issue.
4. Inspect branch/PR state; record the exact starting head.
5. Preserve confirmed constraints; distinguish proposals and unresolved facts.
6. Update the assigned PR and report exact head plus meaningful validation.

Explicit owner instructions govern. Confirmed decisions govern proposals; PRD governs scope; approved specs define behavior within that scope. Surface genuine conflicts instead of silently replacing decisions.

## AI context format

Use stable IDs and compact sections. For an interaction, write: user intent → trigger → visible state/result → back/reset/error → mobile/keyboard equivalent. For a design rule, write: required behavior → rationale → observable review condition.

Maintain one authority per fact and link to it. Record status, dependencies, non-goals, and unanswered decisions. Do not use long persuasive prose, repeated feature lists, or adjectives as substitutes for behavior.

AI-authored Markdown must be context-efficient: target <=120 lines and never exceed 150 lines. If a document would exceed 150 lines, split it by authority/responsibility/lifecycle and cross-link the smaller documents instead of duplicating context. Do not pad short documents to reach a minimum. Before handoff, count changed/new document lines and report the counts.

Never invent employment dates, responsibility, results, metrics, authorship, launch status, visual approval, or user-research findings. Conceptual relationships do not imply a database schema.
For implementation, configuration and logging contracts are mandatory: use the central server-only Zod config module and shared logger; do not add feature-local `process.env` access/parsing, direct `console.*`, or direct Pino configuration.

## Review and handoff

Validate relative links, IDs, cross-document consistency, and changed-file scope. Describe actual checks; written review is not visual/usability/security verification.

No code without a bounded GitHub issue and accepted/linked implementation spec as required by the spec-driven workflow. Do not merge or publish without explicit authorization/review.
