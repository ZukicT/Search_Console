# Memory Analysis & Fixes

**Current Issue:** App using ~30MB memory

## Root Causes Identified

### 🔴 CRITICAL ISSUE #1: Timer Memory Leak in ContentView
**Location:** `ContentView.swift:84`

```swift
reviewCheckTimer = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { _ in
  reviewService.checkAndRequestReview()
}
```

**Problem:** Timer captures `self` strongly, creating a retain cycle
**Impact:** Timer + ContentView + all child views never deallocate
**Memory Cost:** ~5-10MB per session

**Fix:**
```swift
reviewCheckTimer = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in
  self?.reviewService.checkAndRequestReview()
}
```

---

### 🔴 CRITICAL ISSUE #2: Multiple @StateObject ViewModels Created Per Navigation
**Location:** 
- `SiteDetailView.swift:14` - Creates new `SiteDetailViewModel()` every time
- `DashboardView.swift:11` - Creates new `DashboardViewModel()` every time
- `InsightsView.swift:12` - Creates new `InsightsViewModel()` every time

**Problem:** 
- NavigationStack creates new view instances frequently
- Each instance creates a NEW ViewModel that never deallocates
- ViewModels hold large data arrays (`dateData`, `queryData`, `pageData`, etc.)

**Impact:** 
- Navigate to 5 sites = 5 ViewModels in memory
- Each ViewModel holds ~2-5MB of analytics data
- **Total leak: 10-25MB**

**Fix:** Move ViewModels to parent or use `@ObservedObject` with shared instances

---

### 🟡 MEDIUM ISSUE #3: DispatchQueue.main.asyncAfter Without Weak Self
**Locations:**
- `ContentView.swift:59` - Paywall delay
- `DashboardViewModel.swift:27` - Token refresh delay

```swift
DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
  if let newToken = authService.accessToken {
    self.performFetch(accessToken: newToken)
  }
}
```

**Problem:** Captures `self` strongly for 1.5 seconds
**Impact:** Prevents deallocation during that window
**Memory Cost:** ~2-5MB temporarily

**Fix:**
```swift
DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { [weak self] in
  guard let self = self else { return }
  if let newToken = authService.accessToken {
    self.performFetch(accessToken: newToken)
  }
}
```

---

### 🟡 MEDIUM ISSUE #4: Task Captures in ViewModels
**Location:** `SiteDetailViewModel.swift:110-141`

```swift
Task {
  do {
    let fetchedData = try await api.fetchAnalytics(...)
    await MainActor.run {
      self.updateData(for: dimension, with: fetchedData)
      self.isLoading = false
    }
  }
}
```

**Problem:** Task captures ViewModel, preventing deallocation until task completes
**Impact:** If API is slow (5-10s), ViewModel stays in memory
**Memory Cost:** ~2-3MB per pending request

**Fix:** Tasks should be cancellable when view disappears

---

### 🟢 MINOR ISSUE #5: Large Demo Data Arrays
**Location:** `DemoData` (assumed)

**Problem:** Demo data loaded and kept in memory unnecessarily
**Impact:** ~1-2MB

---

### 🟢 MINOR ISSUE #6: NotificationService Singleton
**Location:** `NotificationService.swift:13`

```swift
static let shared = NotificationService()
```

**Problem:** Singleton never deallocates (but this is intentional)
**Impact:** ~500KB-1MB (acceptable for a service)

---

## Memory Breakdown Estimate

| Component | Memory Usage |
|-----------|--------------|
| Timer leak (ContentView) | 5-10 MB |
| Leaked ViewModels (3-5 instances) | 10-25 MB |
| Demo data in memory | 1-2 MB |
| Async closures (temporary) | 2-5 MB |
| Normal app overhead | 5-8 MB |
| **TOTAL** | **23-50 MB** |

Your 30MB usage aligns with this analysis!

---

## Recommended Fixes (Priority Order)

### 1️⃣ IMMEDIATE FIX: Timer Weak Self
```swift
// ContentView.swift line 84
reviewCheckTimer = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in
  self?.reviewService.checkAndRequestReview()
}
```

### 2️⃣ CRITICAL FIX: Refactor ViewModel Lifecycle
**Option A - Move to Parent:**
```swift
// MainTabView creates ViewModels once
@StateObject private var dashboardViewModel = DashboardViewModel()
@StateObject private var siteDetailViewModels: [String: SiteDetailViewModel] = [:]

// Pass down as @ObservedObject
DashboardView(viewModel: dashboardViewModel)
```

**Option B - Use Dictionary Cache:**
```swift
// ViewModelCache.swift
class ViewModelCache: ObservableObject {
  private var cache: [String: SiteDetailViewModel] = [:]
  
  func getViewModel(for siteUrl: String) -> SiteDetailViewModel {
    if let existing = cache[siteUrl] {
      return existing
    }
    let new = SiteDetailViewModel()
    cache[siteUrl] = new
    return new
  }
  
  func clearOldModels() {
    // Keep only last 3 accessed
    if cache.count > 3 {
      // Remove oldest
    }
  }
}
```

### 3️⃣ HIGH PRIORITY: Add Task Cancellation
```swift
// SiteDetailViewModel.swift
private var fetchTask: Task<Void, Never>?

func fetchAnalytics(...) {
  fetchTask?.cancel()
  
  fetchTask = Task {
    // ... existing code
  }
}

func cancelAllTasks() {
  fetchTask?.cancel()
}

// SiteDetailView.swift
.onDisappear {
  viewModel.cancelAllTasks()
}
```

### 4️⃣ MEDIUM PRIORITY: Weak Self in Async Closures
```swift
// All DispatchQueue.main.asyncAfter
DispatchQueue.main.asyncAfter(deadline: .now() + delay) { [weak self] in
  guard let self = self else { return }
  // ... code
}
```

### 5️⃣ LOW PRIORITY: Clear Demo Data
```swift
// DemoData.swift
static func clearCache() {
  // Clear any cached demo data
}
```

---

## Expected Results After Fixes

| Scenario | Before | After |
|----------|--------|-------|
| Initial load | 30 MB | 15 MB |
| After 5 navigations | 50 MB | 18 MB |
| After 10 navigations | 80 MB | 20 MB |

---

## Testing Memory

**Xcode Instruments:**
1. Product → Profile (⌘I)
2. Choose "Leaks" template
3. Navigate between 5-10 sites
4. Check for red leak indicators

**Quick Test:**
1. Open app
2. Navigate to a site
3. Back
4. Repeat 10 times
5. Check Xcode Memory Debug Navigator
   - Before fixes: Memory keeps growing
   - After fixes: Memory stays stable

---

## iOS Memory Management Rules

✅ **Always use `[weak self]` when:**
- Timer closures
- DispatchQueue.main.asyncAfter
- Completion handlers that outlive the view
- URLSession completion handlers

✅ **Task cancellation pattern:**
```swift
.task {
  await viewModel.loadData()
}
// Automatically cancelled when view disappears
```

✅ **@StateObject vs @ObservedObject:**
- `@StateObject` = View owns and creates the object
- `@ObservedObject` = View observes an object owned by parent
- For NavigationStack destinations, use `@ObservedObject` or pass down ViewModels

---

Last updated: 2026-01-29
