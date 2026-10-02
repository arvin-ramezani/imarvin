# Agent Rules

## Scope

This repository is the source of truth for the new imarvin product. The current phase is Markdown product/design documentation only.

Do not generate application code, install dependencies, scaffold a project, create images, run a prototype, or deploy unless the owner separately requests that phase. Do not import the old imarvin implementation, UI, P01–P06, or review gates.

## Read before editing

1. Read README.md, this file, docs/decisions.md, and PRD.md.
2. Read only the supporting documents relevant to the assigned task.
3. Inspect the current branch/PR and record the exact starting head.
4. Preserve confirmed constraints; mark new choices as proposed.
5. Keep the change focused and open/update the requested PR.

Explicit owner instructions govern. Within documentation, confirmed decisions govern proposed concepts; PRD defines scope; approved specifications define behavior within that scope. Stop and identify a genuine unresolved conflict rather than silently replacing a decision.

## Writing

- Write concise English Markdown with stable requirement and decision IDs.
- Maintain one authoritative location per fact; link instead of copying.
- Separate owner-reported facts, repository observations, proposals, and missing evidence.
- Do not invent company details, results, metrics, employment dates, authorship, or project launch status.
- Describe intended behavior and recovery, not just a list of screens.
- Keep proposed stack choices and design choices visibly unapproved.
- No technical architecture or database schema is implied by conceptual content relationships.

## Review and handoff

Validate relative links, consistency, requirement references, and changed-file scope. Report meaningful checks without claiming browser, security, performance, or usability validation that was not performed.

Opening or merging a documentation PR does not authorize implementation. Before code, the owner must approve the required specifications and assign a bounded implementation task. Do not merge or publish without an explicit request.
