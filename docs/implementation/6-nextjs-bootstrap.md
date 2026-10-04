# Next.js Application Bootstrap

Status: implementation spec | Issue: #6 | Depends on: #4 / PR #5.
Authority: architecture/runtime/workflow docs in PR #5; product and design specs remain unchanged.
Goal: add only the minimal application/toolchain scaffold needed for later bounded feature work.

## 1. Scope

Bootstrap the existing documentation repository in place from the official Next.js 16.3.8 empty App Router TypeScript + Tailwind + ESLint template.
Do not replace the repository README, AGENTS.md, product specs, or approved Signal Studio design documents.
Because this repository is not empty, apply the equivalent template files rather than running create-next-app destructively at the repository root.

Reference command for a fresh empty directory:

`npx create-next-app@16.3.8 . --ts --tailwind --eslint --app --no-src-dir --empty --use-npm --no-agents-md --disable-git`

## 2. Version baseline

- Next.js: 16.3.8, current Active LTS security release when this issue was created.
- React / React DOM: 19.2.8, the version selected by create-next-app 16.3.8.
- Node.js: 24.21.0 LTS for bootstrap verification.
- npm: package manager; commit package-lock.json.
- Tailwind, TypeScript, ESLint and type packages start from the ranges selected by the official template, then the generated lockfile/direct dependency manifest pins the installed versions used by this PR.

Do not switch to canary/prerelease packages merely because they are newer.

## 3. Files and behavior

Add the App Router root layout, empty home route, and Tailwind global import only.
Use the official TypeScript, Next.js, PostCSS and ESLint configuration as the baseline.
The scaffold must not implement Signal Studio, navigation, auth, database, forms, logging, config validation, testing libraries, or deployment.
Keep the existing project AGENTS.md; do not generate or overwrite it.

## 4. Package rules

Use npm only.
Commit the generated package-lock.json.
Keep direct dependencies reproducible rather than leaving broad ranges after bootstrap verification.
No dependency is added unless required by this scaffold.

## 5. Verification

Required on Node.js 24 LTS:
- `npm ci`
- `npm run lint`
- `npm run build`

The PR records the exact head used for verification.
A successful build does not approve product UI, runtime behavior, accessibility, or deployment.

## 6. Merge boundary

This implementation PR is stacked on `docs/o05-architecture-baseline` while PR #5 remains open.
Do not merge this PR before PR #5.
After PR #5 merges, retarget/rebase this PR to current `main`, rerun required checks, and review the resulting exact head.
