# Widget Spacing and Alignment Audit

**Date:** 2026-02-24  
**Scope:** Visual hierarchy, spacing consistency, and alignment across small, medium, and large widgets.

---

## 1. Shared constants (`WidgetLayout`)

All spacing and padding used across the widget extension is defined in a single private enum `WidgetLayout` in `SearchConsoleWidget.swift`:

| Constant | Value | Usage |
|----------|--------|--------|
| `horizontalEdgePadding` | 10 | Medium/large: horizontal inset for title and cards; aligns title with card row |
| `verticalSectionPadding` | 16 | Medium/large: top and bottom padding of main content |
| `titleToContentSpacing` | 8 | Space below "Performance" (and span) before cards or chart |
| `headerTitleSpanSpacing` | 6 | Space between "Performance" and "last N days" in header row |
| `chartToCardsSpacing` | 10 | Space between chart and stat cards on large widget |
| `statCardSpacing` | 8 | Horizontal space between stat cards in medium/large |
| `statCardInternalPadding` | 8 | Padding inside each stat card |
| `statCardVStackSpacing` | 6 | Vertical spacing between value, change, and label inside stat card |
| `smallCardPadding` | 14 | Small widget: edge padding (top, sides, bottom) |
| `notAuthenticatedPaddingSmall` | 10 | NotAuthenticatedView padding for small |
| `notAuthenticatedPaddingMediumLarge` | 16 | NotAuthenticatedView padding for medium/large (matches `verticalSectionPadding`) |

---

## 2. Visual hierarchy

- **Small:** Main value → change row → metric label → progress bar. All use `smallCardPadding` (14) for edge padding.
- **Medium/Large:** "Performance" + "last N days" (and on large, month on trailing edge) → 8pt → content (cards or chart + cards). Full-width header; content inset by `horizontalEdgePadding` (10) so title and cards share the same leading edge on medium; large uses same inset for header and cards.
- **Stat cards:** Value (26pt black) → 8pt → change row → 6pt → label row (fixed height 14pt). Internal padding 8pt; 8pt between cards.

---

## 3. Alignment

- **Small:** Value and change centered; label and bar centered. Edge padding 14pt.
- **Medium:** VStack alignment `.leading`; title and cards both get `.padding(.horizontal, horizontalEdgePadding)` so they align. Cards HStack uses `.bottom` so labels sit on same baseline.
- **Large:** Same as medium for header and cards; chart uses its own layout constants (left padding 20, right 2, etc.) for axes and labels.
- **NotAuthenticatedView:** Content centered; padding 10 (small) or 16 (medium/large).

---

## 4. Checklist

- [x] Single source of truth for spacing (`WidgetLayout`)
- [x] Medium widget title and cards share same horizontal inset (10pt)
- [x] Small widget: no span label; value/label/bar layout unchanged
- [x] Title-to-content spacing consistent (8pt) on medium and large
- [x] Stat card internal spacing and padding use shared constants
- [x] NotAuthenticatedView padding matches widget content padding by size

---

*End of audit.*
