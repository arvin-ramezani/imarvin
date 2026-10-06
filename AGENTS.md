# Agent Rules

## Scope and authority

Source of truth: arvin-ramezani/imarvin. Product/UX and architecture documents are authoritative by scope; implementation begins only from a bounded issue/spec.

P01 Personal Studio is owner-approved. Use it as the product model; do not reopen the concept choice or combine unselected alternatives into V1 without owner direction. P05–P07 select one featured work, projects-first browsing, and summary then sections. P02–P04 confirm explicit publishing and focused English V1; P08 selects structured authoring. P09 approves Signal Studio as the visual direction; P11 approves the current visual system and rendered light/dark target; P13 prioritizes hierarchy/icons/shape/spacing/state with short supporting labels and selective purposeful decoration. Do not equate tab semantics with pill styling or require a cobalt active edge/background motif. P14 requires public/owner Light + Dark, with System default and a local theme preference. R27 governs theme parity/state preservation; do not confuse dark mode with Night Instrument or theme changes with publishing. P10 and P12 are owner-approved behavioral contracts. T01/T02 select the architecture baseline and spec-driven workflow. T03–T07 resolve O05 auth/recovery, filesystem media, VPS/OpenLiteSpeed deployment, off-host backup, and logging in docs/architecture/runtime-operations.md. Feature/bootstrap specs pin exact versions/commands/paths without reopening those choices. Read only assigned specs plus their companion state/lifecycle contracts; their presence does not authorize code.

The owner wants a creative personal web app and rejects a portfolio/résumé product. Do not restore a fixed introduction/experience/projects/about/contact homepage, chronological CV, or uniform résumé entries. Retain truthful work as content, not as a prescribed page template.
P15 requests documentation for purposeful project images/video, including cancelled/never-shipped work. Read docs/specs/media-evidence-spec.md with the relevant public/owner/publishing/accessibility contracts for media work. Company identity stays logos-only; project captures may appear on entry/browse and within company context. Detailed media UX remains proposed; previous rendered approval and #23's text-only evidence do not approve these new layouts or authorize assets/code.

Do not create images, application code, dependencies, prototype, or deployment without a separate owner request. Do not inherit the older imarvin implementation, UI, P01–P06, or review gates.

## Read before editing

1. README.md, this file, docs/decisions.md, PRD.md.
2. For code/technical work, read docs/architecture/architecture.md, docs/architecture/runtime-operations.md, and docs/engineering/spec-driven-development.md.
3. For UI work, read [UI skill policy](docs/engineering/ui-skill-policy.md) and load every skill its trigger requires. For shadcn work, load `$shadcn`; for meaningful React/Next.js component edits load `$vercel-react-best-practices`; for reusable React 19 component APIs load `$vercel-composition-patterns`; after app-code edits use `$next-dev-loop` when available. For test strategy, implementation/review, or database-backed test setup, load `$test-engineering`.
4. Read only the product/UX/implementation specs needed for the assigned issue.
5. Inspect branch/PR state; record the exact starting head.
6. Preserve confirmed constraints; distinguish proposals and unresolved facts.
7. Update the assigned PR and report exact head plus meaningful validation.

Explicit owner instructions govern. Confirmed decisions govern proposals; PRD governs scope; approved specs define behavior within that scope. Surface genuine conflicts instead of silently replacing decisions.

## AI context format

Use stable IDs and compact sections. For an interaction, write: user intent → trigger → visible state/result → back/reset/error → mobile/keyboard equivalent. For a design rule, write: required behavior → rationale → observable review condition.

Maintain one authority per fact and link to it. Record status, dependencies, non-goals, and unanswered decisions. Do not use long persuasive prose, repeated feature lists, or adjectives as substitutes for behavior.

AI-authored Markdown must be context-efficient: target <=120 lines and never exceed 150 lines. If a document would exceed 150 lines, split it by authority/responsibility/lifecycle and cross-link the smaller documents instead of duplicating context. Do not pad short documents to reach a minimum. Before handoff, count changed/new document lines and report the counts. Upstream/vendor Markdown installed under `.agents/skills/` is exempt: preserve it verbatim and use `skills-lock.json` for provenance rather than truncating it.

Never invent employment dates, responsibility, results, metrics, authorship, launch status, visual approval, or user-research findings. Conceptual relationships do not imply a database schema.
For implementation, configuration and logging contracts are mandatory: use the central server-only Zod config module and shared logger; do not add feature-local `process.env` access/parsing, direct `console.*`, or direct Pino configuration.
For UI styling, read `docs/specs/visual-system-spec.md` first and use the approved semantic theme tokens instead of raw Tailwind palette colors. `@shadcn/lint` design-system rules are enforced; run `npm run lint` after UI changes and fix shadcn diagnostics. Do not add theme tokens, component variants, or lint exceptions without bounded issue/spec authority. Any approved lint exception must stay local and explain the design requirement.
Owner/admin UI is motion-free: do not add UI animation to sign-in, `/studio/**`, private preview, publication review, or owner dialogs/feedback. Public visitor-facing UI may use purposeful motion only under P16 and the UI skill policy. User-controlled project video/recording playback is content, not owner UI animation.

## Review and handoff

Validate relative links, IDs, cross-document consistency, and changed-file scope. Describe actual checks; written review is not visual/usability/security verification.

No code without a bounded GitHub issue and accepted/linked implementation spec as required by the spec-driven workflow. Do not merge or publish without explicit authorization/review.


<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
