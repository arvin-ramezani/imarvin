# Standalone Repo-Local Adaptation

Upstream source: `openai/role-specific-plugins`  
Upstream path: `plugins/product-design/skills/design-qa/`  
Pinned commit: `fe5608d2512a7d6a7b9821ce8a88c48464ecd6e4`

This installation preserves the upstream Design QA workflow, output contract, severity model, fidelity surfaces, QA rubric, agent metadata, and communication protocol. The upstream critical overrides are localized to Design-QA-relevant rules so the standalone skill does not inherit Product Design-only runtime behavior.

Only the following standalone adjustments were made to `SKILL.md`:

1. The out-of-scope `audit` skill link now routes broad audits/reviews to this repository's normal audit or review workflow, because the Product Design plugin is intentionally not required.
2. `critical-overrides.md` is localized to the upstream rules relevant to Design QA: existing-product context, communication, evidence-first visual comparison, browser use, and asset fidelity. Product Design-only saved-context, build-handoff, sharing/deployment, and prototype-building instructions are intentionally omitted.
3. The upstream Browser Choice dependency is localized to standalone Design QA needs: use available browser/screenshot tooling to capture the source and implementation, with no deployment, sharing, or prototype-building requirement.
4. This adaptation note link was added so the divergence from upstream is explicit.

The QA rubric, agent metadata, and communication protocol remain byte-for-byte upstream content. Browser guidance and critical overrides are the documented standalone adaptations.
