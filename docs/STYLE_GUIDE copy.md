# Search Console iOS - Style Guide

## Overview

This app follows Google's Material Design principles adapted for iOS, with strict adherence to the `AppTheme` system. All code should be production-ready with no placeholders.

## Color System

### Always Use AppTheme

```swift
// ✅ CORRECT
.foregroundStyle(AppTheme.Colors.textPrimary)
.background(AppTheme.Colors.cardBackground)

// ❌ WRONG - Never do this
.foregroundStyle(Color("GoogleBlue"))
.foregroundStyle(.blue)
.background(Color(red: 0.2, green: 0.3, blue: 0.4))
```

### Available Colors

| Usage | Property |
|-------|----------|
| Primary actions | `AppTheme.Colors.primary` |
| Success states | `AppTheme.Colors.googleGreen` |
| Warnings | `AppTheme.Colors.accent` (yellow) |
| Errors | `AppTheme.Colors.error` |
| Main text | `AppTheme.Colors.textPrimary` |
| Secondary text | `AppTheme.Colors.textSecondary` |
| Backgrounds | `AppTheme.Colors.background` |
| Cards | `AppTheme.Colors.cardBackground` |
| Grouped backgrounds | `AppTheme.Colors.groupedBackground` |
| Dividers | `AppTheme.Colors.divider` |

## Spacing System

```swift
// ✅ CORRECT
.padding(AppTheme.Spacing.medium)
.padding(.horizontal, AppTheme.Spacing.large)

// ❌ WRONG
.padding(16)
.padding(.horizontal, 24)
```

### Spacing Values

| Name | Value | Usage |
|------|-------|-------|
| `small` | 8pt | Tight spacing, inline elements |
| `medium` | 16pt | Standard padding, card content |
| `large` | 24pt | Section spacing |
| `extraLarge` | 32pt | Major sections, hero areas |

## Corner Radius

```swift
// ✅ CORRECT
.clipShape(RoundedRectangle(cornerRadius: AppTheme.CornerRadius.card))

// ❌ WRONG
.clipShape(RoundedRectangle(cornerRadius: 12))
```

## Component Structure

### View File Organization

```swift
struct MyView: View {
  // 1. Properties (lets, @State, @Binding, etc.)
  let data: DataType
  @State private var isLoading = false
  
  // 2. Body
  var body: some View {
    // Main content
  }
  
  // 3. Computed view properties (private var)
  private var headerView: some View { ... }
  private var contentView: some View { ... }
  
  // 4. Helper functions
  private func handleAction() { ... }
}

// 5. Subcomponents (if needed)
struct MyViewRow: View { ... }
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Views | PascalCase + View suffix | `SiteDetailView` |
| View components | PascalCase | `MetricCard` |
| Properties | camelCase | `selectedMetric` |
| Private views | camelCase + descriptive | `headerSection` |
| Actions | camelCase + verb | `refreshData()` |
| Booleans | is/has/should prefix | `isLoading`, `hasError` |

## Charts

### Scale Separation

Never mix metrics with vastly different scales:

```swift
// ✅ CORRECT - Separate charts for different scales
if showsVolumeMetrics {
  volumeChart  // Clicks (0-10000), Impressions (0-100000)
}
if showsRateMetrics {
  rateChart    // CTR (0-100%), Position (1-100)
}

// ❌ WRONG - All metrics on one chart
Chart(data) { item in
  LineMark(y: .value("Clicks", item.clicks))      // Could be 5000
  LineMark(y: .value("CTR", item.ctr * 100))      // Could be 2.5%
}
```

### Always Include

- Interactive legend with toggle capability
- Y-axis labels with proper formatting (K/M for large numbers)
- Date range labels (start/end)
- Smooth animations on data changes

## Error Handling

Always provide user feedback:

```swift
// ✅ CORRECT
func loadData() async {
  do {
    let data = try await api.fetch()
    self.data = data
  } catch {
    self.errorMessage = "Unable to load data. Please try again."
  }
}

// ❌ WRONG - Silent failure
func loadData() async {
  do {
    let data = try await api.fetch()
    self.data = data
  } catch {
    print(error)  // User sees nothing!
  }
}
```

## No TODOs Policy

If you can't implement something fully, either:

1. Create a working demo/mock version
2. Remove the feature entirely
3. Discuss with the team first

```swift
// ❌ NEVER DO THIS
Button("Submit") {
  // TODO: Implement submission
}

// ✅ DO THIS - Working mock
Button("Submit") {
  submitMockData()
}

private func submitMockData() {
  withAnimation {
    submissions.insert(MockSubmission(date: Date()), at: 0)
    showSuccessToast = true
  }
}
```

## Animations

State changes should be animated:

```swift
// ✅ CORRECT
withAnimation(.easeInOut(duration: 0.2)) {
  isSelected = true
}

// Or using the modifier
.animation(.easeInOut(duration: 0.2), value: isSelected)

// ❌ WRONG - Jarring state change
isSelected = true
```

## Accessibility

- Use semantic colors that adapt to dark mode
- Provide meaningful labels for icons
- Ensure touch targets are at least 44x44pt
- Test with Dynamic Type enabled

---

*This guide is enforced by `.cursor/rules/engineering-standards.mdc`*
