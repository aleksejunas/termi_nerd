
Short answer: moving off Supabase is doable. The hassle depends on what parts of Supabase you use (Auth, Storage, RPC). From your code,
you use Auth, Storage, and simple Postgres queries plus a couple of RPCs — no Realtime — so the migration is moderate, not huge.

Options

- Stay on Supabase
    - Pros: Zero code changes.
    - Cons: Free tier pauses; DNS breaks the app until manual resume.
    - Variants: Self-host Supabase (Fly.io/Docker) to avoid pauses; small ops overhead, minimal code change.
    - Variants: Self-host Supabase (Fly.io/Docker) to avoid pauses; small ops overhead, minimal code change.
-
Neon (+ split services)
    - What you get: Always-available Postgres with cold starts but no DNS blackhole.
    - Replacements:
    - DB: Neon + Drizzle/Kysely.
    - Auth: Clerk/Auth0/Stytch (best for SPA); or Lucia if you add a tiny backend.
    - Storage: UploadThing/ImageKit/S3/R2 (needs a tiny backend for signed uploads).
- Pros: No pausing, best-of-breed, scalable.
- Cons: You replace Supabase Auth/Storage; add a minimal API for writes/uploads.
-
Cons: You replace Supabase Auth/Storage; add a minimal API for writes/uploads.
-
Firebase (Auth + Storage + Firestore)
    - Pros: Single provider, never sleeps, generous free tier.
    - Cons: Rewrite DB layer to Firestore; larger change than Neon for SQL-centric code.
-
Nhost/Hasura or CockroachDB
    - Pros: Postgres-ish stack with free tiers that don’t “pause”.
    - Cons: Still need to swap Auth/Storage or their equivalents; similar effort to Neon.

Effort Estimate

- Self-host Supabase: 0.5–1 day (infra setup), minimal code change.
- Neon + Clerk + UploadThing + tiny API (Hono/Express/Cloudflare Worker):
    - Backend: 1–2 days (DB schema import, API endpoints, upload signer).
    - Frontend: 1–2 days (replace supabase calls with fetch/react-query hooks; swap auth provider; update upload component).
- Firebase: 2–5 days (data model + queries rewrite).

Recommendation

- If you want minimal code churn: self-host Supabase so it never pauses.
- If you want to de-vendor-lock and keep SQL: Neon + Drizzle + Clerk + UploadThing. Your app’s usage (auth, basic CRUD, image upload, a
couple of RPCs) fits this well.

High-Level Neon Migration Plan

- Export schema/data from Supabase and import to Neon.
- Add Drizzle/Kysely models and connect to Neon.
- Pick auth (Clerk/Auth0). Replace supabase.auth.* with provider hooks; update AdminRouteGuard and header logic.
- Add a tiny API for:
    - Posts CRUD and tag lookups (replacing supabase.from and RPCs).
    - Upload signer endpoint (for S3/R2/ImageKit/UploadThing).
- Swap frontend data access: convert supabase.* calls to API calls via react-query hooks.
- Replace storage usage in ImageUploader and admin pages with the new upload flow.
- Keep route structure and UI intact.

Want me to draft a focused migration PR? I can:

- Start by abstracting data access into a src/api layer and swap reads first (lowest risk).
- Stand up a minimal Hono/Express API (or Cloudflare Worker) with Neon + Drizzle.
- Integrate Clerk for SPA auth and wire the guard.

user
i like firebase as a product, but I would rather be free of using big tech as much as I can

codex
Got it — avoiding big-tech lock-in and “pausing” points to self‑hosting or a lightweight open‑source backend.

Best Paths

- Self‑host Supabase: Same APIs you use now (Auth, Storage, Postgres). Minimal code changes, no pausing. Ops: Docker on a small VPS.
- PocketBase: Single binary, built‑in Auth + file storage + realtime. Simple ops, but requires replacing all Supabase calls.

Self‑Host Supabase

- Why: Keeps your current code almost intact; you control uptime.
- What you run: Postgres + Auth + Storage (MinIO) + APIs via the official docker-compose.
- Steps:
    - Provision a small VPS (e.g., Hetzner/DigitalOcean, 1–2 vCPU, 2–4GB RAM).
    - Deploy supabase/supabase docker-compose with your domain behind Caddy/Traefik (HTTPS).
    - Set JWT secret, anon/service role keys, SMTP for emails.
    - Import DB: pg_dump from your current Supabase → restore to your instance.
    - Migrate Storage: sync buckets (MinIO to MinIO/S3). If minimal, re-upload via admin tooling.
    - Update env: VITE_SUPABASE_URL to your domain; swap anon key.
- Effort: ~0.5–1 day infra, near‑zero code change.
- Cost: ~€5–10/mo VPS; no provider sleeping.

PocketBase

- Why: Tiny footprint, zero pausing, dead simple ops.
- What changes:
    - Define collections: posts, tags, post_tags, guestbook, users/roles.
    - Replace supabase.* with PB SDK/REST; rewrite queries/RPCs to filters/relations.
    - Image uploads to PB’s storage; keep your uploader UI.
    - Auth guards: PB auth in Header, AdminRouteGuard.
- Effort: 2–4 days for model setup + migration + code swaps.
- Cost: Your VPS (or even a tiny instance).

Hybrid (DIY)

- Postgres (self‑host) + tiny API (Hono/Fastify) + Lucia Auth + MinIO/S3.
- Max control, but you’ll build auth flows and signed uploads.
- Effort: 3–6+ days initial.

Code Prep To Ease Any Migration

- Introduce a thin data‑access layer now, keeping UI intact:
    - Add src/api/ with functions: auth.getSession/signIn/signOut, posts.list/get/create/update, tags.list/bySlug, guestbook.*, admin.*.
    - Switch components/hooks to call this layer (internally still uses Supabase).
    - Later, swap the implementation to PocketBase or your API without touching UI.
- Also add a tiny storage.uploadImage/getPublicUrl wrapper.

If you want, I can:

- Create the src/api layer and refactor a couple of key screens (Blog, Auth, Admin uploads) to use it.
- Or draft infra steps (compose + Caddy config) for self‑hosting Supabase.

Which path do you want to pursue: self‑host Supabase (minimal churn) or PocketBase (lean, simple ops)?

user
how is mongodb as an alternative?

codex
MongoDB can work, but for your app it’s a bigger shift than sticking with Postgres/Supabase.

Fit For This App

- You use relational patterns (posts ↔ tags many-to-many, a few RPCs). Postgres maps naturally; MongoDB needs denormalization or $lookup
pipelines.
- Migration effort is higher than self-hosting Supabase or plain Postgres.

Pros

- Self-hostable, no pausing; simple Docker ops.
- Flexible document model; great Node driver + Mongoose ODM.
- Aggregation pipeline is powerful; built-in full‑text search; TTL indexes; change streams.

Cons

- No built‑in Auth/Storage: you must add Lucia/Clerk/Auth0 and S3/MinIO (or use Atlas App Services = vendor lock-in).
- Many‑to‑many and joins are clunkier; you manage consistency manually or with transactions (replica set).
- You’ll rewrite data access (queries, RPCs) and reshape schemas; more code churn than Postgres.

If You Choose Mongo

- Backend: small API (Hono/Fastify/Express) with Mongoose models (posts, tags, optional post_tags or embed tag IDs on posts).
- Auth: Lucia (Mongo adapter) + cookie sessions; replace supabase.auth.* in Header and AdminRouteGuard.
- Storage: MinIO/S3 with pre‑signed upload endpoint; replace supabase.storage in ImageUploader.
- Frontend: introduce src/api/* wrappers (auth, posts, tags, uploads) and refactor components to use them.
- Data: migrate from Postgres with a one‑off script; add indexes on slug, tags, published_at; optional full‑text index for search.

Recommendation

- Least hassle, avoids pausing: self‑host Supabase (or Postgres + PostgREST/Hasura/tiny API). Minimal code changes.
- MongoDB is solid, but choose it only if you want a document model and are okay with a broader refactor (auth + storage + queries).
- Also consider PocketBase (self‑host, built‑in Auth + file storage) if you want simpler ops with more integrated features than Mongo.

If you want, I can:

- Add the src/api layer now (makes any backend swap easier), or
- Outline a Docker compose for self‑hosted Supabase, or
- Sketch the Mongo schemas and minimal API routes to target.
