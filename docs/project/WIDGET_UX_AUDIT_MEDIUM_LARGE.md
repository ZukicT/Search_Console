# Widget UX Audit: Medium and Large

**Date:** 2026-02-24  
**Scope:** Medium and large widget layout, consistency, accessibility, and edge cases.

---

## 1. Design consistency

| Item | Medium | Large | Status |
|------|--------|--------|--------|
| Stat card component | `LargeWidgetStatCard` | `LargeWidgetStatCard` | Same component; identical look and behavior |
| Card order | Clicks, Impressions, CTR %, Position | Same | Consistent |
| Label alignment | `HStack(alignment: .bottom)` | Same | Labels (Clicks, Impressions, CTR %, Position) on same baseline |
| Card spacing | `WidgetLayout.statCardSpacing` (8pt) | Same | Consistent |
| Horizontal padding | 10pt | 10pt | Consistent |
| Vertical padding | 16pt | 16pt | Consistent |
| Colors | `WidgetTheme.CardColors.*(for: colorScheme)` | Same | App asset catalog match (light/dark) |
| CTR label | "CTR %" | "CTR %" | No "%" on value; label clarifies unit |

---

## 2. Layout and alignment

- **Medium:** Single row of four cards; `HStack(alignment: .bottom)` so label text aligns across cards. Content vertically centered in widget via `.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)`.
- **Large:** "Performance" title, optional chart (when `chartData` has ≥2 points), then same four-card row with `HStack(alignment: .bottom)`. Cards sit below chart with consistent spacing.
- **Stat card:** Value + change block has fixed `minHeight` (58pt) so the label row is always at the same vertical position across cards; value has 8pt spacing above the percentage row.

---

## 3. Edge cases and empty states

| Case | Behavior |
|------|----------|
| Not signed in | `NotAuthenticatedView`: icon, "Not Signed In", subtitle. Centered in widget (`.frame(..., alignment: .center)`). |
| No chart data (large) | Chart omitted; title + four cards only. No empty chart area. |
| Single chart point | Chart requires `points.count > 1`; omitted if only one point. |
| Very long value (e.g. 1.2M) | Value uses `minimumScaleFactor(0.5)` and `lineLimit(1)` so it scales down instead of clipping. |
| Long label "Impressions" | Title uses `minimumScaleFactor(0.65)` so it fits. |

---

## 4. Accessibility

- **LargeWidgetStatCard:** `accessibilityElement(children: .combine)` and `accessibilityLabel` so VoiceOver reads one phrase per card, e.g. "Clicks: 1.2K, up 5.2 percent" or "Position: 12.3, down 2.4 percent".
- Colors: Semantic (Clicks=blue, Impressions=green, CTR=yellow, Position=red); not relied on alone (labels present).

---

## 5. Typography and spacing constants

- Value: 26pt, black, vertical scale 2.5.
- Change: 9pt semibold, 8pt icon.
- Label: 10pt medium, secondary color.
- Value-to-change spacing: 8pt.
- Value+change block min height: 58pt (keeps label row aligned).

---

## 6. Checklist

- [x] Medium and large use same stat card component and layout.
- [x] Labels aligned on same baseline (HStack .bottom + fixed minHeight above label).
- [x] Padding and spacing consistent (10/16pt, 8pt between cards).
- [x] Not-signed-in state centered in medium/large.
- [x] Accessibility label on stat cards for VoiceOver.
- [x] Colors match app (GoogleBlue, GoogleGreen, GoogleYellow, GoogleRed) for light and dark.
- [x] Large widget handles missing chart (no chart view, no broken layout).

---

*End of audit.*
