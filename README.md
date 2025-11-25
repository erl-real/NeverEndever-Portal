<link rel="stylesheet" href="/styles/global.css">
   <script src="/scripts/stateManager.js"></script>
   <script src="/scripts/utils.js"></script>
   <script src="/scripts/authManager.js"></script>


What?
www.neverendever.com v1.0 full platform launch

how we are doing it
Centralize config:
API keys, endpoints, constants → one .JS config file. (unless seperated for a reason like elo)

Database-driven content:
FAQs, announcements, playlists → Supabase tables or googlesheets or thirdparty hosting (yt), not hardcoded HTML if a free path.

CSS variables/themes:
Colors, gradients, fonts → one file, referenced everywhere.
each page can have a color.css for personilizing pages

Reusable JS modules:
Auth, API calls, error handling → one place. 


why
fast loading less network calls
stays loaded between pages
ez to edit parts to change whole




What’s Done
Supabase connected for storage/auth (but not fully modularized).
Cloudflare hosting set up (site deploys, but code not modular).
GitHub repo exists (version control not in place,build on portal settle on depo frame).
Basic UI elements: installed not using yet
Music player widget: initial playlist integration (but hardcoded, not dynamic).
Discord server: not linked to site.
File structure: done

In Progress / Needs Refactor
Nav + dashboard merge: redesining.
Profile update system: redesign around settings and save state
simple Admin todo list readme: concept exists, not implemented.
Music playlist: coded version exists, but needs DB-driven dynamic playlists (Supabase table).
Announcements: Discord/Twitch collab idea drafted, not automated.

llms.html: scattered notes, needs consolidation into one onboarding doc.

Left To Do (Major Features)

Frontend (HTML/CSS/JS)
Modularize layout: finish all pages
Shared nav/header/footer components.
Centralized CSS variables/themes.
JS modules for repeated logic (auth, API calls).
Dashboard polish: unify nav + bar + dashboard.
Profile update UI → connect to Supabase.
FAQ, About Us, Contact Us pages.
Sponsor Us, Hiring, Referral program sections.
Bug report + tester signup page.

Backend (Supabase/DB)
Playlist DB integration (replace hardcoded arrays).
Forums setup (Supabase tables + UI).
Referral program logic (track invites).
Sales rep intake form → Supabase table.
Admin todo list → Supabase table + dashboard view.
Report section → Supabase table + moderation tools.

Integrations
Discord:
Announcements automation (subs → Nitro).
Chat bridge (site ↔ Discord).

Twitch:
Integration to show when users are live.
Possibly piggyback off Discord presence.

YouTube:
Playlist embedding or coded integration.

taskdump (repeating info)
Rhyme highlighter started need api links
genre finder-matcher → “What do I try next” feature. not started
Merge & prep nav + bar + dashboard.
Music playlist (YouTube embed OR Supabase-coded).
Announcements (Twitch/Discord collab, Nitro subs).
Build llms.html prompt/README of plans + guidelines.
Profile update (frontend + backend).
Admin todo list (site + DB).
Forums setup.
Referral program.
Sales rep intake spot.
Sponsor us section.
Hiring section.
Update FAQ.
About Us page.
Contact Us page.
Report section.
Bug testers signup.
Chat bridge to Discord.
Twitch integrations (live status, Discord piggyback).

-0--------------------------
code bits

<link rel="stylesheet" href="/styles/global.css">
   <script src="/scripts/stateManager.js"></script>
   <script src="/scripts/utils.js"></script>
   <script src="/scripts/authManager.js"></script>





--------------------------------






# Base UI

From the creators of Radix, Floating UI, and Material UI, Base UI is an unstyled UI component library for building accessible user interfaces.

---

## Documentation

To get started, check out the [Base UI documentation](https://base-ui.com/react/overview/quick-start).

## Contributing

Read our [contributing guide](/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build and test your changes.

## Releases

To see the latest updates, check out the [releases](https://base-ui.com/react/overview/releases).

## Community

- **Discord** For community support, questions, and tips, join our [Discord](https://discord.gg/g6C3hUtuxz).
- **X** To stay up-to-date on new releases and announcements follow [Base UI on X](https://x.com/base_ui).
- **Bluesky** We're also on [Bluesky](https://bsky.app/profile/base-ui.com).

## Team

- **Colm Tuite** (Radix) [@colmtuite](https://x.com/colmtuite)
- **James Nelson** (Floating UI) [@atomiksdev](https://x.com/atomiksdev)
- **Michał Dudak** (Material UI) [@michaldudak](https://x.com/michaldudak)
- **Marija Najdova** (Material UI + Fluent UI) [@marijanajdova](https://x.com/marijanajdova)
- **Albert Yu** (Material UI) [@mj12albert](https://github.com/mj12albert)
- **Lukas Tyla** (Material UI) [@LukasTy](https://github.com/LukasTy)



----------------------------------------
todo list


Foundation verification
Repo directories: Verify and lock the presence of all core directories; add missing ones and remove unused stubs.

Configs: Validate every config file loads and is referenced in build/test; remove deprecated config keys.

Docs baseline: Ensure README, CONTRIBUTING, SECURITY, LICENSE, CHANGELOG exist and are linked from README.

Security hardening
Secret hygiene: Remove committed secrets, add .env.example, enforce .gitignore, and run a secret scan on history.

Input defenses: Add validation, sanitization, and rate‑limiting for all endpoints and forms.

Session safety: Implement secure cookies or tokens with rotation, expiration, and refresh flows.

Transport & headers: Enforce HTTPS, add CSP, HSTS, X‑Frame‑Options, X‑Content‑Type‑Options, and CORS rules.

Design system consolidation
CSS architecture: Create global.css, variables.css, and component CSS; move page overrides out of globals.

Variable coverage: Define tokens for colors, typography, spacing, radius, elevation, and breakpoints.

Theming: Implement dark mode and theme switching via CSS variables.

Legacy cleanup: Remove inline styles and duplicated rules; add utilities for spacing, layout, and states.

Navigation and UI consolidation
Single sidebar: Merge navigation artifacts into one modular sidebar component.

Full coverage: Wire every page into the sidebar with SVG links; ensure logical order for onboarding.

Accessibility: Add ARIA labels, focus states, keyboard navigation, and unique IDs.

Interaction consistency: Standardize hover/glider behaviors and test across all pages.

Data integration
Supabase tables: Migrate playlists, FAQs, and announcements to DB with schemas and constraints.

CRUD flows: Implement admin CRUD with optimistic UI and server validation.

Profile management: Modularize profile read/write, avatar/handle updates, and error states.

External signals: Automate Discord announcements, Twitch live status, and dynamic YouTube embeds via DB references.

Documentation and onboarding
Unified guide: Convert notes into a single onboarding document covering setup, env, build, and deploy.

Design system docs: Document components, tokens, patterns, and usage rules.

UI map: Provide page‑to‑component mapping and navigation structure for staff and collaborators.

Runbooks: Add auth, deployment, and incident playbooks for operations.

Testing and CI/CD
Unit & integration: Write tests for auth, nav, playlists, forms, and DB interactions.

Visual checks: Add CSS/visual regression tests for critical components.

Pipelines: Run lint, format, tests, security scans, and build on every PR; gate merges on passing status.

Artifacts: Produce preview builds with deployment diffs and test reports.

Deployment configuration
Netlify functions: Validate routing, environment injection, and cold start performance.

Routing rules: Confirm redirects and headers in netlify.toml.

Edge/CDN: Document Cloudflare caching, purge strategy, and security rules.

Reproducible builds: Standardize scripts and lock versions for deterministic output.

Feature completion
Admin dashboard: Deliver full CRUD for playlists, FAQs, announcements, users, with RBAC tiers.

Music player: Integrate DB‑driven playlists, support YouTube/SoundCloud/local, and add queue/persistence.

Community tools: Moderation actions, flagged content review, and audit logs.

Advanced authentication
MFA: Add TOTP or WebAuthn for high‑risk actions and login.

OAuth: Integrate Google, Discord, and Twitch providers.

Recovery flows: Implement password reset, account recovery, and device management.

Token lifecycle: Harden refresh token rotation and revoke on anomaly.

Performance and scalability
Bundles: Apply tree‑shaking, code splitting, and asset compression.

Lazy loading: Defer heavy components (player, dashboards) and images.

DB tuning: Add indexes, optimize queries, and enforce limits/pagination.

Edge caching: Cache static assets and safe API responses with versioned keys.

Observability and monitoring
Structured logging: Add contextual logs for auth, DB, and external integrations.

Error tracking: Integrate an error tracker with release sourcemaps and alerting.

Performance SLOs: Track Web Vitals, set budgets, and fail CI on regression.

Uptime: Monitor endpoints and deploys; add alerts and on‑call rotations.

UX and accessibility
WCAG compliance: Audit and fix issues to meet 2.1 AA.

Keyboard & screen readers: Ensure full functionality without a mouse and with assistive tech.

Onboarding refinement: Guided steps, tooltips, and progressive disclosure.

Responsive design: Validate layouts across breakpoints and devices.

Branding and creative layer
Visual polish: Apply gradients, palettes, and consistent component styling.

Interaction quality: Smooth transitions and micro‑interactions aligned with brand.

Theme readiness: Prepare for seasonal or partner themes via token swaps.

Governance and operations
ADRs: Record major architectural decisions and tradeoffs.

Contribution rules: Define review standards, branching, and semantic versioning.

Release management: Automate changelogs, tags, and release notes.

Security practices: Regular audits, dependency updates, and incident response procedures.

Community rollout
Pilot launch: Release to a controlled group; gather structured feedback.

Iteration: Address issues found in pilot; ship fixes against tracked SLOs.

Public launch: Announce broadly with stable features and support channels.

Engagement: Enable comments, sharing, and community events with moderation.

Growth and monetization
Integrations: Evaluate adding Spotify, Bandcamp, or partners via clean abstractions.

Plans: Define premium tiers, subscriptions, or sponsorships with clear value.

Analytics: Build admin dashboards for engagement, retention, and revenue metrics.

Scalability reviews: Schedule periodic performance and security reviews.

Completion criteria (exit checklist)
Zero known critical bugs: No open P0/P1 issues; lower‑priority items triaged with dates.

Security clean bill: No exposed secrets, passing audits, least‑privilege validated.

Design system enforced: All UI uses documented components and tokens; no ad‑hoc styles.

Accessibility met: WCAG 2.1 AA verified with audit evidence.

Tests green: Coverage thresholds met; CI gates protect main; rollback tested.

Docs complete: Onboarding, runbooks, ADRs, API, and UI maps current and accurate.

Performance within budgets: Web Vitals pass, bundle sizes within targets, DB queries optimized.

Monitoring in place: Alerts, dashboards, and logging confirm operational health.

Release process stable: Versioned, repeatable deployments with staging and rollback.

User feedback addressed: Pilot and public launch issues resolved; engagement features active.

