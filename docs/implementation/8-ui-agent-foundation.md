# UI and Agent Tooling Foundation

Status: implementation spec | Issue: #8 | Depends on: #6 / PR #7.
Authority: architecture/runtime/workflow docs on main; Signal Studio specs remain visual authority.
Goal: add the minimum shared UI/tooling layer needed before product feature implementation.

## 1. Scope

Initialize shadcn/ui in the existing Next.js App Router scaffold with the owner-selected **Base UI + Nova** preset.
Install project-local agent skills that materially improve implementation correctness.
Do not build public/owner product screens or add feature-specific components.

## 2. shadcn foundation

Run:
`npx shadcn@latest init --preset nova --base base --yes`

Keep the generated `components.json`, utilities, CSS foundation, and required dependencies.
Nova is a component/style foundation only. Approved Signal Studio tokens and product specs remain authoritative; generated demo/default styling must not become a product decision.
Do not bulk-install the component catalog. Add components only when a feature needs them.
Install `@shadcn/lint` as development tooling and register its ESLint plugin, but enable no design-system rules yet. Signal Studio token/policy enforcement belongs to the dedicated theme foundation issue.

## 3. Agent skills

Install project-local skills:
- `shadcn` from `shadcn/ui` for current component APIs, Base UI composition, CLI/docs workflow, and project-aware aliases.
- `next-dev-loop` from `vercel/next.js` for Next.js 16.3+ runtime verification.
- `vercel-react-best-practices` from `vercel-labs/agent-skills` for React/Next.js performance and modern rendering patterns.
- `vercel-composition-patterns` from `vercel-labs/agent-skills` for reusable component APIs and React 19 composition patterns.

Next.js framework knowledge itself comes from the version-matched docs bundled under `node_modules/next/dist/docs/`, not from a generic best-practices skill.
Keep the managed Next.js agent block in root `AGENTS.md` so agents read those bundled docs before coding.
Upstream skill Markdown is vendor content and is exempt from the project-authored 150-line limit; do not rewrite/truncate it.

## 4. Deferred dependencies

Do not install until a bounded issue uses them:
- Zod / React Hook Form;
- Framer Motion;
- Prisma/PostgreSQL;
- Better Auth;
- Pino;
- Cache Components / Partial Prefetching workflow skills.

This keeps the base dependency graph small and avoids configuring libraries before their real constraints exist.

## 5. Verification

Required:
- `npm ci`
- `npm run lint` loads the registered `@shadcn/lint` plugin with no design-policy rules enabled
- `npm run build`
- `npx shadcn@latest info --json` confirms Base UI + Nova
- installed skill folders plus `skills-lock.json` are committed
- no product page/component beyond the existing empty scaffold is added

Record exact-head evidence in the PR.

## 6. Merge boundary

This PR is stacked on `feat/6-nextjs-bootstrap` until PR #7 merges.
Do not merge before PR #7. After #7 merges, retarget/rebase to current `main`, rerun exact-head verification, and review the final diff.
