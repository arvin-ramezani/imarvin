# Standalone Repo-Local Adaptation

Upstream source: `openai/role-specific-plugins`  
Upstream path: `plugins/product-design/skills/design-qa/`  
Pinned commit: `fe5608d2512a7d6a7b9821ce8a88c48464ecd6e4`

This installation preserves the upstream Design QA workflow, output contract, severity model, fidelity surfaces, QA rubric, agent metadata, critical overrides, and communication protocol.

Only the following standalone adjustments were made to `SKILL.md`:

1. The out-of-scope `audit` skill link now routes broad audits/reviews to this repository's normal audit or review workflow, because the Product Design plugin is intentionally not required.
2. The critical-overrides link points to the vendored repo-local copy under `references/`; the referenced upstream file is otherwise unchanged.
3. The upstream Browser Choice dependency is localized to standalone Design QA needs: use available browser/screenshot tooling to capture the source and implementation, with no `@Sites`, deployment, sharing, or prototype-building requirement.
4. This adaptation note link was added so the divergence from upstream is explicit.

Vendored upstream support files are otherwise byte-for-byte unchanged.
