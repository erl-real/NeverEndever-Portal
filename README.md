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

## License

This project is licensed under the terms of the [MIT license](/LICENSE).
