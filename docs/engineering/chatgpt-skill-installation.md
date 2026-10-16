# Personal ChatGPT Skills: install and update

Scope: the four imarvin design skills; complements the [design workflow](image-first-design-workflow.md). No image, implementation or owner-approval authority is added.
Use the current host's `skill-creator` installation instructions. This Work workspace successfully saved and verified the three design-phase Skills individually on 2026-10-16; availability and permissions must still be checked in the actual host. Do not infer unsupported installation from a missing cached skill-picker entry.

## Select and prepare one package

1. Verify repository `arvin-ramezani/imarvin`, task/PR state and current full source SHA through GitHub. Normally install from merged `main`; an owner-authorized draft revision must be explicitly labelled draft. Keep the approved requirements SHA separate from the skill source SHA.
2. Select exactly one `.agents/skills/<name>/` directory: `ui-art-director`, `spec-to-ui-image`, `senior-design-critic` or `approved-image-to-code`. Retrieve its entire file inventory at that SHA; no sibling installation or checkout is required. Preserve the original repository-relative links for Codex.
3. Include `SKILL.md`, `agents/openai.yaml` and every bundled reference/license in that directory. Art director, image generation and critique bundle design craft; every package bundles a Work source-access guide. External product specs remain current GitHub authority, not copied requirements.
4. Use skill-creator to place and validate the single package in the host's personal-skills workspace. Check name/description frontmatter, UI metadata, required resources and all dependency mappings. An ordinary scratch copy or ZIP is not an installation. Do not modify GitHub or independent personal edits merely to install a copy.
5. Write `references/install-source.json` inside the personal package with the repository, skill directory, full source SHA, installation date and a file inventory: source-relative path, Git blob SHA and installed SHA-256. Exclude the record itself. Keep copied bytes unchanged so comparisons are reproducible; document any intentional personal adaptation separately and require reconciliation before updating it.
6. Save **only this skill** using skill-creator's current supported process. Complete its post-save verification before starting another skill. Do not combine several new skill operations in one save. The earlier combined attempt's HTTP 422 response had no available detailed validation error; successful individual retries do not prove the original root cause.

## Verify installation and invoke

Verify the saved personal skill by its exact frontmatter name after the host finishes saving. Verify its full inventory and hashes against the selected source/installation record, including any host-generated metadata separately. A successful local validator alone is insufficient. Do not claim installation until the saved state is retrievable.
Use its actual detail link returned/resolved by the host; never invent a skill identifier. Refresh/reopen the Skills page when the verified saved state is not yet reflected in the picker. Do not reinstall just to work around a cached listing.
Invoke installed Skills with `@ui-art-director`, `@spec-to-ui-image`, `@senior-design-critic` or `@approved-image-to-code`, or select the matching skill in Work. The host loads the instructions; users need not fetch/paste `SKILL.md` on every invocation. Supporting Codex checkouts continue using `$skill-name` and local references.
Check actual tool capabilities separately: GitHub source retrieval, actual image generation/viewing, and an authorized executable checkout for coding. Missing tools retain their specific blockers; installation grants none of these capabilities.

## Check revisions before use

GitHub commits do **not** automatically update independent personal installations. Likewise, installing/updating a personal Skill does not change the repository, approve its PR or approve images.
Read the installation record and verify the installed inventory/hashes. Resolve the current approved skill branch to a full SHA, then compare the selected directory's source file inventory and Git blob SHAs with the record. Compare every bundled file, not just `SKILL.md` or display metadata. Unchanged skill blobs across a newer repository SHA need no reinstall; current product requirements must still be fetched separately.
If the record is missing, source access fails or the bytes differ, report `BLOCKED — installed skill revision unverified` for affected work. Do not silently label the installed copy current, guess its source or substitute remembered instructions. Reconcile an older unrecorded installation against an explicitly selected source before recording provenance; the three earlier installations are not automatically upgraded by this PR.

## Update one installed Skill

1. Identify the existing personal skill by exact frontmatter name and its current host-assigned directory. Check ownership and preserve its identifier. Never rename a saved directory back to the display name, create a duplicate or overwrite unrelated personal edits.
2. Compare the installed record/inventory with the new verified source. Show/report changed files; distinguish source changes from personal edits. Update only the authorized selected skill and its tracked bundled references. Remove a retired source file only as part of an authorized package update; do not touch other packages.
3. Validate in place, regenerate the installation record with actual new source blobs/installed hashes, save the single update and verify the saved package again. Preserve the old copy if saving fails and report incomplete update; do not claim success from local changes alone.
4. Confirm the same installed identity, new source SHA and expected bytes. Re-run affected source-access/dependency scenarios. Refresh the Skills page if needed. Changed instructions do not retroactively approve images or invalidate unrelated evidence; normal visual/spec revision rules still apply.

## Verification scenarios

| Scenario | Required observable result |
| --- | --- |
| Initial install | One saved identity; selected source inventory and hashes match; metadata/references load without another installed skill |
| Another skill absent locally | External cross-skill path resolves through verified GitHub retrieval; no implicit installation or code/reviewer invocation |
| Required GitHub source unavailable | Exact missing path/ref and affected scope reported; blocked dependent work; no invented Home requirements or approval |
| Source changes one bundled file | Revision comparison detects staleness even when `SKILL.md` is unchanged; authorized in-place update changes that file and record while preserving identity |
| New repository commit, same package | Inventory/blobs unchanged; no false stale-skill verdict; fetch current product requirements separately |
| Local personal edit or failed save | Conflict/incomplete update reported; independent files preserved; no successful-install claim |

Record scenario evidence honestly: offline inventory/update simulations validate the procedure, not a live account installation or image quality. Live initial saves of the three design-phase Skills are earlier evidence; a live changed-package update needs its own saved-state verification if performed. No application test, static image or installation validates usability, accessibility conformance or implementation fidelity.
