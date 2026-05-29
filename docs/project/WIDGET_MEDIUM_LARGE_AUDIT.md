# Widget Audit: Medium and Large Not Displaying Data

**Date:** 2026-02-24  
**Issue:** Small widget works; medium and large widgets do not show data.

---

## 1. Data path (same for all sizes)

- **Timeline:** One provider (`SearchConsoleTimelineProvider`) serves all three families. `getTimeline` and `getSnapshot` call `loadWidgetData()` once and do not branch on `widgetFamily`.
- **Storage:** `loadWidgetData()` reads from App Group UserDefaults: `userEmail`, `widgetMetrics`, `widgetSiteName`, `widgetChartData`. Same keys for every size.
- **Entry:** `SearchConsoleWidgetView` receives the same `entry` and switches on `@Environment(\.widgetFamily)` to show `SmallWidgetView`, `MediumWidgetView`, or `LargeWidgetView`. If `entry.metrics == nil`, all sizes show `NotAuthenticatedView`.

So if the small widget shows data, the same entry has non-nil metrics. Medium and large use that same entry; they do not use a different data source.

---

## 2. Root cause: rendering (medium)

**Medium widget used `.drawingGroup()`.** In widget extensions, `drawingGroup()` flattens the view into an offscreen image. In some iOS/widget contexts this can produce a blank or wrongly sized layer, so the medium widget could render empty even though the entry had data.

**Fix applied:** Removed `.drawingGroup()` from `MediumWidgetView` in `SearchConsoleWidget.swift`. Medium now renders the same 4 stat cards without layer flattening.

---

## 3. Large widget

- **Data:** Large uses `entry.metrics` and `entry.chartData`. Chart is optional; the four bar rows (Clicks, Impressions, CTR, Position) always use `metrics`.
- **App side:** `InsightsView` calls `WidgetDataManager.shared.updateWidgetData(..., chartPoints: chartPoints)`, so chart data is written when available.
- **Layout:** No `drawingGroup()` on large. If large still shows no data after the medium fix, next checks:
  - App Group: both app and widget extension targets must have the same App Group ID (`group.TarikZukic.Search-Console`) in Signing & Capabilities.
  - After adding or resizing widgets, force a refresh: open the app (so `InsightsView` runs and calls `updateWidgetData`), then remove and re-add the large widget so the system requests a new timeline.

---

## 4. Checklist

| Item | Status |
|------|--------|
| Medium: remove `.drawingGroup()` | Done |
| App writes `userEmail`, `widgetMetrics`, `widgetSiteName`, `widgetChartData` | Yes (InsightsView) |
| Widget reads same keys from `UserDefaults.widgetShared` | Yes |
| App Group ID matches in app and widget targets | Verify in Xcode |
| Small works → same timeline/entry for medium/large | Yes |

---

## 5. If medium/large still blank after this fix

1. Confirm App Group is enabled for **both** the main app target and the SearchConsoleWidgetExtension target, with the exact same identifier.
2. On a device/simulator: open the app, go to Insights (so widget data is updated), then remove the medium/large widget and add it again.
3. If only large is blank: confirm `chartPoints` are passed from InsightsView (already done) and that `widgetChartData` is being written; the large widget still shows the four metric rows when `chartData` is nil.

---

*End of audit.*
