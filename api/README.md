# Waitlist API (Discord webhook)

This serverless function receives waitlist signups from the website and posts them to your Discord webhook.

**Deploy to Vercel (free):**

1. Push this repo to GitHub (if not already).
2. Go to [vercel.com](https://vercel.com), sign in, and import the repo.
3. Deploy. Vercel will expose the function at `https://your-project.vercel.app/api/waitlist`.
4. In `docs/index.html`, update the waitlist section's `data-api-url` to your Vercel URL, e.g. `https://your-project.vercel.app/api/waitlist`.

Optional: In Vercel project settings, add an environment variable `DISCORD_WEBHOOK_URL` to override the default webhook (keeps the URL out of the repo).
