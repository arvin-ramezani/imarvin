# Standalone Work source access

Package: `ui-art-director` | Repository: `arvin-ramezani/imarvin` | Source directory: `.agents/skills/ui-art-director`.
Read this before resolving the repository-relative links in `SKILL.md`. Those links remain unchanged for Codex.
This package contains instructions and local references, not a repository checkout or tool entitlement.
Apply the remote-resolution and personal-installation checks below to standalone Work only. In a verified Codex checkout, use its actual HEAD/scoped repository authorities, existing relative links and repository gate policy; no personal installation record is required. Verify live GitHub task/PR state as those rules require.

## Resolve current external authority

1. Use the connected GitHub tools to inspect the repository default branch and resolve its current full commit SHA. Default to current `main` requirements; use another requirements revision only when the owner explicitly assigns it. For PR work, inspect its current head separately. Record **requirements SHA** and **skill-package source SHA** independently; an unmerged skill PR does not supersede approved requirements.
2. Fetch `AGENTS.md`, `PRD.md` and `docs/decisions.md` at the requirements SHA; fetch the shared `docs/engineering/image-first-design-workflow.md` routing guide at the skill-package source SHA. Fetch only its scoped canonical specs/registry at the requirements SHA and live screen issue/approval evidence. Do not read everything or reopen approved decisions.
3. With a file tool, pass repository `arvin-ramezani/imarvin`, repository-root path and `ref=<verified SHA>`. With URL retrieval, use `https://github.com/arvin-ramezani/imarvin/blob/<verified SHA>/<repository-root path>`. Verify the returned ref/content; a title/search snippet is not a source read.
4. Resolve a relative Markdown target against the **source file's repository directory**, never this personal installation directory. Example: from `.agents/skills/ui-art-director/SKILL.md`, `../../../docs/engineering/image-first-design-workflow.md` resolves to `docs/engineering/image-first-design-workflow.md`; the workflow's `../specs/visual-system-spec.md` resolves to `docs/specs/visual-system-spec.md`. Preserve and verify anchors in fetched content. Shared installation/routing guidance uses the skill-package SHA; product/UX/architecture authority uses the requirements SHA.
5. For `../<skill>/SKILL.md` or a `$<skill>` handoff, do not assume a sibling installation. Invoke a verified installed skill if available; otherwise retrieve `.agents/skills/<skill>/SKILL.md` and its required references at the verified skill source SHA (current `main` unless an explicit draft revision is authorized). Follow its role only if the task authorizes it; never auto-install or auto-run a reviewer. Missing skills are not missing approval.
6. Use bundled `design-craft.md` and `LICENSE.emilkowalski` when present; these are portable copies of the art-director craft reference and its notice. Codex may keep using the original sibling links. Neither craft copy replaces current product specs. Resolve any other required reference through step 4.
7. Record the actual paths, SHAs, requirement IDs and retrievable evidence read. Recheck task/branch state before later edits. Code execution still requires an authorized checkout, implementation plan/gates and the tools required by repository policy; Work installation alone supplies none of these.

## Missing or stale sources

If GitHub access, SHA verification, a required file/anchor, approval evidence or a required cross-skill reference is unavailable, return `BLOCKED — required source unavailable` with its exact repository path/ref and affected work. Do not silently substitute remembered requirements, search snippets, stale bundled specifications or another branch. Continue only independent preparation explicitly marked incomplete.
User-supplied immutable source files may be used only if their required revision and completeness can be verified; otherwise preserve the blocker. Optional inspiration-reference failures may be disclosed without blocking unrelated work.
Missing generation or inspection tools retain the separate blockers in `SKILL.md`; source retrieval does not grant those tools. Never certify owner approval, independent Design QA or runtime behavior from this package.

## Installed revision check

An installed copy is independent of GitHub. Follow the shared workflow's installation guide at `docs/engineering/chatgpt-skill-installation.md`, retrieved at the verified skill-package source SHA.
At installation/update, record repository, skill directory, full source commit SHA, each source file's Git blob SHA and installed SHA-256 in `references/install-source.json` inside the personal package; exclude this generated record from its own file inventory. Do not write a guessed record into the source repository.
Before use, compare the installed package inventory and hashes with its record and compare source file blob SHAs with the current approved skill revision. A repository commit change alone is not a skill update when its file inventory/blobs are unchanged. An explicitly authorized draft skill uses its verified PR SHA and remains labelled draft.
If provenance is missing, hashes differ, files were added/removed or the source cannot be checked, report `BLOCKED — installed skill revision unverified` for dependent skill work and request or perform an authorized update through skill-creator. Do not overwrite unrelated personal edits; report them. Fetching new product specs does not update old skill instructions.
