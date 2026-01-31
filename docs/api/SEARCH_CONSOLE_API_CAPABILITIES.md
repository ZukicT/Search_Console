# Search Console API - Capabilities vs Implementation

**Reference:** [Search Console API](https://developers.google.com/webmaster-tools/v1/api_reference_index)  
**Base URLs:** `https://www.googleapis.com/webmasters/v3` and `https://searchconsole.googleapis.com/v1`  
**Implementation:** `SearchConsoleAPI.swift` and app usage. No demo data; API only.

**Added recently** = Implemented in the latest update (Sites add + delete; Add property sheet and Remove property in UI).

**Keep this updated:** When you implement a new Search Console API capability:
1. Set **Implemented** to `Yes` in the section table (Sites, Sitemaps, Search Analytics, or URL Inspection).
2. Set **Added recently** to `**Yes**` for that row (and in Master checklist).
3. Update **Summary counts** (Implemented / Not implemented).
4. Update the **Master checklist** row: Implemented = Yes, Added recently = **Yes**.
5. When a new release adds more features, move current "Added recently" rows back to `-` and set **Yes** only for the new batch; update the "Added recently" definition line at the top.

**Validation (where it's displayed):**
- **Type:** Site Detail (Result Type picker) drives chart and all dimension tabs; Top Pages and Search Queries receive the same type from Site Detail and show "Result type: X" when not Web. API calls in all three use the type parameter.
- **startRow:** Top Pages and Search Queries use `startRow` for "Load more" pagination; first load uses `startRow: nil`, load more uses `startRow: count`. Displayed via "Load more" button at bottom of each list when more data is available.
- **searchAppearance:** Site Detail dimension picker includes Search Appearance; chart and table show searchAppearance data when that dimension is selected.
- **Sitemaps get:** Sitemaps list tap opens detail sheet with full sitemap data from API.
- **URL Inspection:** URL Inspection tool calls API and shows index status and coverage.
- **Sites get:** `fetchSite(accessToken, siteUrl)` in SearchConsoleAPI returns a single Site (siteUrl, permissionLevel). Available for refresh or permission display.
- **dimensionFilterGroups:** Site Detail has Device filter picker (All / Desktop / Mobile / Tablet); Top Pages and Search Queries receive the same device filter from Site Detail. API request includes dimensionFilterGroups when device filter is not All.
- **aggregationType:** Site Detail has Aggregation picker (Auto / By property / By page). Passed to API for non-page dimensions; when dimension is Page, API uses auto.
- **Sitemaps submit:** Sitemaps screen "Submit" button (when not demo) calls PUT API; on success list refreshes. Requires webmasters scope.
- **Sitemaps delete:** Sitemap detail sheet has Delete button with confirmation; on success list refreshes via onDeleted. Requires webmasters scope.
- **Sites add:** Dashboard "Add property" (toolbar + empty state); sheet to enter URL or domain; PUT API then list refresh. Requires webmasters scope.
- **Sites delete:** Site Detail menu "Remove property" with confirmation; callback runs ViewModel.deleteSite then dismiss. Requires webmasters scope.

---

## Sites (webmasters/v3)

| Capability     | HTTP   | Endpoint             | Implemented | Added recently |
| :------------- | :----- | :------------------- | :---------: | :-------------: |
| List sites     | GET    | `/sites`             | Yes         | -               |
| Get site       | GET    | `/sites/siteUrl`     | Yes         | -               |
| Add site       | PUT    | `/sites/siteUrl`     | Yes         | **Yes**         |
| Delete site    | DELETE | `/sites/siteUrl`     | Yes         | **Yes**         |

---

## Sitemaps (webmasters/v3)

| Capability      | HTTP   | Endpoint                               | Implemented | Added recently |
| :-------------- | :----- | :------------------------------------- | :---------: | :-------------: |
| List sitemaps   | GET    | `/sites/siteUrl/sitemaps`              | Yes         | -               |
| Get sitemap     | GET    | `/sites/siteUrl/sitemaps/feedpath`     | Yes         | -               |
| Submit sitemap  | PUT    | `/sites/siteUrl/sitemaps/feedpath`     | Yes         | **Yes**         |
| Delete sitemap  | DELETE | `/sites/siteUrl/sitemaps/feedpath`     | Yes         | **Yes**         |

---

## Search Analytics (webmasters/v3)

| Capability           | HTTP | Endpoint                                 | Implemented | Added recently |
| :------------------- | :--- | :--------------------------------------- | :---------: | :-------------: |
| Query search traffic | POST | `/sites/siteUrl/searchAnalytics/query`   | Yes         | -               |

### Search Analytics query - request parameters

| Parameter              | API capability                                                           | Implemented | Added recently |
| :--------------------- | :----------------------------------------------------------------------- | :---------: | :-------------: |
| startDate              | Required; YYYY-MM-DD                                                     | Yes         | -               |
| endDate                | Required; YYYY-MM-DD                                                     | Yes         | -               |
| dimensions             | Group by: date, hour, query, page, country, device, searchAppearance     | Yes         | -               |
| type                   | Filter by: web, image, video, news, discover, googleNews                 | Yes         | -               |
| dimensionFilterGroups  | Filter by dimension (country, device, page, query, searchAppearance)     | Yes         | **Yes**         |
| aggregationType        | auto, byProperty, byPage, byNewsShowcasePanel                            | Yes         | **Yes**         |
| rowLimit               | 1-25000; default 1000                                                    | Yes         | -               |
| startRow               | Pagination offset                                                        | Yes         | **Yes**         |
| dataState              | all, final, hourly_all                                                   | Yes         | -               |

---

## URL Inspection (searchconsole.googleapis.com/v1)

| Capability                | HTTP | Endpoint                           | Implemented | Added recently |
| :------------------------ | :--- | :--------------------------------- | :---------: | :-------------: |
| Inspect URL index status  | POST | `/urlInspection/index:inspect`     | Yes         | -               |

Request body: `inspectionUrl`, `siteUrl`, `languageCode`.

---

## Summary counts

| Area                       | Implemented     | Not implemented |
| :------------------------- | :-------------- | :-------------- |
| Sites                      | 4               | 0               |
| Sitemaps                   | 4               | 0               |
| Search Analytics (method)  | 1               | 0               |
| Search Analytics (params)  | 9 full, 1 part. | 0               |
| URL Inspection             | 1               | 0               |

---

## Master checklist (every API capability)

| #  | Capability                                                                  | Implemented | Added recently |
| :- | :-------------------------------------------------------------------------- | :---------: | :-------------: |
| 1  | Sites: list (GET /sites)                                                    | Yes         | -               |
| 2  | Sites: get (GET /sites/siteUrl)                                             | Yes         | -               |
| 3  | Sites: add (PUT /sites/siteUrl)                                             | Yes         | **Yes**         |
| 4  | Sites: delete (DELETE /sites/siteUrl)                                       | Yes         | **Yes**         |
| 5  | Sitemaps: list (GET /sites/siteUrl/sitemaps)                                | Yes         | -               |
| 6  | Sitemaps: get (GET /sites/siteUrl/sitemaps/feedpath)                        | Yes         | -               |
| 7  | Sitemaps: submit (PUT /sites/siteUrl/sitemaps/feedpath)                     | Yes         | **Yes**         |
| 8  | Sitemaps: delete (DELETE /sites/siteUrl/sitemaps/feedpath)                  | Yes         | **Yes**         |
| 9  | Search Analytics: query (POST searchAnalytics/query)                        | Yes         | -               |
| 10 | Search Analytics: dimension date                                            | Yes         | -               |
| 11 | Search Analytics: dimension hour                                            | Yes         | -               |
| 12 | Search Analytics: dimension query                                           | Yes         | -               |
| 13 | Search Analytics: dimension page                                            | Yes         | -               |
| 14 | Search Analytics: dimension country                                         | Yes         | -               |
| 15 | Search Analytics: dimension device                                          | Yes         | -               |
| 16 | Search Analytics: dimension searchAppearance                                | Yes         | -               |
| 17 | Search Analytics: type (web, image, video, news, discover, googleNews)      | Yes         | -               |
| 18 | Search Analytics: dimensionFilterGroups                                     | Yes         | **Yes**         |
| 19 | Search Analytics: aggregationType                                           | Yes         | **Yes**         |
| 20 | Search Analytics: startRow (pagination)                                     | Yes         | -               |
| 21 | Search Analytics: rowLimit                                                  | Yes         | -               |
| 22 | Search Analytics: dataState                                                 | Yes         | -               |
| 23 | URL Inspection: index.inspect (POST .../urlInspection/index:inspect)        | Yes         | -               |

---

*Last updated: 2026-01-31*
