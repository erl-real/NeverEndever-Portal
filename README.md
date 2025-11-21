:white_check_mark: What’s Done (Foundations)
Supabase connected for storage/auth (but not fully modularized).

Cloudflare hosting set up (site deploys, but code not modular).

GitHub repo exists (version control in place).

Basic UI elements: nav bar, dashboard skeleton, some profile pages.

Music player widget: initial playlist integration (but hardcoded, not dynamic).

Discord server: exists for community, but not linked to site.

:yellow_circle: In Progress / Needs Refactor
File structure: currently duplicated code across pages → needs modular components (shared header/footer/nav).

Nav + dashboard merge: partially built, but not unified.

Profile update system: UI exists, backend not wired.

Admin todo list: concept exists, not implemented.

Music playlist: coded version exists, but needs DB-driven dynamic playlists (Supabase table).

Announcements: Discord/Twitch collab idea drafted, not automated.

Prompt/README: scattered notes, needs consolidation into one onboarding doc.

:red_circle: Left To Do (Major Features)
Frontend (HTML/CSS/JS)
Modularize layout:

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

:clipboard: Organized To-Do Dump (Actionable List)
Rhyme highlighter / genre finder-matcher → “What do I try next” feature.

Merge & prep nav + bar + dashboard.

Music playlist (YouTube embed OR Supabase-coded).

Announcements (Twitch/Discord collab, Nitro subs).

Build prompt/README of plans + guidelines.

Real file/nav structure (modularize).

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

:jigsaw: Best Practices to Prevent Duplication
Componentize everything:

Nav, footer, dashboard → one file, imported everywhere.

Centralize config:

API keys, endpoints, constants → one JS config file.

Database-driven content:

FAQs, announcements, playlists → Supabase tables, not hardcoded HTML.

CSS variables/themes:

Colors, gradients, fonts → one file, referenced everywhere.

Reusable JS modules:

Auth, API calls, error handling → one place. 
