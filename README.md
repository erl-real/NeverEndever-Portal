NeverEndever-Portal v-0.5 repository map and action plan
You’re asking for precision and a path forward. Here’s the full breakdown your team can act on immediately.

Repository overview and current state
Structure: Mixed static HTML/CSS with TypeScript tooling and monorepo signals (pnpm workspaces, Lerna/Nx configs), plus Netlify functions and CI configs. Static pages include nav and sidebar demos; Supabase directory exists for DB/auth integration groundwork. A committed env file exists and must be removed and rotated immediately.

Tooling footprint: Vite, Vitest, ESLint/Prettier/Stylelint configs, pnpm workspace, but also package-lock.json (npm) and lerna/nx configs—these conflict and need consolidation.

Hosting/CI signals: netlify.toml present; .circleci and .github directories exist—choose one CI and one host to prevent drift.

Folder-by-folder breakdown
Project folders
.circleci: CircleCI pipeline config. If you’re not using CircleCI, remove to reduce confusion; otherwise ensure it runs lint/test/build steps aligned with pnpm and Vitest.

.github: GitHub-specific workflows/configs. Keep if adopting GitHub Actions; otherwise remove conflicting CI definitions.

.vscode: Shared editor settings. Keep minimal, avoid machine-specific paths or secrets.

assets: Static assets (images, icons, etc.). Ensure only used assets remain after migrating UI components.

docs: Documentation stubs. Centralize onboarding, architecture, and runbooks here; move scattered notes like llms.html content into docs.

examples/vite-css: Example Vite + CSS scaffolding. Either promote into the main app structure or remove after migration to avoid duplicate patterns.

netlify/functions: Serverless functions scaffolding for Netlify. Validate routing and environment injection if you choose Netlify; otherwise delete or migrate to Cloudflare Workers.

packages: Monorepo intent. Formalize into apps/lib packages or collapse into a single app if you’re not going full monorepo yet.

pages: Static HTML pages such as ELO.html, Home.Html, nav.html, staticsidebar.html. . These should be migrated into a framework router with shared layout components.

scripts: Client-side JS modules referenced in README (stateManager.js, utils.js, authManager.js). Consolidate into src/lib with clear boundaries and TS types in the main app.

styles: Global CSS and page-level styles like login.css. . Replace ad‑hoc styles with a design system (tokens + utilities) and component-scoped styles or Tailwind classes.

supabase: Placeholder for DB/auth setup. Centralize client initialization here and wire auth/session management via a provider in the app.

test: Vitest scaffolding. Hook into src and enforce coverage thresholds for auth, utils, and data modules.

utils: General helper modules. Move into src/lib, type with TS, and separate client/server concerns.

Key top-level files
README.md: High-level plan: centralized config, DB-driven content, CSS variables/themes, reusable JS modules, Cloudflare hosting intent. Treat this as the roadmap and convert into actionable tasks in docs/onboarding.

AGENTS.md / CONTRIBUTING.md / SECURITY.md / CHANGELOG:* Process files present—update them to reflect the unified stack, pnpm, environment handling, and branch/PR rules.

analysis_server.py: Legacy/experimental Python—archive under docs/legacy or remove if not part of the platform.

eslint.config.mjs / prettier.config.mjs / stylelint.config.mjs: Ensure rules align with Vite + React + TS and your chosen styling system.

babel.config.mjs: Likely unnecessary with Vite; remove if not required by any specific transform.

lerna.json / nx.json / pnpm-workspace.yaml: Conflicting monorepo managers. Standardize on pnpm workspaces (optionally Turborepo) and remove Lerna/Nx if not actively used.

package.json / pnpm-lock.yaml / package-lock.json: Dual lockfiles present (pnpm and npm). Enforce pnpm, delete package-lock.json to prevent accidental npm installs.

netlify.toml: Netlify routing/headers. Keep only if you choose Netlify; otherwise remove to avoid ambiguity.

tailwind.config.js.txt: Misnamed Tailwind config; tooling won’t load it. Rename to tailwind.config.js or .cjs if adopting Tailwind.

tsconfig.json / tsconfig.base.json: Root and base TS configs; unify once structure is settled.

vite.config.js / vitest.config.mts / vitest.shared.mts: Build/test configs. Validate paths and aliases after restructuring.

ELO.html / Home.Html / nav.html / staticsidebar.html / login.css: Legacy UI artifacts—migrate to components and delete once parity is achieved.

mainkey.env: Sensitive env committed. Remove from repo/history and rotate all affected keys immediately.

Critical issues and cleanup actions
Secrets exposure: mainkey.env is committed. Action: remove file, add .env* to .gitignore, rotate Supabase and any other keys, and add .env.example for onboarding. Run a secret scan across history.

Tooling conflicts: Remove package-lock.json, lerna.json, nx.json unless explicitly used. Lock on pnpm workspaces. Update CONTRIBUTING.md with pnpm commands.

Misconfigured Tailwind: Rename tailwind.config.js.txt properly and configure if you adopt Tailwind. If you choose SCSS Modules, delete Tailwind config to avoid confusion.

Static duplication: nav/sidebar/content exists in multiple static pages. Migrate into a shared Layout/Nav/Sidebar component in a framework and remove duplicates.

CI/CD ambiguity: .circleci, .github, netlify.toml coexist. Pick GitHub Actions + single host (Cloudflare Pages + Workers or Netlify) and delete unused configs.

Recommended architecture and frameworks
Modular, secure, and fast—aligned with your security-first and visual polish priorities.

Core stack selection
Layer	Recommendation	Rationale
Frontend	React + Vite + TypeScript	Fast dev, TS-first, excellent ecosystem for modular UI
Styling	Tailwind CSS + CSS variables (tokens)	Speed + consistent theming; fits gradients/visual polish
Components	Radix UI primitives or Base UI	Accessible headless primitives to style your brand uniquely
Data	Supabase (Auth + Postgres + RLS)	Already planned; secure, scalable, SQL-first
State	TanStack Query + minimal Context	Robust server-state, clean session handling
Routing	React Router (Vite)	Simple and explicit route control
Testing	Vitest + Testing Library	Modern testing aligned with Vite/TS
CI/CD	GitHub Actions	Single provider, stable secrets management
Hosting	Cloudflare Pages + Workers (or Netlify)	Edge delivery and simple deploys; choose one and standardize
Sources:

Step-by-step migration guide
Phase 0: Security triage (immediate)
Remove secrets & rotate: Delete mainkey.env, purge from history if feasible, rotate Supabase and any exposed keys, add .env.example and .gitignore entries. Update SECURITY.md with secret handling and rotation runbook.

Lock tooling: Enforce pnpm; delete package-lock.json. . Remove lerna.json/nx.json unless actively adopting one. Confirm pnpm-workspace.yaml includes only the intended packages/apps.

Choose host/CI: Decide Cloudflare Pages + Workers or Netlify. If Cloudflare, delete netlify.toml. . Choose GitHub Actions; remove .circleci to avoid drift.

Phase 1: App scaffold (Day 1–2)
Create app: apps/portal with Vite + React + TS. Use src/components/Layout/Nav/Sidebar and src/pages for route views. Migrate content from ELO.html, Home.Html, nav.html, staticsidebar.html into components.

Styling system: If Tailwind, fix tailwind.config.js (rename from .txt) and add src/styles/tokens.css with CSS variables (colors, spacing, radii, shadows). Convert login.css into component-scoped styles or Tailwind classes.

Utilities: Move scripts/stateManager.js, utils.js, authManager.js into src/lib with TypeScript types. Centralize configuration (API endpoints, constants) into src/lib/config.ts as described in README.

Phase 2: Auth and profile (Day 3–4)
Supabase client: Create src/lib/supabase.ts that reads env from process.env with no hardcoding. Build an AuthProvider to manage sessions, protected routes, and sign-in/out flows.

Profile: Implement profile read/write with optimistic updates and validation. Persist avatar/handle; add error states. Use RLS policies for security at the row level.

Phase 3: Content and playlists (Day 5–6)
DB schemas: Define tables for playlists, FAQs, announcements. Replace hardcoded arrays with queries and client-side caching via TanStack Query.

Player: Build a player component with queue/persistence. Support YouTube embeds via stored IDs/URLs in DB, not hardcoded in HTML.

Phase 4: Admin and dashboards (Day 7–8)
Admin CRUD: Build dashboards for playlists, FAQs, announcements, users with RBAC tiers. Implement CRUD with server-side validation and audit logging.

Todo/report sections: Add admin todo list, report moderation tools, and bug tester signup forms writing to Supabase tables.

Phase 5: CI/CD, testing, docs (Day 9–10)
Actions pipeline: Install, lint, typecheck, test, build, deploy. Cache pnpm. Inject env via provider secrets. Generate preview deploys on PRs.

Tests: Unit/integration tests for auth, nav, forms, and DB interactions. Set coverage gates in vitest.config.mts. . Add visual regression on critical components if feasible.

Docs: Consolidate llms.html content into docs/onboarding.md. Update CONTRIBUTING.md with pnpm commands, branch strategy, and code review standards. Add runbooks for auth, deploy, and incidents.

Phase 6: Integrations and hardening (Day 11–14)
Discord/Twitch: Implement serverless functions to automate announcements and live status. Secure tokens, rate limit, and add monitoring.

Security headers: Enforce HTTPS, CSP, HSTS, X-Frame-Options, X-Content-Type-Options, and strict CORS. Add input validation and session safety with token rotation.

Observability: Add structured logs, error tracking, and performance SLOs tied to CI gates.

Remove, rename, and move list
Delete: package-lock.json, lerna.json, nx.json (unless adopted), analysis_server.py (if unused), legacy static HTML after migration (ELO.html, Home.Html, nav.html, staticsidebar.html), unused assets/scripts/styles.

Rename: tailwind.config.js.txt → tailwind.config.js or tailwind.config.cjs; ensure tsconfig.base.json and tsconfig.json are consistent with the final structure.

Move: scripts/* → src/lib; styles/* → component-scoped or Tailwind; pages/* → src/pages under a React router; supabase client → src/lib/supabase.ts.

Team briefing snapshot
State: Mixed scaffolding; conflicting tooling; sensitive env committed; static UI duplicates.

Decision: React + Vite + TS, Tailwind + tokens, Radix/Base UI primitives, Supabase, TanStack Query, GitHub Actions, Cloudflare Pages + Workers (or Netlify—choose one).

Immediate: Remove secrets, standardize tooling, stand up app scaffold, migrate static pages to components, and unify CI/CD.

Next: DB-driven playlists/FAQs/announcements, profile/auth flows, admin CRUD, integrations, tests, and docs.
