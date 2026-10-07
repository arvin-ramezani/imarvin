# Graph Report - imarvin  (2026-10-07)

## Corpus Check
- 96 files · ~47,739 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 4, .example 2, .css 1)

## Summary
- 659 nodes · 1121 edges · 52 communities (47 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5410c10f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- publish/page.tsx
- actions.ts
- auth.integration.test.ts
- theme-utility.tsx
- README.md
- package.json
- components.json
- vitest
- devDependencies
- compilerOptions
- dependencies
- scripts
- Spec-Driven Development Workflow
- 20261005100000_owner_auth/migration.sql
- Issue #23 — Work Story Summary Vertical Slice
- eslint.config.mjs
- load-test-env.mjs
- 20261005160000_work_story_summary/migration.sql
- postcss.config.mjs
- Technical Architecture Baseline
- Issue #17 — Owner Auth Foundation
- Issue #21 — Theme Behavior + Shared App Shell
- Owner UX Specification
- Public UX Specification
- PRD
- Runtime, Security, Storage, and Operations
- Signal Studio Theme + UI Lint Foundation
- Next.js Application Bootstrap
- UI and Agent Tooling Foundation
- Content and Publishing Specification
- Project Images, Video, and Evidence
- Navigation and State Specification
- Visual System: Signal Studio
- Agent Rules
- Responsive & Interaction Validation
- Accessibility and Responsive Specification
- Visual Refinement Review
- Branding Principles
- Content Inventory
- Decisions
- Specification Plan
- Personal Studio: Visual Exploration
- Design Concepts
- Product UX and Design Review
- UI Skill Policy
- Components and Interaction Contract
- UX Principles
- Integrated UX and Design Acceptance
- @playwright/test
- imarvin

## God Nodes (most connected - your core abstractions)
1. `scripts` - 17 edges
2. `next` - 17 edges
3. `requireOwnerSession()` - 16 edges
4. `compilerOptions` - 16 edges
5. `vitest` - 13 edges
6. `ThemeUtility()` - 11 edges
7. `saveStoryAction()` - 11 edges
8. `server-only` - 11 edges
9. `Spec-Driven Development Workflow` - 11 edges
10. `publishStory()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Authorization boundary` --references--> `requireOwnerSession()`  [INFERRED]
  docs/implementation/17-owner-auth-foundation.md → lib/auth/owner.ts
- `Shared shell` --references--> `requireOwnerSession()`  [INFERRED]
  docs/implementation/21-theme-shared-shell.md → lib/auth/owner.ts
- `Shared shell` --references--> `AppShell()`  [INFERRED]
  docs/implementation/21-theme-shared-shell.md → components/app-shell.tsx
- `RootLayout()` --calls--> `AppShell()`  [EXTRACTED]
  app/layout.tsx → components/app-shell.tsx
- `StoryPreviewPage()` --calls--> `StorySummary()`  [EXTRACTED]
  app/studio/work/[storyId]/preview/page.tsx → features/work/story-summary.tsx

## Import Cycles
- None detected.

## Communities (52 total, 5 thin omitted)

### Community 0 - "publish/page.tsx"
Cohesion: 0.08
Nodes (36): metadata, NewStoryPage(), metadata, relationshipLabel(), StudioWorkPage(), EditStoryPage(), EditStoryPageProps, metadata (+28 more)

### Community 1 - "actions.ts"
Cohesion: 0.08
Nodes (43): metadata, WorkPage(), generateMetadata(), WorkStoryPage(), WorkStoryPageProps, identitySchema, publishStoryAction(), requestHeaders() (+35 more)

### Community 2 - "auth.integration.test.ts"
Cohesion: 0.05
Nodes (59): GET, POST, runtime, auth, toolingDatabase, createOwnerStory(), getOwnerStory(), listOwnerStories() (+51 more)

### Community 3 - "theme-utility.tsx"
Cohesion: 0.12
Nodes (25): geist, metadata, RootLayout(), AppShell(), AppShellProps, labelFor(), OPTIONS, persistPreference() (+17 more)

### Community 4 - "README.md"
Cohesion: 0.32
Nodes (4): Canonical contracts, Design Direction, Product and expression, Rejection conditions

### Community 5 - "package.json"
Cohesion: 0.09
Nodes (22): name, private, type, version, auth, @base-ui/react, @better-auth/prisma-adapter, class-variance-authority (+14 more)

### Community 6 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 7 - "vitest"
Cohesion: 0.29
Nodes (4): @testing-library/react, @testing-library/user-event, vitest, mockedSaveStoryAction

### Community 8 - "devDependencies"
Cohesion: 0.10
Nodes (21): devDependencies, auth, dotenv, eslint, eslint-config-next, jsdom, @playwright/test, prisma (+13 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, @base-ui/react, better-auth, @better-auth/prisma-adapter, class-variance-authority, cn, lucide-react, next (+9 more)

### Community 11 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, auth:check, auth:generate, build, db:generate, db:migrate:deploy, db:migrate:status, db:validate (+9 more)

### Community 12 - "Spec-Driven Development Workflow"
Cohesion: 0.18
Nodes (11): 10. Definition of done, 1. Artifact hierarchy, 2. When an implementation spec is required, 3. Feature issue contract, 4. Delivery strategy, 5. Agent implementation loop, 6. Pull request contract, 7. Review and merge (+3 more)

### Community 13 - "20261005100000_owner_auth/migration.sql"
Cohesion: 0.29
Nodes (11): "account", account_userId_idx, "rateLimit", rateLimit_key_key, "session", session_token_key, session_userId_idx, "user" (+3 more)

### Community 14 - "Issue #23 — Work Story Summary Vertical Slice"
Cohesion: 0.18
Nodes (10): Data model, Gates, Goal, Issue #23 — Work Story Summary Vertical Slice, Non-goals, Public read model, Server boundaries, Tests and acceptance (+2 more)

### Community 15 - "eslint.config.mjs"
Cohesion: 0.25
Nodes (5): applicationFiles, eslintConfig, eslint, eslint-config-next, @shadcn/lint

### Community 16 - "load-test-env.mjs"
Cohesion: 0.20
Nodes (3): dotenv, prisma, testEnvPath

### Community 21 - "Technical Architecture Baseline"
Cohesion: 0.20
Nodes (10): 1. Architecture style, 2. Accepted stack, 3. Rendering and data rules, 4. Module boundaries, 5. Data and publishing integrity, 6. UI and CSS rules, 7. Testing policy, 8. Security, reliability, operations (+2 more)

### Community 22 - "Issue #17 — Owner Auth Foundation"
Cohesion: 0.20
Nodes (9): Authentication contract, Authorization boundary, Goal, Issue #17 — Owner Auth Foundation, Logging and failure behavior, Owner invariant and provisioning, Password/session contract, Pinned integration (+1 more)

### Community 23 - "Issue #21 — Theme Behavior + Shared App Shell"
Cohesion: 0.22
Nodes (8): Acceptance mapping, Gates, Goal, Issue #21 — Theme Behavior + Shared App Shell, Non-goals, Testing, Theme architecture, Theme utility

### Community 24 - "Owner UX Specification"
Cohesion: 0.22
Nodes (9): 1. Owner's job and workspace, 2. Identity and access, 3. Structured authoring, 4. Editing state and actions, 5. Navigation, conflicts, and destructive actions, 6. Responsive and accessible owner editing, 7. Review scenarios, 8. Open boundaries (+1 more)

### Community 25 - "Public UX Specification"
Cohesion: 0.22
Nodes (9): 1. Experience intent, 2. Homepage: one authored invitation, 3. Browse: projects before companies, 4. Detail: summary first, depth by choice, 5. Company experience: one model, two content cases, 6. Personal context and contact, 7. Review scenarios, 8. Open scope and agent boundary (+1 more)

### Community 26 - "PRD"
Cohesion: 0.22
Nodes (9): 1. Product intent, 2. Users and outcomes, 3. Public requirements, 4. Owner requirements, 5. Experience quality, 6. V1 boundaries, 7. Acceptance targets, 8. Next gate (+1 more)

### Community 27 - "Runtime, Security, Storage, and Operations"
Cohesion: 0.25
Nodes (8): 1. Authentication and recovery — T03, 2. Filesystem media — T04, 3. Production deployment — T05, 4. Backup and restore — T06, 5. Small observability layer — T07, 6. Configuration contract, 7. Production boundaries, Runtime, Security, Storage, and Operations

### Community 28 - "Signal Studio Theme + UI Lint Foundation"
Cohesion: 0.25
Nodes (7): 1. Scope, 2. Approved token source, 3. shadcn semantic mapping, 4. @shadcn/lint policy, 5. Agent contract, 6. Verification, Signal Studio Theme + UI Lint Foundation

### Community 29 - "Next.js Application Bootstrap"
Cohesion: 0.25
Nodes (7): 1. Scope, 2. Version baseline, 3. Files and behavior, 4. Package rules, 5. Verification, 6. Merge boundary, Next.js Application Bootstrap

### Community 30 - "UI and Agent Tooling Foundation"
Cohesion: 0.25
Nodes (7): 1. Scope, 2. shadcn foundation, 3. Agent skills, 4. Deferred dependencies, 5. Verification, 6. Merge boundary, UI and Agent Tooling Foundation

### Community 31 - "Content and Publishing Specification"
Cohesion: 0.25
Nodes (8): 1. Content model, not database schema, 2. Orthogonal states, 3. Lifecycle contracts, 4. Publication checks, 5. Removal and relationships, 6. Concurrency and privacy, 7. Review scenarios, Content and Publishing Specification

### Community 32 - "Project Images, Video, and Evidence"
Cohesion: 0.25
Nodes (8): 1. Purpose and choice, 2. Placement map, 3. Truthful unshipped work, 4. Inspection and playback, 5. Composition and delivery experience, 6. Authoring and publication, 7. Verification boundary, Project Images, Video, and Evidence

### Community 33 - "Navigation and State Specification"
Cohesion: 0.25
Nodes (8): 1. Public destinations, 2. State vocabulary, 3. Transition contracts, 4. Share and invalid locations, 5. Loading, empty, failure, and absence, 6. Public privacy contract, 7. Review scenarios, Navigation and State Specification

### Community 34 - "Visual System: Signal Studio"
Cohesion: 0.25
Nodes (8): 1. Visual communication, 2. Surface and decoration policy, 3. Approved light and dark palette target, 4. Type, icons, shape, spacing, 5. Responsive composition, 6. Public/owner states and motion, 7. Theme behavior — P14 / R27, Visual System: Signal Studio

### Community 35 - "Agent Rules"
Cohesion: 0.29
Nodes (7): Agent Rules, AI context format, graphify, Read before editing, Review and handoff, Scope and authority, This is NOT the Next.js you know

### Community 36 - "Responsive & Interaction Validation"
Cohesion: 0.29
Nodes (7): 1. Review boundary, 2. Conditions and fixtures, 3. Check matrix, 4. Written review findings, 5. Document reasoning result, 6. Execution and evidence handoff, Responsive & Interaction Validation

### Community 37 - "Accessibility and Responsive Specification"
Cohesion: 0.29
Nodes (7): 1. Adapt the task, preserve the model, 2. Semantic interaction and focus, 3. Perception and reading, 4. Evidence and motion, 5. Review scenarios, Accessibility and Responsive Specification, Theme parity

### Community 38 - "Visual Refinement Review"
Cohesion: 0.29
Nodes (7): Acceptance and AI boundary, Dark palette calculation, Owner brief, Public/owner wide/narrow review matrix, Validation record, Visual Refinement Review, What changes

### Community 39 - "Branding Principles"
Cohesion: 0.33
Nodes (6): Apply the knowledge, Branding Principles, Evidence limits, Source, Working positioning, Writing rules

### Community 40 - "Content Inventory"
Cohesion: 0.33
Nodes (6): Candidate visual evidence to collect, Capture worksheet, Content Inventory, Curated work and entry selection, Previous company, Unixsee

### Community 41 - "Decisions"
Cohesion: 0.33
Nodes (6): Accepted choices, Architecture baseline, Confirmed constraints, Decisions, Open inputs, Superseded direction

### Community 42 - "Specification Plan"
Cohesion: 0.33
Nodes (6): Agent context, Implementation readiness, Order and current status, Specification inventory, Specification Plan, Vertical-slice strategy

### Community 43 - "Personal Studio: Visual Exploration"
Cohesion: 0.33
Nodes (6): Decision criteria, Fixed across all directions, Personal Studio: Visual Exploration, VS-A. Signal Studio — approved, VS-B. Night Instrument — unselected, VS-C. Specimen Desk — unselected

### Community 44 - "Design Concepts"
Cohesion: 0.40
Nodes (5): A. Personal Studio — selected, B. Work Atlas — unselected, C. Story Explorer — unselected, Design Concepts, Selection and next review

### Community 45 - "Product UX and Design Review"
Cohesion: 0.40
Nodes (5): Contract review, Fast owner review, Product UX and Design Review, Proposed palette calculation, Remaining inputs and validation

### Community 46 - "UI Skill Policy"
Cohesion: 0.40
Nodes (5): 1. Installed skills and mandatory triggers, 2. Motion boundary, 3. Deferred skills — install just in time, 4. Verification order, UI Skill Policy

### Community 47 - "Components and Interaction Contract"
Cohesion: 0.40
Nodes (5): 1. Public component roles, 2. Owner component roles, 3. Interaction boundaries, 4. State coverage for future design review, Components and Interaction Contract

### Community 48 - "UX Principles"
Cohesion: 0.40
Nodes (5): Compact interaction template, Grounding, Later validation tasks, Reusable rules, UX Principles

### Community 49 - "Integrated UX and Design Acceptance"
Cohesion: 0.50
Nodes (4): Acceptance map, Integrated UX and Design Acceptance, Remaining readiness boundaries, Review procedure

### Community 51 - "imarvin"
Cohesion: 0.50
Nodes (4): Current review, imarvin, Local PostgreSQL, Read in order

## Knowledge Gaps
- **360 isolated node(s):** `runtime`, `GET`, `POST`, `geist`, `metadata` (+355 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 394 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `publish/page.tsx` to `actions.ts`, `auth.integration.test.ts`, `theme-utility.tsx`, `package.json`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `requireOwnerSession()` (e.g. with `Authorization boundary` and `Shared shell`) actually correct?**
  _`requireOwnerSession()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `runtime`, `GET`, `POST` to the rest of the system?**
  _360 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `publish/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07653061224489796 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `vitest` to `actions.ts`, `auth.integration.test.ts`, `theme-utility.tsx`, `package.json`, `eslint.config.mjs`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07744107744107744 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._