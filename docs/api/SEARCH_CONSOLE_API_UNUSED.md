# Google Search Console API – What We Use vs What’s Available

## What the app uses today

| Service            | Method | Endpoint / usage |
|--------------------|--------|-------------------|
| **Sites**          | list   | `GET /sites` – list all properties |
| **Search Analytics** | query | `POST /sites/{siteUrl}/searchAnalytics/query` – performance data with dimensions: date, query, page, country, device |

So currently the app only uses **Sites list** and **Search Analytics query**.

---

## What the API offers that we don’t use

### 1. Sites (same base URL: `webmasters/v3`)

| Method | Request | Description |
|--------|---------|-------------|
| **get**   | `GET /sites/siteUrl` | Get a single property’s details (we only list). |
| **add**   | `PUT /sites/siteUrl` | Add a property to Search Console. Needs write scope. |
| **delete**| `DELETE /sites/siteUrl` | Remove a property. Needs write scope. |

**Possible use:** “Add property” / “Remove property” in app (would require `webmasters` scope, not only `webmasters.readonly`).

---

### 2. Sitemaps (same base URL: `webmasters/v3`)

| Method   | Request | Description |
|----------|---------|-------------|
| **list**   | `GET /sites/siteUrl/sitemaps` | List sitemaps for a property. |
| **get**    | `GET /sites/siteUrl/sitemaps/feedpath` | Get one sitemap’s details. |
| **submit** | `PUT /sites/siteUrl/sitemaps/feedpath` | Submit a sitemap. Needs write scope. |
| **delete** | `DELETE /sites/siteUrl/sitemaps/feedpath` | Delete a sitemap. Needs write scope. |

**Current app:** Sitemaps screen says “API requires additional scopes” and uses demo data.  
**Reality:** Sitemaps **list** and **get** work with `webmasters.readonly`. Submit/delete need `webmasters`.  
**Possible use:** Real “Sitemaps” tab: list and show sitemap status from the API; optionally add submit/delete if you add write scope.

---

### 3. URL Inspection (different base URL)

| Method        | Request | Description |
|---------------|---------|-------------|
| **index.inspect** | `POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect` | Index status and basic info for one URL. Body: `inspectionUrl`, `siteUrl`, `languageCode`. |

**Current app:** URL Inspection screen says “no public API” and uses demo.  
**Reality:** There is a public URL Inspection API; it lives under `searchconsole.googleapis.com/v1`, not `webmasters/v3`. It may require the same or an additional OAuth scope.  
**Possible use:** Real “Inspect URL” in app by calling this endpoint (and handling scope if needed).

---

### 4. Search Analytics – options we don’t use yet

We already use **query** with dimensions: date, query, page, country, device. The same **query** method supports more:

| Feature | Description |
|---------|-------------|
| **Dimension: hour** | Hourly breakdown (with `dataState: "hourly_all"` for fresh hourly data). |
| **Dimension: searchAppearance** | Break down by search feature (e.g. AMP, FAQ, sitelinks). |
| **type** | Filter by result type: `web`, `image`, `video`, `news`, `discover`, `googleNews`. We always use default (web). |
| **dimensionFilterGroups** | Filter by dimension (e.g. only mobile, only one country). We don’t send filters. |
| **aggregationType** | `auto`, `byProperty`, `byPage` – we use default. |
| **startRow** | Pagination – we request one batch (e.g. 1000 rows). |

**Possible use:** Hourly trend, “By search appearance” report, “Image/Video/News” tabs, filters (device/country) and pagination for large lists.

---

## Summary

- **In use:** Sites list + Search Analytics query (date, query, page, country, device).
- **Available but unused:**
  - **Sites:** get, add, delete (add/delete need write scope).
  - **Sitemaps:** list, get, submit, delete (list/get with readonly; submit/delete with write) – would power a real Sitemaps screen.
  - **URL Inspection:** index.inspect on `searchconsole.googleapis.com/v1` – would power real “Inspect URL”.
  - **Search Analytics:** hour dimension, searchAppearance, type filter, dimensionFilterGroups, pagination.

If you want to prioritize, the highest-impact additions are usually: **real Sitemaps (list/get)** and **real URL Inspection**, then **Search Analytics** extras (hour, search appearance, type, filters).
