# API (Discord webhooks)

Serverless functions that post to Discord. Deploy the `api/` folder to Vercel so the webhook URLs stay server-side (never in the repo or frontend).

**Deploy to Vercel (free):**

1. Push this repo to GitHub (if not already).
2. Go to [vercel.com](https://vercel.com), sign in, and import the repo. Set the root directory to this repo (Vercel will detect `api/` as serverless functions).
3. Deploy. You get e.g. `https://your-project.vercel.app/api/waitlist` and `https://your-project.vercel.app/api/download-click`.

**Environment variables (Vercel project → Settings → Environment Variables):**

- `DISCORD_WEBHOOK_URL` – webhook for waitlist/contact (optional; fallback is in code).
- `DISCORD_DOWNLOAD_WEBHOOK_URL` – webhook for Download button pings. **Required for download pings.** Set this to your Discord webhook URL; never commit it.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` – optional. When set, each download ping increments a counter and Discord messages include it (e.g. "Download button clicked #42 …"). Use [Upstash](https://upstash.com) (free tier): create a Redis database, then copy REST URL and REST Token from the dashboard into Vercel env vars. Lets you compare total pings over time.

**Contact form (optional):**

- In `docs/*.html`, set `<meta name="download-ping-api" content="https://your-project.vercel.app">` (same base URL for contact and download pings).
- Contact form posts to `POST /api/contact` (uses `DISCORD_WEBHOOK_URL` on the server only; never put webhook URLs in HTML).
- Download links call `POST /api/download-click` (uses `DISCORD_DOWNLOAD_WEBHOOK_URL`).

**Waitlist (optional):**

- In `docs/index.html`, set the waitlist form’s `data-api-url` to `https://your-project.vercel.app/api/waitlist` if you use it.
- Optional: set `DISCORD_WEBHOOK_URL` in Vercel to override the default waitlist webhook.

**Not getting pings?**

1. **Meta tag is empty** – The script only runs when `<meta name="download-ping-api" content="...">` has a non-empty `content`. Set it to your Vercel API URL (e.g. `https://your-project.vercel.app`).
2. **API not deployed** – Deploy the repo (or the `api/` folder) to Vercel so `api/download-click.js` is live. Test: open `https://your-project.vercel.app/api/download-click` in the browser; you should get 405 Method Not Allowed (GET not allowed), which means the route exists.
3. **Webhook not set** – In Vercel → Project → Settings → Environment Variables, add `DISCORD_DOWNLOAD_WEBHOOK_URL` with your Discord webhook URL. Redeploy after adding.
4. **Browser** – Open DevTools → Network, click a Download link, and check if a request to `.../api/download-click` appears. If it does but Discord gets nothing, the API may be returning 500 (check Vercel function logs).
