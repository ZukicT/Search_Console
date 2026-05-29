# Search Console Widget – Audit Report

**Date:** 2026-02-24  
**Scope:** SearchConsoleWidgetExtension (small + medium widgets)

---

## 1. Overview

| Item | Status |
|------|--------|
| **Target** | SearchConsoleWidgetExtension |
| **Families** | systemSmall, systemMedium |
| **Data source** | App Group UserDefaults (`group.TarikZukic.Search-Console`) |
| **Deep link** | `searchconsole://overview` (opens Overview tab) |

---

## 2. Architecture

### 2.1 Data flow

- **Main app** writes metrics via `WidgetDataManager.updateWidgetData(...)` into shared UserDefaults and calls `WidgetCenter.shared.reloadAllTimelines()`.
- **Widget** reads via `UserDefaults.widgetShared` (same App Group) in `SearchConsoleTimelineProvider.loadWidgetData()`.
- **Keys:** `widgetMetrics` (JSON), `widgetSiteName`, `userEmail`.

### 2.2 Timeline

- **Small widget:** ~600 seconds (10 min) of entries, 4 steps/second, card duration 15–25s per metric. Refresh requested every 20s (`.after(now + 20)`).
- **Entry content:** `date`, `metrics`, `siteName`, `displayMetric`, `progressInCard`.
- **Medium widget:** Single entry per timeline; no rotation (static 4 cards).

### 2.3 Duplicate model

- `WidgetMetrics` (and `MetricChange`) exist in:
  - **Widget:** `SearchConsoleWidget.swift`
  - **App:** `WidgetDataManager.swift`
- Structures must stay identical for encoding/decoding. Consider moving to a shared Swift package or a file in a target shared by both app and widget to avoid drift.

---

## 3. Issues Found

### 3.1 Critical

| # | Issue | Location | Recommendation |
|---|--------|----------|----------------|
| 1 | **UIColor in scope** | `WidgetTheme` (Text, Background) | Widget extension uses `UIColor` in `Color(uiColor: UIColor { ... })` but file only imports SwiftUI, WidgetKit. Add `import UIKit` so `UIColor` resolves and type-checker can finish. |
| 2 | **Timeline when unauthenticated** | `getTimeline` | When `loadWidgetData()` returns `metrics: nil`, the provider still runs the full 10-minute loop and creates ~2400 entries with `metrics: nil`. Wastes work and can hurt performance. Return a single “not signed in” entry and request a later refresh instead. |

### 3.2 Medium

| # | Issue | Location | Recommendation |
|---|--------|----------|----------------|
| 3 | **Entry doc vs behavior** | `SearchConsoleEntry.progressInCard` | Comment says “within the current 10s card”; cards are now 15–25s. Update comment. |
| 4 | **Snapshot with rotation** | `getSnapshot` | Uses `loadWidgetData()` which returns `displayMetric: .clicks`. Snapshot always shows Clicks. Acceptable; could optionally randomize for preview. |
| 5 | **Medium widget tap** | `SearchConsoleWidgetView` | `.widgetURL(URL(string: "searchconsole://overview"))` applies to whole widget. Medium widget also opens overview on tap; confirm product intent. |

### 3.3 Low / Nice-to-have

| # | Issue | Location | Recommendation |
|---|--------|----------|----------------|
| 6 | **Magic numbers** | Timeline (600, 20, 4, 15, 25) | Extract to named constants (e.g. `timelineSpanSeconds`, `refreshIntervalSeconds`, `stepsPerSecond`, `minCardSeconds`, `maxCardSeconds`) at top of provider or in a small config enum. |
| 7 | **File header date** | First line comment | Update “Last edited” to audit date. |
| 8 | **Previews** | `#Preview` | Scale in SmallWidgetView is `y: 1.7`; previews don’t reflect that. Optional: use same scale in preview or document. |

---

## 4. What’s Working Well

- **Small widget layout:** Icon removed; main number (92pt, black, vertical scale); percentage + label; progress bar (10pt height, pill shape); spacing constants; deep link to overview.
- **Timeline continuity:** 10-minute span of entries avoids “stuck on last card” when the system doesn’t refresh at 20s; no wrap entry that could leave the widget on a single metric.
- **Variable card duration:** 15–25s per metric with new random durations each cycle.
- **Progress bar:** Rounded ends via `RoundedRectangle(cornerRadius: barHeight/2)`; smooth stepping at 4 steps/second.
- **NotAuthenticatedView:** Clear copy and layout for unauthenticated state.
- **App Group ID:** Same identifier in widget (`WidgetAppGroup.identifier`) and app (`WidgetDataManager.appGroupIdentifier`).
- **Reload on data update:** App calls `WidgetCenter.shared.reloadAllTimelines()` after updating widget data.

---

## 5. Recommendations Summary

1. **Add `import UIKit`** in `SearchConsoleWidget.swift` so `WidgetTheme` compiles and type-checking succeeds.
2. **Short-circuit `getTimeline` when `base.metrics == nil`:** return a timeline with one entry (current date, nil metrics) and e.g. `.after(now + 300)` so the widget shows “Not Signed In” without building thousands of entries.
3. Update **entry comment** for `progressInCard` to reflect 15–25s cards.
4. Optionally extract **timeline constants** and refresh “Last edited” in the file header.

---

## 6. Checklist (quick verification)

- [ ] App Group capability on app and widget targets with same ID.
- [ ] `WidgetDataManager.updateWidgetData(...)` called after successful data fetch (and previous values available for % change).
- [ ] `WidgetDataManager.clearWidgetData()` (and `reloadAllTimelines`) on logout.
- [ ] Main app handles `searchconsole://overview` (e.g. in `onOpenURL` / scene) and switches to Overview tab.
- [ ] Widget extension target does not include app-only code; app target does not include widget-only UI.

---

*End of audit.*
