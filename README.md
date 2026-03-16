# Crafters Guild V2

Single-repo Next.js application for a medieval-fantasy crafting marketplace backed by Supabase auth, data, and realtime.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Supabase SSR and browser clients
- TypeScript
- Vitest for module-level tests

## Architecture

- `src/app/`
  Route composition only.
- `src/features/<feature>/server/`
  Server-side data access, mapping, validation, and business rules.
- `src/features/<feature>/actions/`
  Server actions used by forms and mutations.
- `src/features/<feature>/types/`
  Shared typed contracts between server modules and UI.
- `src/lib/`
  Shared auth, database typing, form parsing, action result, form action state, and error helpers.
- `supabase/migrations/`
  Canonical schema history.
- `supabase/seed.sql`
  Optional seed data for default guilds.

Pages should compose feature data. Components should consume typed DTOs, not raw Supabase rows.
Recoverable form failures should render inline on the originating page. Redirects are reserved for auth, session, and role failures.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment values into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Provision the database in Supabase:

- Apply the SQL in `supabase/migrations/20260316000100_initial_schema.sql`
- If you already have an existing Supabase project, apply `supabase/migrations/20260316000200_align_existing_projects.sql` instead of the baseline reset file
- Optionally apply `supabase/seed.sql` to load starter guilds

4. Start the app:

```bash
npm run dev
```

## Commands

- `npm run dev`
  Start the local development server
- `npm run lint`
  Run ESLint
- `npm run test`
  Run Vitest
- `npm run build`
  Run the Cloudflare production build and generate `.open-next/worker.js`
- `npm run build:next`
  Run a plain Next.js production build without Cloudflare packaging
- `npm run cf:deploy`
  Deploy the prebuilt OpenNext worker with Wrangler
- `npm run cf:preview`
  Preview the Cloudflare worker locally with Wrangler

## Cloudflare Deployment

For Cloudflare Workers continuous deployment, configure the project with:

- Build command: `npm run build`
- Deploy command: `npm run cf:deploy`

`npm run build` runs the OpenNext Cloudflare adapter, which generates `.open-next/worker.js` and `.open-next/assets`. Without that step, `wrangler` will fail because the worker entrypoint does not exist.

## Quality Gates

- All changes are expected to pass:
  - `npm run lint`
  - `npm run test`
  - `npm run build`
- GitHub Actions runs the same checks in `.github/workflows/ci.yml`

## Route Map

- `/`
  Landing overview
- `/login`
  Login and signup
- `/marketplace`
  Browse marketplace listings
- `/marketplace/new`
  Create listing for artisans
- `/marketplace/my-listings`
  Manage owned listings
- `/marketplace/[id]/edit`
  Edit owned listing
- `/guilds`
  Guild directory
- `/guilds/[id]`
  Guild detail and member roster
- `/profile`
  User profile and guild affiliation
- `/tavern`
  Noticeboard plus ephemeral realtime chat
- `/error`
  Shared error page

## Roles

- `patron`
  Default member role
- `artisan`
  Can create and manage marketplace listings
- `apprentice`
  Reserved in the schema and UI contract, not yet given special behavior

## Database Notes

- `profiles.guild_id` is part of the canonical schema and is no longer patched in separately
- `supabase/migrations/20260316000200_align_existing_projects.sql` is the safe patch-style migration for existing Supabase projects
- Root SQL files `supabase_schema.sql` and `add_guilds.sql` are kept only as deprecation markers
- `src/lib/database.types.ts` is the shared application-side database contract and should be updated alongside schema changes
- RLS currently allows:
  - public reads for profiles, guilds, products, and posts
  - owner-only profile/product/post mutations
  - artisan-only product creation

## Tests

Current automated coverage focuses on:

- marketplace input validation
- marketplace action behavior and ownership failures
- tavern post validation
- tavern action behavior and ownership failures
- guild membership state derivation
- profile input normalization
- profile action success flow

These tests are intended as the baseline pattern for future feature work.

## Contributor Rules

- Pages compose feature data only.
- Feature server modules own business logic and Supabase access.
- Server actions validate input first and return inline form state for recoverable failures.
- Redirects are only for auth/session/role failures or intentional post-success navigation.
- Components should consume DTOs or action state, not raw database rows.
