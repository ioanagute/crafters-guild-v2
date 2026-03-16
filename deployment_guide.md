# Deploying Crafters Guild to Cloudflare Workers

This project uses `@opennextjs/cloudflare` and must be deployed as a Cloudflare Worker. A Pages-only setup can produce a successful-looking deployment that still returns `404 Not Found`.

## 1. Confirm the expected deployment model

The repo is already configured for Workers:

- `package.json`
  - `build`: `opennextjs-cloudflare build`
  - `cf:deploy`: `opennextjs-cloudflare deploy`
- `wrangler.jsonc`
  - `main`: `.open-next/worker.js`
  - `assets.directory`: `.open-next/assets`

Do not treat this as a static Cloudflare Pages site.

## 2. Prepare the local environment

Before deploying, make sure:

- your latest code is pushed to GitHub if you want CI/CD from Git
- `.env.local` is not committed
- `CLOUDFLARE_API_TOKEN` is available when deploying with `wrangler`
- the following variables exist in your local environment and in Cloudflare:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Build the Worker locally

Run:

```bash
npm run build
```

This must generate:

- `.open-next/worker.js`
- `.open-next/assets`

If those files are missing, do not deploy yet.

## 4. Deploy with Wrangler

Run:

```bash
npm run cf:deploy
```

This deploys the OpenNext worker described by `wrangler.jsonc`.

If you are deploying from a terminal or CI runner, export a Cloudflare API token first:

```bash
set CLOUDFLARE_API_TOKEN=your-token-here
```

The token needs permissions for Workers deployment and zone/domain management if you will attach custom domains from automation.

Expected result:

- Cloudflare reports a successful Worker deployment
- you receive a Worker URL
- the Worker URL serves the app instead of Cloudflare's generic 404 page

## 5. Remove Pages and route conflicts in Cloudflare

In Cloudflare dashboard:

1. Open **Workers & Pages**.
2. Find any existing **Pages** project for this app.
3. Find the deployed **Worker** for this app.

Target state:

- one Worker deployment owns the app
- no Pages project is attached to `crafters-guild.com`
- no duplicate route or custom-domain binding exists for the same hostname

If a Pages project exists:

1. Open the Pages project.
2. Go to **Custom domains**.
3. Remove `crafters-guild.com` and `www.crafters-guild.com` from Pages.

If another Worker has a route like `crafters-guild.com/*`:

1. Open that Worker.
2. Go to **Settings** > **Domains & Routes** or **Triggers**.
3. Remove the conflicting route unless it belongs to this deployment.

## 6. Attach the custom domain to the Worker

After the Worker deployment succeeds:

1. Open the Worker in Cloudflare.
2. Go to **Settings** > **Domains & Routes**.
3. Add:
   - `crafters-guild.com`
   - optionally `www.crafters-guild.com`

If the domain is already managed by Cloudflare DNS, Cloudflare should create and manage the required DNS records automatically.

## 7. Validate in the correct order

Check these URLs in order:

1. the Worker deployment URL
2. `https://crafters-guild.com`
3. `https://www.crafters-guild.com` if configured

Interpretation:

- Worker URL works, custom domain 404s:
  - custom-domain binding or DNS conflict still exists
- Worker URL 404s:
  - the wrong product was deployed, or the Worker build output was not used
- root works but a specific route 404s:
  - this is likely an application routing issue, not a Cloudflare product mismatch

Use a private browser window while testing to avoid cached 404 responses.

## 8. Recommended Git-based deployment path

If you want automatic deployments from GitHub, keep the Worker model and configure CI/CD to run:

```bash
npm run build
npm run cf:deploy
```

Do not use a Pages-only pipeline for this repo.

This repository now includes a GitHub Actions workflow at `.github/workflows/deploy-worker.yml` that runs on Linux for pushes to `qa-test`.

Add these GitHub repository secrets before relying on it:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 9. Troubleshooting checklist

If you still get `404 Not Found`, verify all of the following:

- `npm run build` succeeds
- `.open-next/worker.js` exists
- `.open-next/assets` exists
- `npm run cf:deploy` succeeds
- `NEXT_PUBLIC_SUPABASE_URL` is set in Cloudflare
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set in Cloudflare
- no Pages project owns `crafters-guild.com`
- no stale Worker route captures `crafters-guild.com/*`
- Cloudflare DNS has no old A, AAAA, or CNAME records pointing elsewhere

## 10. Final cleanup

Once the Worker URL and `https://crafters-guild.com` both work:

- archive or delete the old Pages project
- remove stale `*.pages.dev` references from your notes
- keep only one Cloudflare deployment path for this app
