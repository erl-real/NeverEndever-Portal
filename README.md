www.neverendever.com v1.0 full platform launch


Frontend framework	 
React + Vite + TypeScript	

Styling system	
Tailwind CSS + design tokens (CSS variables)

UI primitives	Radix / Base UI	

State & server data	
TanStack Query	
(Caching, retries, optimistic updates for Supabase-driven content)

Auth & DB	Supabase
(Auth + Postgres + RLS)	Already present in repo notes;
SQL-first and secure
Package manager	pnpm	Fast installs, deterministic; use single lockfile pnpm-lock.yaml	

Testing	
Vitest + Testing Library
Already present; Vite-native testing	

CI/CD	
GitHub Actions	
Centralized with repo; integrates with Cloudflare/Netlify	

Hosting	Cloudflare Pages + Workers (or Netlify if preferred)	Edge delivery; pick one and standardize


Architecture and folder map
Contents: what each folder contains Interactions: what code it links to and how it is used Actions: recommended cleanup and next steps for each folder

Root files and configs
package.json / pnpm-lock.yaml
  Contents: project dependencies, scripts.
  Interactions: used by all devs for install/build/test.
  Actions: Keep; enforce pnpm usage. Delete package-lock.json if present.

tsconfig.json / tsconfig.base.json
 Contents: TypeScript compiler options and path aliases.
 Interactions: referenced by Vite, tests, and editors.
 Actions: unify into a single base config; ensure paths match final folder layout.

vite.config.js / tailwind.config.js.txt
 Contents: Vite build config; misnamed Tailwind config.
 Interactions: Vite builds frontend; Tailwind must be properly named to be used.
 Actions: rename tailwind.config.js.txt → tailwind.config.js and validate.

netlify.toml / .circleci / .github
 Contents: CI/CD and deploy configs.
 Interactions: conflicting providers cause drift.
 Actions: pick one CI (recommend GitHub Actions) and one host (Cloudflare Pages or Netlify). Remove unused configs.

mainkey.env
 Contents: committed secrets.
 Interactions: used by Supabase or other services.
 Actions: Remove immediately, rotate keys, add .env* to .gitignore, add .env.example.

Key folders
 pages (static HTML)
  Contents: index.html, nav.html, staticsidebar.html, ELO.html, Home.Html.
  Interactions: duplicated nav and sidebar across pages; legacy UI.
  Actions: migrate content into React components under apps/portal/src/pages and src/components. Delete legacy files after migration.

 scripts
  Contents: stateManager.js, utils.js, authManager.js (legacy JS modules).
  Interactions: referenced by static pages and possibly by examples.
  Actions: Move to apps/portal/src/lib and convert to TypeScript. Remove unused functions. Add unit tests.

 styles
  Contents: global CSS, login.scss, page-specific CSS.
  Interactions: inconsistent styling approaches cause conflicts.
  Actions: centralize tokens in src/styles/tokens.css (CSS variables), adopt Tailwind utilities for layout, and convert page CSS to component-scoped styles or Tailwind classes.

 supabase
  Contents: placeholder scripts, SQL, or notes for DB/auth.
  Interactions: intended to host DB schema and client init.
  Actions: create src/lib/supabase.ts with a single exported Supabase client; move SQL migrations or schema files into supabase/migrations. Add RLS policy notes.

 netlify/functions
  Contents: serverless function stubs.
  Interactions: used for Discord/Twitch integrations or server-side tasks.
  Actions: if choosing Cloudflare Workers, migrate functions; otherwise keep and implement secure env injection.

 packages (monorepo)
  Contents: multiple package folders or empty placeholders.
  Interactions: intended for monorepo but currently inconsistent.
  Actions: either formalize into apps/portal + packages/ui + packages/lib using pnpm workspaces, or collapse into a single app to reduce complexity.

 test
  Contents: vitest configs and test stubs.
  Interactions: test runner for unit/integration tests.
  Actions: wire tests to src modules; add coverage thresholds.

 docs
  Contents: onboarding notes, llms.html, AGENTS.md..
  Interactions: scattered documentation.
  Actions: consolidate into docs/onboarding.md, docs/architecture.md, docs/security.md.


--------

Full task list (actionable, prioritized)
Tasks are grouped by priority and include suggested owner skill level and estimated effort.

Immediate critical tasks (Day 0–1)
Secrets removal and rotation
Action: remove mainkey.env from repo, add .env* to .gitignore, rotate all keys in Supabase and other services.
Owner: DevOps / Senior dev.
Effort: 1–2 hours.

Enforce package manager
Action: delete package-lock.json, add pnpm instructions to CONTRIBUTING.md, ensure CI uses pnpm.
Owner: Lead dev.
Effort: 1 hour.

Pick CI/CD and hosting
Action: decide between Cloudflare Pages + Workers or Netlify; choose GitHub Actions for CI. Remove unused .circleci or netlify.toml if not chosen.
Owner: Product + Lead dev.
Effort: 1–2 hours.

Rename Tailwind config
Action: rename tailwind.config.js.txt → tailwind.config.js and validate PostCSS setup.
Owner: Frontend dev.
Effort: 30 minutes.

High priority (Day 1–3)
Scaffold app and folder layout
Action: create apps/portal with Vite + React + TypeScript. Add src/components, src/pages, src/lib, src/styles.
Owner: Frontend dev.
Effort: 1–2 days.

Move and convert scripts
Action: migrate scripts/* → apps/portal/src/lib and convert to TypeScript (stateManager.ts, auth.ts, api.ts). Add unit tests.
Owner: Mid-level dev.
Effort: 1–2 days.

Implement Supabase client and AuthProvider
Action: create src/lib/supabase.ts and src/lib/AuthProvider.tsx. Implement signup, login, session persistence, and protected route wrapper. Use environment variables only.
Owner: Backend/Full-stack dev.
Effort: 1–2 days.

Migrate nav and layout
Action: build Layout, Nav, Sidebar components and replace static HTML references. Ensure responsive behavior.
Owner: Frontend dev.
Effort: 1 day.

Medium priority (Day 3–7)
Profile page and settings
Action: implement profile UI connected to Supabase user metadata table; support avatar upload and handle updates. Add optimistic UI and error handling.
Owner: Full-stack dev.
Effort: 2–3 days.

Playlist DB and player
Action: create playlists and tracks tables in Supabase; replace hardcoded playlists with DB-driven queries; implement player component supporting YouTube embeds and queue.
Owner: Full-stack dev.
Effort: 3–5 days.

Announcements and admin todo
Action: create announcements and admin_todos tables; build admin dashboard pages with CRUD. Add role-based access via Supabase RLS.
Owner: Backend + Frontend dev.
Effort: 3 days.

Testing and linting
Action: configure Vitest tests for auth, utils, and key components; enforce ESLint/Prettier rules; add pre-commit hooks.
Owner: QA / Dev.
Effort: 2 days.

Lower priority / integrations (Day 8–14)
Discord integration
Action: implement serverless function to post announcements to Discord; secure tokens in CI secrets.
Owner: Backend dev.
Effort: 2 days.

Twitch live status
Action: implement a worker or function to poll Twitch or use webhooks to update live status on site.
Owner: Backend dev.
Effort: 2–3 days.

Forums and referral program
Action: design forums, referrals tables and UI; implement invite tracking and referral rewards logic.
Owner: Product + Backend dev.
Effort: 1–2 weeks.

Docs and onboarding
Action: consolidate llms.html into docs/onboarding.md, update CONTRIBUTING.md, SECURITY.md, and add runbooks.
Owner: Technical writer / Dev.
Effort: 2–3 days.

Coding standards and team conventions
Package manager: pnpm only. Add pnpm install instructions to README and CONTRIBUTING.
TypeScript: strict mode enabled. Use tsconfig.base.json for shared settings.
Formatting: Prettier + ESLint + Stylelint. Use the existing config files but ensure they match the final stack.
Branching: main protected; feature branches feature/<short-desc>; PRs require 1 reviewer and passing CI.
Commits: Conventional commits (feat, fix, chore) to enable changelog automation.
Component style: prefer small, focused components; use Tailwind utility classes and CSS variables for tokens. Avoid global CSS overrides.
Monorepo: if using workspaces, keep apps/portal and packages/ui only. Avoid unnecessary complexity until the team is comfortable.

CI/CD, secrets, and deployment
CI provider: GitHub Actions (single source of truth).
Deploy target: Cloudflare Pages + Workers (or Netlify if chosen). Configure preview deploys for PRs.
Secrets: store in GitHub Secrets and in hosting provider. Never commit .env files. Add .env.example.
Pipeline steps: pnpm install → pnpm lint → pnpm test → pnpm build → deploy. Cache pnpm store.
Monitoring: add Sentry or similar for error tracking; add basic uptime checks.

Testing and QA
Unit tests: Vitest for utils, auth flows, and core components.
Integration tests: test Supabase interactions with a test DB or mocked client.
E2E: optional Cypress or Playwright for critical flows (signup, login, playlist playback).
Coverage: set a baseline (e.g., 60%) and raise over time.

Roles and recommended responsibilities
Lead dev / Architect
Finalize stack choices, enforce pnpm, review PRs, manage CI decisions.

Frontend dev(s)
Implement React components, Tailwind conversion, layout, and player UI.

Backend / Full-stack dev(s)
Supabase schema, AuthProvider, serverless functions, integrations.

DevOps
Secrets rotation, CI/CD pipelines, hosting configuration.

QA / Tester
Write tests, run manual QA, validate integrations.

Technical writer
Consolidate docs, onboarding, and runbooks.

Immediate checklist (what to do right now)
Remove mainkey.env from repo and rotate keys.
Delete package-lock.json and confirm pnpm for all devs.
Rename tailwind.config.js.txt to tailwind.config.js.
Decide hosting (Cloudflare or Netlify) and CI (GitHub Actions).
Scaffold apps/portal with Vite + React + TypeScript.
Create src/lib/supabase.ts and implement AuthProvider skeleton.
Migrate nav.html and staticsidebar.html into Layout components.
Add .env.example and update SECURITY.md with secret handling steps.



-----------------------

how we are doing it Centralize config: API keys, endpoints, constants → one .JS config file. (unless seperated for a reason like elo)

Database-driven content: FAQs, announcements, playlists → Supabase tables or googlesheets or thirdparty hosting (yt), not hardcoded HTML if a free path.

CSS variables/themes: Colors, gradients, fonts → one file, referenced everywhere. each page can have a color.css for personilizing pages

Reusable JS modules: Auth, API calls, error handling → one place.

why fast loading less network calls stays loaded between pages ez to edit parts to change whole

What’s Done Supabase connected for storage/auth (but not fully modularized). Cloudflare hosting set up (site deploys, but code not modular). GitHub repo exists (version control not in place,build on portal settle on depo frame). Basic UI elements: installed not using yet Music player widget: initial playlist integration (but hardcoded, not dynamic). Discord server: not linked to site. File structure: done

In Progress / Needs Refactor Nav + dashboard merge: redesining. Profile update system: redesign around settings and save state simple Admin todo list readme: concept exists, not implemented. Music playlist: coded version exists, but needs DB-driven dynamic playlists (Supabase table). Announcements: Discord/Twitch collab idea drafted, not automated.

llms.html: scattered notes, needs consolidation into one onboarding doc.

Left To Do (Major Features)

Frontend (HTML/CSS/JS) Modularize layout: finish all pages Shared nav/header/footer components. Centralized CSS variables/themes. JS modules for repeated logic (auth, API calls). Dashboard polish: unify nav + bar + dashboard. Profile update UI → connect to Supabase. FAQ, About Us, Contact Us pages. Sponsor Us, Hiring, Referral program sections. Bug report + tester signup page.

Backend (Supabase/DB) Playlist DB integration (replace hardcoded arrays). Forums setup (Supabase tables + UI). Referral program logic (track invites). Sales rep intake form → Supabase table. Admin todo list → Supabase table + dashboard view. Report section → Supabase table + moderation tools.

Integrations Discord: Announcements automation (subs → Nitro). Chat bridge (site ↔ Discord).

Twitch: Integration to show when users are live. Possibly piggyback off Discord presence.

YouTube: Playlist embedding or coded integration.

taskdump (repeating info) Rhyme highlighter started need api links genre finder-matcher → “What do I try next” feature. not started Merge & prep nav + bar + dashboard. Music playlist (YouTube embed OR Supabase-coded). Announcements (Twitch/Discord collab, Nitro subs). Build llms.html prompt/README of plans + guidelines. Profile update (frontend + backend). Admin todo list (site + DB). Forums setup. Referral program. Sales rep intake spot. Sponsor us section. Hiring section. Update FAQ. About Us page. Contact Us page. Report section. Bug testers signup. Chat bridge to Discord. Twitch integrations (live status, Discord piggyback).

with what apis Core Streaming & Catalog APIs Spotify API – Catalog, playlists, recommendations, user libraries

Apple Music API – Official catalog, charts, playlists

Deezer API – Streaming catalog, charts, playlists

Napster API – Metadata, streaming catalog

Audiomack API – Uploads, streams, playlists

Bandcamp API – Artist storefronts, releases

SoundCloud API – Uploads, streams, user libraries

Jamendo API – Free music catalog under Creative Commons

KKBOX API – Libraries, playlists, charts

JioSaavn API – Song info, album metadata

Lyrics & Metadata Musixmatch API – Lyrics, translations, sync data

Genius API – Lyrics + annotations

Lyrics.ovh / Lyrics Simple API – Lightweight lyric retrieval

LRCLIB API – Lyric sync data

MusicBrainz API – Open music encyclopedia

Discogs API – Vinyl, releases, metadata

TheAudioDB API – Artist/album metadata

Vagalume API – Lyrics + metadata

Artist & Fan Engagement Bandsintown API – Concert listings, fan notifications

Songkick API – Tour dates, venues

TasteDive API – Similar artist recommendations

Openwhyd API – Curated playlists from YouTube/SoundCloud

Last.fm API – Scrobbling, recommendations, charts

Mixcloud API – DJ mixes, radio shows

Phish.in API – Archive of live Phish recordings

Audio Tools & AI Freesound API – Free sound samples

Mubert API – AI-generated music streams

AI Mastering API – Automated mastering service

KSoft API – Lyrics + audio utilities

Genrenator API – Genre generation tool

Radio Browser API – Global radio streams

Data & Analytics Soundcharts API – Unified music industry data (35+ sources)

Bridge.audio APIs – Collaboration + licensing tools

7digital API – Music store catalog + previews
Career & Business Tools Smart contract licensing for beats/samples.

Royalty split calculator with instant blockchain execution.

Release radar predictor (best drop dates).

Fan subscription vault (exclusive stems, demos).

Dynamic merch designer (fans co‑create designs).

Collab finder (match artists by vibe + streaming data).

AI contract analyzer (flag bad clauses).

Tour budget simulator (predict profit/loss).

Sync licensing marketplace (TV/film placements).
Universal analytics dashboard (Spotify + TikTok + IG). Interactive vinyl (AR overlays when scanned). links to site-advanced

Base UI
From the creators of Radix, Floating UI, and Material UI, Base UI is an unstyled UI component library for building accessible user interfaces.

Documentation
To get started, check out the Base UI documentation.






NeverEndever-Portal v-0.5 repository map and action plan


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
