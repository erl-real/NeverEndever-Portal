https://docs.google.com/document/d/1-U9OHi55hidGQufDcnB9148OxhutzMHGD_xdZ_v9RW8/edit?usp=sharing

# NeverEndever-Portal
# Artist Portal

A simple artist profile portal using Supabase authentication and database.

## Setup
1. Create a Supabase project. done
2. Enable Email authentication. done
3. Create a `profiles` table with columns: done
   - `id` (uuid, primary key, references auth.users)
   - `username` (text)
   - `bio` (text)
4. Replace `SUPABASE_KEY` in `supabaseClient.js` with your anon key. done
5. Deploy to your hosting provider (e.g., Vercel, Netlify, Cloudflare Pages). done


---------------------------------------------------------------------

PLANS FULL

Music ELO Platform — Technical Guide
Purpose: A detailed, actionable guide to convert the current static site to a dynamic, database-driven music ELO platform with SongWars, server battles, profiles, digital unlockables, badges, marketplace trading, and artist showcase features.

Table of Contents
Executive Summary


Goals & Success Criteria


High-level Architecture


Feature Catalogue (Priority & MVP)


User Stories & Flows


Data Model (ER & Tables)


Authentication, Authorization & Roles


Matchmaking, SongWars & Server Battles (Workflows)


Match History, Scorekeeping & Auditing


Profiles & Artist Pages


Digital Content Unlocks & Badges System


Marketplace & Item Trading Design


API Design (REST/GraphQL) — Endpoints & Examples


Frontend Components & UX Patterns


Tech Stack Recommendations


Infrastructure, DevOps & Scaling


Payments, Escrow & Fraud Prevention


Moderation, Trust & Safety


Analytics, Metrics & Leaderboards


Admin Tools & Dashboards


Testing Strategy & QA


Migration Plan (Static → Dynamic)


Roadmap, Milestones & Estimates


Appendix A: Sample SQL Schema


Appendix B: Example API Calls


Appendix C: Badge Rules Examples


Appendix D: Glossary



1. Executive Summary
Build a competitive, esports-inspired music battler platform where users compete in SongWars and server battles. Platform must be social (profiles, follow, comments), transactional (marketplace), gamified (badges, unlockables), and reliable (scalable backend, secure payments). Start with an MVP that proves core gameplay and social features; iterate to add marketplace and advanced economy features.
2. Goals & Success Criteria
Reliable user authentication and profiles with music linking.


SongWars & server battle MVP: signups, matches, score history, match metadata, ELO adjustments.


Persisted match & player history with searchable logs.


Basic marketplace: list, buy, sell with platform custody (escrow) for MVP.


Badges/unlocks: awardable and displayable on profiles.


Admin moderation tools for content, disputes, and reporting.


Secure payment integration (PCI compliant via providers).


Success measured by: uptime, number of matches, marketplace volume, retention, and daily active users.
3. High-level Architecture
Frontend: SPA (React or Vue) with client-side routing, server-side rendering optional for SEO (Next.js / Nuxt).


Backend: REST or GraphQL API (Node.js w/ TypeScript + Express/Nest or Python/FastAPI). Microservices optional later.


Database: Relational DB (PostgreSQL) for core relational data; Redis for caching/rate-limiting; ElasticSearch for search; optional NoSQL for activity feeds.


File storage: S3-compatible (AWS S3) for images, audio, artwork, downloadable content.


Auth & Payments: Use Auth0/Clerk/Firebase Auth and Stripe/PayPal for payments; integrate KYC for high-value trades later.


Message queue: RabbitMQ or Kafka for decoupling (match result processing, notifications).


CDN: CloudFront or Cloudflare for asset delivery.


Observability: Prometheus + Grafana, Sentry for errors, Log aggregation (ELK).


4. Feature Catalogue (Priority & MVP)
MVP (Phase 1)
User accounts & login


Artist profile page


Song click-throughs already exist; integrate into dynamic pages


SongWars: signups, matchmaking, match metadata, score recording


ELO system & leaderboards


Match history per user & match detail pages


Basic badges & digital content unlocks


Admin dashboard for matches and users


Phase 2
Server Battles (guild/clan-based)


Marketplace (list/buy/sell) with escrow


Trading and item metadata


More badge/event-driven reward systems


In-app notifications & real-time features (WebSockets)


Phase 3
Tournament systems, brackets, scheduled events


Advanced monetization: subscriptions, limited drops, royalties


KYC and advanced fraud detection


5. User Stories & Flows
Provide concise stories grouped by persona.
Player: As a player, I want to sign up, create a profile, enter SongWars, view match history, earn badges, and link my streaming platforms so others can hear my music.
Organizer: As an organizer, I can create tournaments/server battles, set rules, view signups and payouts.
Artist: As an artist, I can showcase tracks, attach links (Spotify/Apple/SoundCloud/YouTube), and set items for sale.
Trader: As a trader, I want to list items for sale, buy items, and see my transaction history.
Admin: As an admin, I can moderate content, freeze accounts, inspect match logs, and issue badges manually.
6. Data Model (ER & Tables)
Key tables (Postgres):
users (id, username, email, password_hash, display_name, role, bio, created_at, last_seen, profile_image_url, social_links jsonb)


artists (id, user_id, stage_name, websites jsonb, featured_audio_url, verified boolean)


songs (id, title, artist_id, url, duration_seconds, metadata jsonb, created_at)


matches (id, type ENUM(‘songwar’,‘serverbattle’,‘tournament’), status ENUM(‘pending’,‘ongoing’,‘complete’,‘disputed’), start_at, end_at, rules jsonb, created_by_user_id)


match_participants (id, match_id, user_id, team_id nullable, signup_time, seed_rank)


match_results (id, match_id, participant_id, score, rank, details jsonb, recorded_at)


elo_ratings (id, user_id, rating, k_factor, last_updated)


servers (id, name, owner_user_id, metadata jsonb) — for server battles


badges (id, slug, name, description, criteria jsonb, image_url)


user_badges (id, user_id, badge_id, awarded_at, awarded_by)


digital_items (id, title, description, type ENUM(‘avatar’,‘music_pack’,‘token’,‘ticket’), metadata jsonb, supply integer, creator_user_id)


market_listings (id, item_id, seller_id, price_cents, currency, status ENUM(‘active’,‘sold’,‘cancelled’), created_at)


transactions (id, listing_id, buyer_id, seller_id, amount_cents, fee_cents, status, payment_processor_id, created_at)


notifications (id, user_id, type, payload jsonb, read boolean, created_at)


reports (id, reporter_id, target_type, target_id, reason, metadata jsonb, status)


audit_logs (id, actor_id nullable, action_type, target_table, target_id, details jsonb, created_at)


Notes:
Use jsonb for flexible fields (rules, metadata) but avoid overuse for data you will query frequently.


Index: add btree and gin indexes as needed (e.g., users(username) unique, songs(title gin_trgm_ops) for fuzzy search).


7. Authentication, Authorization & Roles
Roles: user, artist, moderator, admin, organizer
Auth choices: Auth0, Clerk, or custom JWT-based auth with refresh tokens. Use secure password hashing (Argon2/Bcrypt), email verification, two-factor authentication optional.
Authorization: Role-based access control (RBAC) and resource-level checks. Example: only organizer or admin can create a tournament; sellers can cancel own listings.
Session & Token handling: short-lived access tokens, refresh tokens with rotating refresh tokens. Store revocation list for logout and ban.
8. Matchmaking, SongWars & Server Battles (Workflows)
Signup flow: Player clicks “Join” → matches match_participants entry created with status “signed_up” → organizer confirms or auto-accepts based on rules.
Match start: When match threshold reached or scheduled start time hits, the system transitions matches.status to ongoing, notifies participants.
Match result submission: Support multiple result sources:
Manual judge input (web form)


Crowd voting (weighted rules)


Automated scoring (if available)


Result processing: On result finalization:
Write match_results rows atomically.


Calculate new ELOs (use transactional processing & a message queue to avoid blocking HTTP requests).


Update leaderboards and award badges.


Emit notifications and webhooks.


Disputes: Mark match status='disputed' and freeze ELO changes until resolution. Admins can review audit_logs and raw vote data.
9. Match History, Scorekeeping & Auditing
Record raw votes/scores in match_results.details with timestamps and voter IDs (or anonymize as per GDPR).


Keep an audit_logs table capturing who recorded each action.


Ability to export match history (CSV/JSON) for transparency and moderation.


10. Profiles & Artist Pages
Profile sections:
Header (display image, stage name)


Quick stats (rating, rank, wins/losses, badges)


Featured tracks (link clickable to existing song pages)


Portfolio (albums, singles)


Shop (digital items)


Social links & buy/stream links


Make profiles shareable and SEO-friendly. Provide an “embed player” widget for tracks.
11. Digital Content Unlocks & Badges System
Badges
Badges have criteria stored as JSON (e.g., {“type”:“wins”,“threshold”:10}).


Badge awarding engine runs after relevant events (match complete, sale complete). Implement a rules engine (simple cron or event-driven microservice) to evaluate badge criteria.


Digital Unlocks
Types: avatar frames, exclusive tracks, tickets, discounts.


Unlocks tied to user_id and stored in user_entitlements table.


Consider DRM or tokenized access (signed URLs or short-lived tokens) to protect premium assets.


12. Marketplace & Item Trading Design
Core flows
Listing creation: seller creates listing, platform validates item ownership and sets market_listings.status='active'.


Purchase: Buyer pays via Stripe/processor; transaction records created; funds held in escrow until delivery conditions met.


Delivery: For digital items, deliver signed download URL or credit user inventory. For virtual items on-platform, change ownership in DB.


Fees: Platform takes a configurable fee percentage stored in config.


Security & Fraud
Rate-limit listings and purchases, require email/phone verification for high-value trades, implement chargeback handling.


Keep KYC for high volume or real-money withdrawals.


Trading specifics
Support direct trades (swap) and fixed-price listings. For auctions, store bid history with timestamps.


Consider implementing an orderbook for advanced economy later.


13. API Design (REST/GraphQL) — Endpoints & Examples
Design principles: version your API (v1), keep consistent resource naming, use pagination, return HATEOAS links where helpful.
Examples (REST)
POST /api/v1/auth/register — create account


POST /api/v1/auth/login — returns JWT


GET /api/v1/users/:id — public profile


PUT /api/v1/users/:id — update profile (auth required)


GET /api/v1/matches — list matches (filters: type, status)


POST /api/v1/matches — create match (organizer)


POST /api/v1/matches/:id/signup — join match


POST /api/v1/matches/:id/result — submit result (authorized judges / system)


GET /api/v1/matches/:id/history — full match history


GET /api/v1/leaderboards — global or filter by server


POST /api/v1/market/listings — create listing


POST /api/v1/market/listings/:id/buy — buy item


Return consistent error codes and include X-Request-ID header for traceability.
14. Frontend Components & UX Patterns
Core pages/components:
Landing / Explore with featured matches/tournaments


Profile page with modular cards


Match detail page with timeline, participants and raw votes


Match signup modal with rules preview


Marketplace storefront and item detail page


Notifications panel and inbox


Admin dashboard with quick actions


Real-time: Use WebSockets or server-sent events for live match updates and chat. Use optimistic UI for marketplace purchases with rollback on failure.
Accessibility: Ensure keyboard nav, alt text, color contrast for badges, and screen reader compatibility.
15. Tech Stack Recommendations
Frontend: Next.js (React) or Vue + Nuxt, TypeScript, Tailwind CSS. Use React Query or SWR for data fetching.
Backend: Node.js + TypeScript with NestJS (structure & DI) or FastAPI (Python). Use Prisma or TypeORM/Sequelize for DB ORM.
DB: PostgreSQL. Redis for caching and ephemeral state.
Realtime: Socket.IO or Phoenix Channels. Use Postgres LISTEN/NOTIFY for some events.
Payments/Auth: Stripe, Auth0/Clerk.
Hosting: Vercel for frontend and AWS/GCP (ECS/EKS or managed services) for backend. RDS for Postgres.
16. Infrastructure, DevOps & Scaling
Start mono-repo with CI/CD (GitHub Actions). Run unit & integration tests in CI.


Use IaC: Terraform for infra provisioning.


Autoscaling for backend services. Use read replicas for heavy read loads.


Backups: daily DB snapshots, point-in-time recovery for critical data.


Disaster recovery plan and runbooks.


17. Payments, Escrow & Fraud Prevention
Use Stripe Connect for marketplace payouts.


Implement escrow logic: hold funds in platform account, release on delivery or after dispute window.


Monitor chargebacks; keep transaction logs and proof of delivery.


For withdrawals, enforce verification and payout limits.


18. Moderation, Trust & Safety
Allow user reporting of matches, comments, and items.


Auto-moderation: profanity filters, rate-limits, image moderation (3rd party APIs).


Manual moderation tools: content queues, ban/unban, audit trails.


Community guidelines and clear dispute resolution steps.


19. Analytics, Metrics & Leaderboards
Track events: match_started, match_ended, match_joined, buy_listing, award_badge.
Suggested KPIs: DAU/MAU, matches/day, matches per user, marketplace GMV, retention at 7/30/90 days.
Leaderboards: compute daily/weekly/monthly leaderboards via scheduled jobs. Use incremental aggregation to avoid heavy queries.
20. Admin Tools & Dashboards
User management (view, ban, reset password, impersonate)


Match inspector: view raw votes, timeline, logs


Marketplace manager: remove listings, refund transactions


Badge manager: create/modify badge criteria


Analytics dashboard (Grafana/Metabase)


21. Testing Strategy & QA
Unit tests for critical business logic (ELO calc, result processing).


Integration tests for API flows (signup → join match → result → ELO change).


Load testing for matchmaking and marketplace flows.


Security testing (OWASP Top 10 scan) and pen testing before public launch.


22. Migration Plan (Static → Dynamic)
Inventory current static content and URLs (songs already clickable).


Provision staging environment with DB.


Implement auth and user table; migrate any user-like data.


Replace clickable song routes with dynamic route handlers; ensure redirects maintain SEO.


Deploy in feature-flagged manner: roll out user registration first, then matches, then marketplace.


Run data validation scripts and smoke tests.


23. Roadmap, Milestones & Estimates
Sprint 0 (2 weeks): Setup repo, CI/CD, infra, DB schema, basic auth.
Sprint 1 (4 weeks): Profiles, song dynamic pages, basic match create/signups.
Sprint 2 (4 weeks): Match result processing, ELO, history, leaderboards.
Sprint 3 (4 weeks): Badges & unlocks, admin tools.
Sprint 4 (4 weeks): Marketplace MVP (list/buy), payments integration.
Polish (2-4 weeks): Load testing, bug fixes, security, documentation.
Adjust based on your team size. These are rough; split into 2-week sprints.
24. Appendix A: Sample SQL Schema (Postgres)
-- users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text,
  display_name text,
  role text NOT NULL DEFAULT 'user',
  bio text,
  profile_image_url text,
  social_links jsonb,
  created_at timestamptz DEFAULT now(),
  last_seen timestamptz
);

-- songs
CREATE TABLE songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist_id uuid REFERENCES users(id),
  url text NOT NULL,
  duration_seconds int,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- matches
CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  rules jsonb,
  start_at timestamptz,
  end_at timestamptz,
  created_by_user_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- match participants
CREATE TABLE match_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id),
  user_id uuid REFERENCES users(id),
  team_id uuid,
  signup_time timestamptz DEFAULT now(),
  seed_rank int
);

-- match results
CREATE TABLE match_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id),
  participant_id uuid REFERENCES match_participants(id),
  score numeric,
  rank int,
  details jsonb,
  recorded_at timestamptz DEFAULT now()
);
25. Appendix B: Example API Calls (cURL)
# Register
curl -X POST https://api.example.com/v1/auth/register -d '{"username":"beatlord","email":"b@x.com","password":"..."}'

# Login
curl -X POST https://api.example.com/v1/auth/login -d '{"email":"b@x.com","password":"..."}'

# Create match
curl -H "Authorization: Bearer $TOKEN" -X POST https://api.example.com/v1/matches -d '{"type":"songwar","rules":{"format":"1v1","vote_type":"audience"}}'
26. Appendix C: Badge Rules Examples
Rising Star: 10 wins in ranked matches.


Crowd Favorite: 1000 cumulative votes across matches.


Market Maker: First 10 sales as a creator.


Store as JSON: { "metric":"wins","scope":"ranked","threshold":10 }.
27. Appendix D: Glossary
ELO: Rating algorithm to rank players.


GMV: Gross merchandise volume (marketplace sales total).


MVP: Minimum viable product.



Next steps for your team
Review this doc with engineering, product, and ops. Prioritize the MVP features and pick a tech stack.


I recommend starting a repo and implementing Sprint 0 items.



Document generated to serve as a starting technical plan. Request edits and I will refine the guide to match your exact needs (team size, preferred stack, compliance needs).

