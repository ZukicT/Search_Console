# API (Discord webhooks)

Serverless functions that post to Discord. Deploy the `api/` folder to Vercel so the webhook URLs stay server-side (never in the repo or frontend).

**Deploy to Vercel (free):**

1. Push this repo to GitHub (if not already).
2. Go to [vercel.com](https://vercel.com), sign in, and import the repo. Set the root directory to this repo (Vercel will detect `api/` as serverless functions).
3. Deploy. You get e.g. `https://your-project.vercel.app/api/waitlist` and `https://your-project.vercel.app/api/download-click`.

**Environment variables (Vercel project → Settings → Environment Variables):**

- `DISCORD_WEBHOOK_URL` – webhook for waitlist/contact (optional; fallback is in code).
- `DISCORD_DOWNLOAD_WEBHOOK_URL` – webhook for Download button pings. **Required for download pings.** Set this to your Discord webhook URL; never commit it.

**Download button ping (no webhook in frontend):**

1. In Vercel, set `DISCORD_DOWNLOAD_WEBHOOK_URL` to your Discord webhook URL (the one that should receive “Download button clicked”).
2. In every `docs/*.html` page that has Download links, set the meta tag:  
   `<meta name="download-ping-api" content="https://your-project.vercel.app">`  
   (use your Vercel project URL, no trailing slash).  
   When a user clicks a Download/App Store link, the site calls `POST /api/download-click`; the API then posts to Discord. The webhook URL is only in Vercel, so it is not leaked.

**Waitlist (optional):**

- In `docs/index.html`, set the waitlist form’s `data-api-url` to `https://your-project.vercel.app/api/waitlist` if you use it.
- Optional: set `DISCORD_WEBHOOK_URL` in Vercel to override the default waitlist webhook.
