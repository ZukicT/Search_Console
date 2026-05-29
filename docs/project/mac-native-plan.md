# Search Console — Native macOS Plan

**Status**: Paused until further notice (iOS App Store is the current ship target)  
**Last updated**: 2026-05-27  
**Scope**: iOS remains as-is. Mac receives native desktop polish with the same dark theme.  
**Targets**: iOS + native macOS (`SUPPORTS_MACCATALYST = NO`, `SUPPORTED_PLATFORMS` includes `macosx`).

---

## Problem

The app targets native macOS, but most desktop-specific code still gates on `#if targetEnvironment(macCatalyst)`. On a native Mac build that flag is false, so users likely see the iPhone tab bar layout instead of the sidebar shell, window sizing, menu commands, and other Mac adaptations.

**Goal**: A Mac app that feels purpose-built for desktop (sidebar navigation, menus, keyboard shortcuts, pointer-friendly density) while keeping the existing Search Console dark theme and brand.

---

## Goals and non-goals

### Goals

| Goal | Outcome |
| ---- | ------- |
| Native Mac shell | `NavigationSplitView` sidebar + detail, menu bar, shortcuts, resizable window |
| Platform correctness | Single platform check (`Platform.isMac` / `#if os(macOS)`); no dead Catalyst branches |
| Screen-by-screen desktop UX | Charts, tables, settings, onboarding tuned for pointer and large windows |
| Same theme | `AppTheme` colors and spacing; adjust scale and layout only |
| iOS untouched | iPhone paths stay behind `#if os(iOS)` or `!Platform.isMac` |

### Non-goals (v1 Mac focus)

- macOS widget extension
- iPad-specific layout overhaul
- New product features (presentation and interaction of existing features only)
- Maintaining Mac Catalyst alongside native macOS
- Visual rebrand (gradients, new color system)

---

## Primary user scenarios (Mac)

1. User opens the app — sidebar is visible, traffic lights do not cover content, default window size is sensible.
2. User picks a property in the sidebar — detail updates without tab switching.
3. User navigates Performance, Top Pages, Queries via sidebar or keyboard shortcuts.
4. User resizes the window — sidebar and detail adapt; minimum size keeps paywall and onboarding usable.
5. User opens Settings via menu command or sidebar — follows a native Mac settings pattern.
6. User views charts and tables on a wide screen — readable density, not a phone-width column in empty space.
7. User completes onboarding or paywall on Mac — centered column layout, no phone chrome artifacts.

---

## Phase overview

```text
Phase 0  Platform migration     (blocker — must complete first)
    |
Phase 1  Mac shell              (sidebar, window, menus)
    |
Phase 2  Detail screens audit   (incremental, per screen)
    |
Phase 3  Auth and commerce      (login, onboarding, paywall)
    |
Phase 4  Polish and ship        (keyboard, QA, release readiness)
```

**Estimated effort** (rough): Phase 0 (3–5 days), Phase 1 (4–6 days), Phase 2 (1–2 weeks), Phase 3 (3–4 days), Phase 4 (3–5 days).

---

## Phase 0 — Platform foundation

**Priority**: Blocker. No visual Mac work pays off until this phase ships.

### Work items

1. Add `Platform.swift` with a single `Platform.isMac` (or equivalent) used across the app target.
2. Replace `targetEnvironment(macCatalyst)` with `Platform.isMac` or `#if os(macOS)` across all app-target files (~25 files).
3. Split `AppChromeAppearance`:
   - **iOS**: Keep UIKit window styling.
   - **macOS**: Remove `UIWindowScene` / `UITitlebar` Catalyst hacks; use SwiftUI `WindowGroup`, `.defaultSize`, `.windowResizability`.
4. Fix platform-specific APIs:
   - Pasteboard: `NSPasteboard` on Mac, `UIPasteboard` on iOS.
   - Ads: `#if os(iOS)` only — Mac must not initialize `AdService`.
   - Review prompt: Mac App Store copy on Mac where applicable.
5. Xcode and tooling:
   - Set `MACOSX_DEPLOYMENT_TARGET` (recommend 14.0 or 15.0 — pick once and document here).
   - Replace `verify-maccatalyst-build.sh` with a native macOS build verification script.
6. Update this doc with the chosen deployment target and Settings pattern decision (see Open decisions).

### Acceptance criteria

- [ ] Mac build shows **sidebar**, not tab bar.
- [ ] Menu commands (Navigation, Preferences, About) work on Mac.
- [ ] iOS build unchanged (smoke: tab bar, ads, sheets).
- [ ] Grep: zero `macCatalyst` references in the main app target (widget extension may remain iOS-only).

### Key files

| Area | Files |
| ---- | ----- |
| Routing | `MainTabView.swift`, `ContentView.swift`, `TabRouter.swift` |
| App entry | `Search_ConsoleApp.swift`, `RootView.swift` |
| Chrome | `AppChromeAppearance.swift`, `DesktopOnboardingLayout.swift` |
| Theme | `AppTheme.swift` |
| Ads | `AdService.swift`, `NativeAdScreenSection.swift` |

---

## Phase 1 — Mac shell (sidebar and window)

**Depends on**: Phase 0 complete.

### Research references

- [NavigationSplitView](https://developer.apple.com/documentation/swiftui/navigationsplitview)
- [Designing for macOS (HIG)](https://developer.apple.com/design/human-interface-guidelines/designing-for-macos)

### Work items

| Area | Direction |
| ---- | --------- |
| Sidebar | Keep custom dark styling; use `.listStyle(.sidebar)`; respect system safe area; account row pinned to bottom |
| Window | `@SceneStorage` for column visibility; `.navigationSplitViewStyle(.balanced)`; min/default size from `DesktopWindowLayout` |
| Toolbar | Toolbar on **detail** column (breadcrumb, refresh, export) — not duplicated in sidebar |
| Menus | `SidebarCommands()` plus existing Navigation menu; wire all panes to shortcuts |
| Preferences | Implement chosen pattern from Open decisions (separate Settings scene vs in-sidebar only) |
| Empty states | Detail placeholder when no property is selected |

### Architecture

```text
Search_ConsoleApp
├── WindowGroup (main)
│   └── RootView → ContentView
│       ├── LoginView (Mac: centered desktop layout)
│       └── MainTabView
│           ├── iOS: TabView
│           └── Mac: NavigationSplitView
│               ├── Sidebar (property, nav, quick actions, account)
│               └── Detail (toolbar + routed pane views)
└── Settings { } (Mac only — if Option A chosen)
```

**Rule**: `NavigationSplitView` at the Mac root only. Use `NavigationStack` inside the detail column when push navigation is needed. Do not wrap the split view in a root `NavigationStack`.

### Acceptance criteria

- [ ] Sidebar content starts below traffic lights (no overlap).
- [ ] Sidebar resizes between 240pt and 400pt; selection persists.
- [ ] Keyboard shortcuts (for example Command-1 through Command-7, Command-comma) work from any pane.
- [ ] Window will not shrink below paywall and onboarding minimums.

### Key files

| Area | Files |
| ---- | ----- |
| Shell | `MainTabView.swift`, `MacSidebarLayout` / `DesktopOnboardingLayout.swift` |
| Commands | `Search_ConsoleApp.swift` |
| Chrome | `AppChromeAppearance.swift` |

---

## Phase 2 — Detail screens audit

**Depends on**: Phase 1 complete. Execute incrementally — one screen or group per PR.

### Per-screen direction

| Screen | Mac adjustments |
| ------ | ---------------- |
| InsightsView | Multi-column stat grid at minimum width; readable max width or side margins |
| DashboardView | Adaptive property grid; hover on cards; Mac pasteboard |
| SiteDetailView | Header and chart layout for wide windows; avoid nested full-screen navigation at root |
| TopPagesView / SearchQueriesView | Consider `Table` for sortable columns at wide width; card fallback when narrow |
| CoreWebVitalsView / URLInspectionView | Form layout: labels left, fields right at wide width |
| SitemapsView | Master-detail or inline expansion instead of phone-style sheet where appropriate |
| AchievementsView | Wider badge grid |
| SettingsView | `Form` with sections; Mac-appropriate control sizes |

### Shared patterns

- Rename or generalize `macContentFrame()` to `desktopContentFrame()` tied to `Platform.isMac`.
- Replace phone-only navigation bar modes that conflict with Mac toolbars.
- Size sheets with explicit `minWidth` / `idealWidth` on Mac; avoid full-screen sheets for small dialogs.

### Suggested implementation order

1. InsightsView (home)
2. SiteDetailView and Performance stack
3. TopPagesView and SearchQueriesView
4. SettingsView
5. SitemapsView, CoreWebVitalsView, URLInspectionView, AchievementsView

### Acceptance criteria (per screen)

- [ ] Looks intentional at 1200×900 and at minimum window height.
- [ ] No iPhone tab bar or bottom safe-area padding artifacts.
- [ ] Pointer hover and context menus where lists or grids exist.
- [ ] iOS appearance unchanged for the same screen.

---

## Phase 3 — Auth, onboarding, and paywall

**Depends on**: Phase 0 complete; can overlap with Phase 2 after Phase 1.

### Work items

| Flow | Mac treatment |
| ---- | ------------- |
| Login / onboarding | Centered column using `DesktopOnboardingLayout`; illustration scaling |
| Paywall | Keep mobile-style stack (product preference); ensure minimum window fits without resize |
| Demo mode | Same flows; Mac menu does not expose debug paths accidentally |
| About | Native sheet or small About window |

### Acceptance criteria

- [x] Cold start uses black system launch screen (`SplashBackground` in Info.plist); in-app splash keeps dot ripple on all platforms.
- [x] First-run and paywall are usable at minimum window size.
- [x] No ads on Mac.

### Key files

| Area | Files |
| ---- | ----- |
| Onboarding | `LoginView.swift`, `OnboardingIllustrationStyle.swift`, `OnboardingFlowButtons.swift` |
| Paywall | `PaywallView.swift`, `PaywallLayoutMetrics.swift` |
| Launch | `LaunchSplashView.swift`, `Info.plist` |

---

## Phase 4 — Polish and ship

**Depends on**: Phases 1–3 substantially complete.

### Work items

| Item | Notes |
| ---- | ----- |
| Keyboard navigation | Arrow keys in sidebar `List` with selection binding |
| Focus rings | Visible focus for keyboard users |
| Tooltips | `.help()` on sidebar and toolbar actions |
| Multi-window | Defer unless required — single `WindowGroup` is acceptable for v1 |
| Notarization / sandbox | Verify OAuth redirect and network entitlements |
| QA matrix | Test on macOS 14/15+ at minimum and default window sizes |
| Living memory | Append `#apple` entry to FORGE `PROJECT-LEARNINGS.md` when migration completes |

### Acceptance criteria

- [x] Mac build passes release configuration.
- [ ] Manual QA checklist completed for all primary scenarios above.
- [ ] iOS regression smoke pass before Mac release.

### Manual QA checklist (macOS)

Run at **minimum window size** (960×1024) and **default** (1200×1024) on macOS 14.2+.

| # | Scenario | Pass |
| - | -------- | ---- |
| 1 | Cold start: black system launch → in-app splash with dot ripple → onboarding | |
| 2 | Sidebar visible; traffic lights do not cover brand header | |
| 3 | Property picker switches site; detail updates | |
| 4 | ⌘1–8 and arrow keys change sidebar selection | |
| 5 | ⌘R refreshes data; toolbar Refresh matches | |
| 6 | Settings sidebar row + ⌘, opens Settings window (not duplicate in detail) | |
| 7 | Paywall / onboarding usable at min window height | |
| 8 | Google sign-in completes (OAuth redirect) | |
| 9 | Charts and tables readable at default width | |
| 10 | About Search Console menu item opens sheet | |

---

## Risks and mitigations

| Risk | Mitigation |
| ---- | ---------- |
| Catalyst code silently disabled on Mac | Phase 0 grep gate; CI builds macOS destination |
| Duplicate iOS/Mac maintenance | Shared views; layout branches only where needed |
| UIKit APIs on Mac | Audit `import UIKit`; wrap or replace per platform |
| Scope creep (three-column, inspectors) | Defer inspector panel until Phase 2 is complete |
| Theme drift | All new spacing via `AppTheme`; no hardcoded layout values |

---

## Research triggers (during implementation)

| Topic | When to research |
| ----- | ---------------- |
| `Table` vs `List` for analytics | Phase 2 — Top Pages / Search Queries |
| `Settings` scene vs in-app settings | Phase 1 — before menu wiring |
| Chart sizing on macOS | Phase 2 — Site Detail |
| StoreKit on macOS | Phase 3 — if paywall behaves differently |
| OAuth / web authentication on Mac | Phase 3 — if login issues appear |

Use the FORGE `forge-apple-platforms` skill and Apple Developer Documentation as primary sources.

---

## Open decisions

| Decision | Options | Recommendation | Chosen |
| -------- | ------- | -------------- | ------ |
| Preferences on Mac | A: Separate `Settings { SettingsView() }` scene + Command-comma. B: Settings sidebar pane only. | **Option A** (standard Mac) | **Option A** |
| macOS deployment target | 14.0 vs 15.0 | 14.2 for StoreKit offer API | **14.2** |

Update the **Chosen** column when decided.

---

## Related docs

| Doc | Location |
| --- | -------- |
| Mac sidebar quick reference | `Search Console/MAC_SIDEBAR_QUICKREF.md` |
| Mac sidebar improvements log | `Search Console/MAC_SIDEBAR_IMPROVEMENTS.md` |
| Visual refresh notes | `docs/project/visual-refresh.md` |
| FORGE Apple platforms skill | `.cursor/skills/forge-apple-platforms/SKILL.md` |

---

## Progress tracker

| Phase | Status | Notes |
| ----- | ------ | ----- |
| Phase 0 — Platform foundation | **Complete** | `macCatalyst` → `os(macOS)`; macOS build green (2026-05-27) |
| Phase 1 — Mac shell | **Complete** | `NavigationSplitView`, `MacAppCommands`, Settings scene, detail toolbar, sidebar below traffic lights |
| Phase 2 — Detail screens | **Complete** | All detail panes + Dashboard Mac layout; Settings window pass done |
| Phase 3 — Auth and commerce | **Complete** | Mac onboarding copy, paywall no ads, deferred pre-auth purchase, About sheet; splash keeps dot ripple |
| Phase 4 — Polish and ship | In progress | Perf pass: static dot bg on Mac, motion off, lazy site detail fetches, insights debounce/cancel, favicon cache, coalesced site list fetch |

Update **Status** and **Notes** as work lands.
