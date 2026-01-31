# ⚠️ CRITICAL - Before App Store Upload Checklist

## 🚨 DISABLE DEBUG BYPASS BUTTON

**MANDATORY STEP - DO NOT SKIP**

### File: `PaywallView.swift`

**Current (DEBUG MODE):**
```swift
// ⚠️ DEBUG ONLY - SET TO FALSE BEFORE APP STORE UPLOAD ⚠️
private let ENABLE_PAYWALL_BYPASS = true
// ⚠️ DEBUG ONLY - SET TO FALSE BEFORE APP STORE UPLOAD ⚠️
```

**CHANGE TO (PRODUCTION):**
```swift
// ⚠️ DEBUG ONLY - SET TO FALSE BEFORE APP STORE UPLOAD ⚠️
private let ENABLE_PAYWALL_BYPASS = false
// ⚠️ DEBUG ONLY - SET TO FALSE BEFORE APP STORE UPLOAD ⚠️
```

### Location in Xcode:
1. Open `Search Console/Views/PaywallView.swift`
2. Look at **lines 10-12** (top of file)
3. Change `true` → `false`
4. Save the file
5. Rebuild the app

---

## Why This Matters

**If you forget to disable this:**
- ❌ Users can bypass the paywall for free
- ❌ No subscription revenue
- ❌ App Store may reject the app for having a debug bypass

**After disabling:**
- ✅ Paywall cannot be dismissed
- ✅ Users must subscribe to access features
- ✅ Revenue generation works properly

---

## Quick Visual Check

### DEBUG MODE (Current):
When paywall appears, you'll see a **red "DEBUG"** button in the top-right corner:
```
┌─────────────────────────────┐
│                    [X DEBUG] │ ← Red bypass button visible
│                             │
│   Unlock Full Access        │
│                             │
└─────────────────────────────┘
```

### PRODUCTION MODE (After Change):
No debug button visible:
```
┌─────────────────────────────┐
│                             │ ← No bypass button
│                             │
│   Unlock Full Access        │
│                             │
└─────────────────────────────┘
```

---

## Complete Pre-Upload Checklist

Before submitting to App Store Connect:

- [ ] **Set `ENABLE_PAYWALL_BYPASS = false` in PaywallView.swift**
- [ ] Add your PageSpeed API key to Info.plist (see PAGESPEED_API_SETUP.md)
- [ ] Test subscription flow works properly
- [ ] Test restore purchases works
- [ ] Verify paywall cannot be dismissed
- [ ] Remove any test/debug print statements
- [ ] Test on physical device (not just simulator)
- [ ] Increment build number
- [ ] Archive and upload to App Store Connect

---

## How to Test After Disabling

1. Change `ENABLE_PAYWALL_BYPASS = false`
2. Clean build folder (Product → Clean Build Folder)
3. Build and run
4. Sign in with non-subscribed account
5. Try to dismiss paywall:
   - Swipe down → Should NOT work
   - Tap outside → Should NOT work
   - No bypass button visible
6. Only way out should be subscribing or force quitting app

---

## Emergency Re-Enable for Testing

If you need to test again later:
1. Change `false` back to `true`
2. Rebuild
3. Red bypass button will reappear

**Remember to change back to `false` before upload!**

---

## Contact

If you accidentally upload with bypass enabled:
1. Immediately update the build
2. Set to `false`
3. Submit new build to App Store Connect
4. Contact App Store Review to pull previous build

---

**Last Updated:** 2026-01-29  
**Status:** DEBUG MODE ENABLED (bypass active)  
**Action Required:** Disable before production upload
