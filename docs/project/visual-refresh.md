# Visual refresh (Search Console iOS)

Living doc for the incremental UI refresh. Each step ships in the app and is noted here.

## Direction

- Own identity: polished, professional, not generic Google-clone chrome everywhere.
- Motion reference: portfolio hero dot ripple (`projects/portfolio` - `HeroDotWave`, `heroDotField.ts`).
- Palette reference: portfolio profile (dark base `#000000`, ink `#f5f5f7`, muted `#a1a1a6`, accent `#2997ff`).
- Rollout: small steps; app screens adopt tokens over time. Splash leads with the new look.

## Step 1 - Cold-start launch splash (2026-05-25)

### Behavior

| Case | Splash |
| --- | --- |
| Cold launch (process start) | Yes - ~1.9s total (fade in, hold, fade out) |
| Return from background (same process) | No - `showsLaunchSplash` stays false after first finish |
| After splash | Existing flow unchanged (`ContentView` -> `LoginView` onboarding or `MainTabView`) |

### Implementation

| Piece | Location |
| --- | --- |
| Dot wave math | `Core/Utilities/HeroDotField.swift` |
| Dot wave view | `Core/Components/HeroDotWaveView.swift` |
| Splash UI | `Views/LaunchSplashView.swift` |
| Root wrapper | `Views/RootView.swift` |
| Splash tokens | `AppTheme.Splash` in `Core/Constants/AppTheme.swift` |
| System launch screen | `SplashBackground` color only in `Info.plist` `UILaunchScreen` (logo is in-app `LaunchSplashView`) |

### Loading bar

- Decorative progress bar under logo: white fill, 140pt wide, 5pt tall, capsule ends (staged ease-out to ~93%, then 100% before fade-out).
- Not tied to real init work; syncs with splash timing only.
- `accessibilityReduceMotion`: bar jumps to ~92% without stepped animation.

### Typography

- Splash uses same pre-auth fonts as onboarding (`Onboarding.Typography.splashAppName`, kicker, status via `OnboardingTypographyModifiers`).

### Accessibility

- `accessibilityReduceMotion`: static single-frame dot field (no timeline animation).

## Step 2 - Pre-auth onboarding flow (2026-05-25)

### Scope

All `LoginView` steps: marketing slides, plan choice, sign-in. Same ripple and dark portfolio palette as splash.

### Implementation

| Piece | Location |
| --- | --- |
| Ripple + scrim background | `Core/Components/OnboardingFlowBackground.swift` |
| Onboarding tokens | `AppTheme.Onboarding` in `AppTheme.swift` |
| Flow UI | `Views/LoginView.swift` |
| Slide animations | `Views/LoginViewIllustrations.swift` (accent + dark card colors) |

### UI changes

- Replaced cream background and corner blob art with `HeroDotWaveView` plus gradient scrim for text legibility.
- Slide illustrations sit on elevated dark cards (`#1d1d1f` fill, `#424245` stroke).
- Copy and plan cards use splash-aligned ink and muted text.
- Bottom actions: white pill primary (black label), ghost capsule secondary, white page dots; bottom scrim over ripple.
- Shared controls in `OnboardingFlowButtons.swift` (slides, plan choice, sign-in back).
- `preferredColorScheme(.dark)` on pre-auth flow for consistent handoff from splash.

## Step 3 - Onboarding illustrations and plan cards (2026-05-25)

### Slide stage

- `OnboardingSlideStage`: gradient panel, soft top highlight stroke, depth shadow.
- Stage size: **288×164** on phone, **300×172** on Mac (wide chart card, inner padding 16pt).
- Copy: SF Pro default (not rounded), 26pt semibold titles with tight tracking, 16pt body with relaxed line spacing.

### Animations (white-first on dark)

| Slide | Design |
| --- | --- |
| Bar chart | White bars, brightest peak, faint grid lines |
| Query chips | Dark capsules, white text, center chip emphasized |
| Sparkline | White line + fill, animated end dot |
| Widget | Nested mini-card, white metric, accent icon, progress capsule |
| Privacy | Ring pulse, soft shield, white check badge (black mark) |

### Plan cards

- White selection ring + glow; white "Best Value" pill; white checkmarks.
- Shared `onboardingPlanCard` modifier.

### Files

- `OnboardingIllustrationStyle.swift`
- `LoginViewIllustrations.swift`
- `LoginView.swift` (stage wrapper + plan cards)

## Onboarding story (2026-05-26)

Six-slide arc in `LoginView.swift` (one line subtext per slide):

| # | Beat | Title |
| --- | --- | --- |
| 1 | Hook | Search Console on iPhone |
| 2 | Proof | Your top search queries |
| 3 | Proof | Daily performance trends |
| 4 | Habit | Widgets on Home Screen |
| 5 | Proof | Core Web Vitals built in |
| 6 | Trust | You stay in control |

Slide 5 illustration: LCP / CLS / INP rows with Good / Needs work badges (`CoreWebVitalsSlideIllustration`). Trend slide uses polyline chart with axes (not a smooth wave).

## Step 4 - Overview tab (InsightsView) (2026-05-27)

### Scope

First main-app screen aligned to splash/onboarding palette: black base, ink copy, elevated `#1d1d1f` cards, portfolio accent.

### Implementation

| Piece | Location |
| --- | --- |
| Main app tokens + `mainContentCard()` | `Core/Components/MainContentCard.swift` |
| Section headers | `Core/Components/ContentSectionHeader.swift` |
| Overview UI | `Views/InsightsView.swift` |
| Tab bar chrome (iOS) | `Views/MainTabView.swift` |

### UI changes

- Screen background: `SplashBackground` black (was grouped gray).
- Nav title: **Overview** (matches tab label).
- Cards: dark fill, subtle stroke, soft shadow (welcome, tips, quick actions, stats, achievements).
- Stat tiles: dark cards with colored icon chips (replaces full gradient pills).
- Typography: SF Pro default, tighter section tracking (less rounded).
- Tab bar: dark background + `#2997ff` accent tint.

### Pass 2 - Overview polish (2026-05-27)

- `MainFlowBackground`: dot ripple (42% opacity) + gradient scrim (matches onboarding handoff).
- Large navigation title, hidden scroll content background, dark nav bar.
- Grouped list cards: tips and quick actions in single card with dividers (less visual noise).
- Property/date filters in one chip-style card above stat row.
- Stat cards: colored top accent bar + dark tile layout (iOS + Mac).
- Achievement tiles: dark cards (Mac + iOS).
- Subscription upsell gate on Overview uses same background + white CTA pill.

### Pass 3 - Discovery chips (2026-05-27)

- `OverviewDiscoveryChips.swift`: capsule tags matching onboarding query slide (featured stroke on top phrase/page).
- Overview **In Google Search** card: **Top search phrases** + **Pages shown in results** from Search Console `QUERY` / `PAGE` dimensions (demo: `DemoData`).
- All Properties: chips from first property with **From {site}** caption.
- Staggered chip appear animation; **See all** links to `SearchQueriesView`.

## Step 5 - Search tab property list (2026-05-28)

### Scope

`DashboardView` (Search tab): align property list, empty/loading/error states, and `SiteRow` with Overview dark chrome.

### UI changes

- `MainFlowBackground` + dark navigation bar; nav title **Search** (matches tab).
- Replaced inset grouped `List` with `ScrollView` + `OverviewSectionHeader` + `SettingsSectionCard`.
- Property rows: dark cards, accent domain chip, tertiary chevron (system link indicator hidden).
- Demo and free-tier banners use `mainContentCard`.
- Loading / error / empty states use `AppTheme.Main` typography and `QuickActionCenteredStatusCard`.

## Step 6 - Main app theme completion (2026-05-28)

### Scope

Finish `AppTheme.Main` rollout on all post-login surfaces: Search property detail, paywall, Mac chrome, shared components.

### Files touched

| Area | Files |
| --- | --- |
| Property analytics | `Views/SiteDetailView.swift` |
| Paywall | `Views/PaywallView.swift` |
| Mac | `Views/MainTabView.swift`, `Views/MacAboutSheetView.swift` |
| Shared | `Core/Components/InfoBanner.swift`, `Core/Components/StatusChip.swift` |
| Settings polish | `Views/SettingsView.swift` (About/legal icon tint, paywall sheet background) |
| Insights polish | `Views/InsightsView.swift` (disabled quick-action tertiary text) |

### UI changes

- `SiteDetailView`: `MainFlowBackground`, dark nav bar, dark filter cards, dimension tabs use `Main.accent`, loading/error/demo aligned with Quick Action cards.
- `PaywallView`: black ripple background, dark plan cards (`mainContentCard`), white capsule primary CTA.
- Mac sidebar/detail placeholders: `Main.screenBackground` / `MainFlowBackground`.
- Legacy `AppTheme.Colors.{textPrimary,textSecondary,textTertiary,cardBackground,groupedBackground}` removed from app Swift sources (semantic colors like `googleGreen`, `error` kept for charts/status).

### Validation (2026-05-28)

- `xcodebuild` iOS Simulator (iPhone 17): **BUILD SUCCEEDED**
- `xcodebuild` Mac Catalyst: compile OK in prior runs; local run blocked by **provisioning profile** (signing), not Swift errors
- Grep audit: zero matches for legacy text/card/grouped tokens under `Search Console/Search Console/**/*.swift`

### Pass 2 - Theme audit fixes (2026-05-28)

- `SiteDetailView`: filters, chart, tools, and dimension rows use `SettingsSectionBlock` / `mainContentCard`; removed `.foregroundStyle(.secondary)` and inset grouped patterns.
- `DashboardView`: **Add Property** sheet moved off system `Form` to dark scroll + `QuickActionInsetField`.
- Sheets: notifications (Overview + Search), achievement test picker, paywall - `presentationBackground` + dark scheme.
- `AchievementsView`: `scrollContentBackground(.hidden)`.
- `MainTabView` / `PaywallView`: remaining `AppTheme.Colors.primary` tints -> `Main.accent`.

**Re-validation:** iOS `xcodebuild` **BUILD SUCCEEDED**; grep pass for legacy tokens, `.secondary`, `Form`, `insetGrouped` - **clean**.

## Step 7 - Property performance stats and chart (2026-05-28)

### Scope

Search tab property detail (`SiteDetailView`) performance block: metric tiles and Swift Charts trend.

### Implementation

| Piece | Location |
| --- | --- |
| Metric tiles | `Core/Components/PerformanceStatsComponents.swift` (`PerformanceMetricTile`) |
| Chart inset chrome | `PerformanceChartInset`, `AppTheme.Main.chartPlotFill` |
| Chart marks + section layout | `Views/SiteDetailView.swift` |

### UI changes

- **Performance** section uses `SettingsSectionBlock` (matches Filters / Tools).
- Metric row: horizontal scroll of dark tiles (accent dot, selected border) instead of saturated GSC color blocks with white text.
- Chart: darker inset plot, dashed Y grid, gradient area under lines, smoother curves, clearer projected dashes, accent selection rule.
- Removed legacy `GSCMetricCard`.

### Validation (2026-05-28)

- iOS Simulator `xcodebuild`: **BUILD SUCCEEDED**

### Remaining (Step 7)

1. Optional **light-mode** variant when `appearanceMode` is Light (Settings still stores preference; main UI is dark-first).
2. Pre-auth `LoginView` keeps onboarding palette (intentional handoff from splash).
3. Localize new onboarding strings if multi-language pre-auth is required.

## Step 8 - Overview section flow and states (2026-05-26)

### Scope

Overview tab (`InsightsView`): section order, loading flow, and empty states so each block earns its place on the page.

### Section order (iOS)

1. Welcome (contextual subtitle)
2. Performance filters + stat tiles
3. Search visibility (always visible)
4. Tips & Suggestions
5. Quick Actions (before Achievements)
6. Achievements
7. Native ad (when enabled)

Mac: Quick Actions column before Achievements in the bottom row (same priority).

### States

| Section | Loading | Empty |
| --- | --- | --- |
| Page | Full-screen centered loader (first load only) | N/A |
| Stats | Redacted stat tiles on refresh | No-properties card + Go to Search |
| Search visibility | Inline loader in card | Contextual copy + link to Search or queries |
| Tips | Inline loader (existing) | VM fallback tips |

### Welcome subtitle

- Selected property + date range, or property count + range, or no-properties guidance.

### Files

- `Views/InsightsView.swift`

### Validation (2026-05-26)

- iOS Simulator `xcodebuild`: **BUILD SUCCEEDED**

## Step 9 - Overview linked subpages (2026-05-26)

### Scope

All destinations reachable from Overview: quick-action drill-downs, achievements, notifications sheet, customize sheet, sitemap detail.

### Analysis summary

| Destination | Theme | Gaps found |
| --- | --- | --- |
| Search Queries / Top Pages | Dark subpage chrome | No property context; filters shown during blank first load |
| Core Web Vitals | Dark subpage chrome | Strategy picker used system `.subheadline` |
| URL Inspection | Dark subpage chrome | Repeated property URL in copy |
| Sitemaps + detail sheet | Dark subpage chrome | Sheet missing explicit dark presentation background |
| Web Console features | Dark subpage chrome | No property context |
| Achievements | MainFlowBackground | OK |
| Notifications sheet | MainFlowBackground | OK |
| Customize Quick Actions | settingsListChrome | OK |

### Fixes

- `QuickActionPropertyBanner` on all site-scoped quick-action pages.
- Initial load on Search Queries / Top Pages: property banner + loader only (filters after first response).
- Sitemap detail sheet: `presentationBackground` + dark scheme on presenter.
- Core Web Vitals mobile/desktop toggle: `AppTheme.Main` typography.
- Localized status strings on query/page subpages.

### Files

- `Core/Components/QuickActionSubpageStyle.swift`
- `Views/SearchQueriesView.swift`, `TopPagesView.swift`, `CoreWebVitalsView.swift`
- `Views/URLInspectionView.swift`, `SitemapsView.swift`, `WebConsoleFeaturesView.swift`

## Step 10 - Paywall layout and spacing (2026-05-26)

### Scope

Mobile paywall (`PaywallView`) on onboarding plan step and standalone sheet/tab upsell. Fix triple horizontal padding and align with paywall UX research: single centered column, clear hierarchy, grouped plans, demoted free tier.

### Research applied

- One readable column (~400pt max width), 20pt screen inset only (no nested `mainScreenContentPadding` on onboarding).
- Headline → 4 benefit bullets (no heavy feature card) → grouped plan rows → white capsule CTA → subtle free-with-ads link → restore / legal.
- Monthly pre-selected as Best Value; weekly secondary in same card with dividers.
- Bot mark (`OverviewBotMarkView`) in header, not app icon.

### Files

| File | Change |
| --- | --- |
| `Core/Components/PaywallLayoutMetrics.swift` | New shared column width, insets, section spacing |
| `Views/PaywallView.swift` | Layout rewrite, grouped pricing, footer stack |
| `Views/LoginView.swift` | Removed duplicate horizontal padding on plan step |

### Validation

- `xcodebuild` iOS Simulator (iPhone 17, OS 26.5): **BUILD SUCCEEDED**

## Step 11 - Dark menu / popover chrome (2026-05-26)

### Scope

System `Menu` popovers on iOS 26 showed light Liquid Glass while app UI is dark (especially date/property pickers on Overview stats card).

### Fixes

- App root: **System** appearance resolves to **dark** (dark-first UI; user can still pick Light in Settings).
- `appDarkMenuChrome()` on `settingsMenuControlStyle()` for remaining system menus.
- `DarkThemePopoverMenu` + `DarkThemeMenuButton` for Overview property and date range pickers — dark `mainContentCard` popover instead of system glass.

### Files

- `Search_ConsoleApp.swift`
- `Core/Components/SettingsScreenStyle.swift`
- `Views/InsightsView.swift`
- `Core/Components/MainTabActionToolbar.swift`
- `Views/SiteDetailView.swift` (menu dark chrome)

### Validation

- `xcodebuild` iOS Simulator (iPhone 17, OS 26.5): **BUILD SUCCEEDED**

## Step 12 - Overview section value pass (2026-05-26)

### Problem

Several Overview sections felt low-value: discovery chips showed labels only (no metrics, not tappable), tips often repeated stats or showed generic "Looking good", achievements carousel showed up to four low-context cards.

### Changes

- **Search visibility**: ranked rows with click counts (top 4 by clicks); tappable blocks open Search Queries / Top Pages.
- **Insights** (renamed from Tips): max 2 data-driven cards (top term/page, trend, position, CTR); hidden when nothing actionable.
- **Stats**: "Compared to the previous period" context under property/date controls.
- **Achievements**: max 2 highlights (recent unlock + next goal); hidden when no property data.
- **Order**: Quick Actions moved above Insights (tools before optional insight cards).

### Files

- `Core/Components/OverviewDiscoveryChips.swift`
- `Views/InsightsView.swift`

## Tokens (splash / portfolio phase)

| Token | Value |
| --- | --- |
| Background | `#000000` (`SplashBackground`) |
| Primary text | `#f5f5f7` |
| Secondary text | `#a1a1a6` |
| Accent | `#2997ff` |
| Dot field (dark) | RGB 148, 148, 163 |
