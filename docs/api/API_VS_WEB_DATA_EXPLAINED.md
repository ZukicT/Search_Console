# Why App Data Can Look Different From the Website

The app uses the **Google Search Console API**; the website uses the same underlying data but with different defaults and limits. Here’s what causes differences and what we do about it.

---

## 1. Fresh vs finalized data (`dataState`)

**What happens**

- **Web:** The Performance report uses **fresh data** (recent, still processing) by default.
- **API:** By default it returns only **finalized** data. To get fresh data you must send `dataState: "all"`.

**Effect**

- If the app only requested finalized data, recent ranges (e.g. last 7 or 28 days) could show **lower or older** numbers than the website.
- **What we do:** The app sends `dataState: "all"` for recent ranges (**Last 24 hours**, **Last 7 days**, **Last 28 days**) so numbers match the web. For older ranges (e.g. 3–16 months) we keep using finalized data only.

---

## 2. Date range and timezone (PT)

**What happens**

- The API expects dates in **PT (America/Los_Angeles)**. The web also uses a fixed timezone for the date range.
- The app builds `startDate` / `endDate` from the device’s **local** date (e.g. “today” in your timezone).

**Effect**

- Around midnight, “today” in your timezone might be a different calendar day in PT. That can cause **off‑by‑one‑day** or slightly different totals at the boundaries of the range.
- **What we do:** We use the device date for the range. For exact parity with the web you’d need to convert to PT when building the request; that can be added later if needed.

---

## 3. How many rows are returned (`rowLimit`)

**What happens**

- **API:** Can return up to **25,000** rows per request; its default is **1,000**.
- **App (before fix):** We were requesting only **25** rows for queries, pages, countries, and devices.

**Effect**

- The website can show hundreds or thousands of rows; the app would only show the **top 25** by clicks, so lists and any totals derived from those rows looked different.
- **What we do:** We increased the app’s limit (e.g. to the API default of 1,000) so query/page/country/device lists and their totals are much closer to the web.

---

## 4. Processing delay (same for app and web)

**What happens**

- Search Console data is **not real time**. It usually appears **2–3 days** after the fact; sometimes up to a few days more.

**Effect**

- Both the app and the website show the same delay. Differences you see are from the points above, not from extra delay in the app.

---

## Summary

| Cause              | Effect                         | What we do in the app                          |
|--------------------|--------------------------------|-------------------------------------------------|
| `dataState`       | Fresh vs finalized numbers    | Use `dataState: "all"` for 24h, 7d, 28d        |
| Timezone (PT)     | Possible off-by-one at boundaries | Documented; optional PT conversion later     |
| `rowLimit` (25)   | Only top 25 rows shown        | Increased to match API default (e.g. 1,000)     |
| Processing delay  | Data 2–3 days behind          | Same as web; no extra app-specific delay       |

After these changes, app data for recent ranges and list sizes should align much better with the Search Console website.
