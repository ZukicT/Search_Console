# Vercel setup – download ping and site

After the first deploy, do these in order.

---

## 1. In Vercel dashboard

1. **Environment variable**  
   Project → **Settings** → **Environment Variables**  
   - Add: **Key** `DISCORD_DOWNLOAD_WEBHOOK_URL`, **Value** your Discord webhook URL (for download pings).  
   - Save, then **Redeploy** the latest deployment so the variable is used.

2. **Build settings (if needed)**  
   Project → **Settings** → **Build & Development Settings**  
   - **Build Command:** leave empty (or override with a single space).  
   - **Output Directory:** `docs`.  
   - **Install Command:** leave empty.  
   *(These are already set in `vercel.json`; override only if the dashboard is ignoring it.)*

3. **Copy your project URL**  
   From the project overview or the latest deployment, copy the URL (e.g. `https://search-console-xxxx.vercel.app`). No trailing slash.

---

## 2. In this repo (website that uses the API)

So that the **live website** (e.g. search-console.org) pings your API when users click Download:

1. In every page that has the download-ping meta tag, set `content` to your Vercel URL:
   ```html
   <meta name="download-ping-api" content="https://YOUR-PROJECT.vercel.app">
   ```
   Replace `YOUR-PROJECT` with your real Vercel URL (e.g. `search-console-abc123.vercel.app`).

2. Files to update (all under `docs/`):  
   `index.html`, `about.html`, `releases.html`, `privacy.html`, `terms.html`, `404.html`, `guides/how-to-use-google-search-console-on-iphone.html`.

3. Commit, push, and redeploy the **website** (e.g. GitHub Pages). The site that people visit must serve these updated HTML files.

---

## 3. Quick check

- Open `https://YOUR-PROJECT.vercel.app/api/download-click` in a browser → you should see **405** (method not allowed). That means the API route is live.
- On the live site, open DevTools → Network, click a Download link → a request to `.../api/download-click` should appear and Discord should get a message (with country if Vercel geo headers are present).
