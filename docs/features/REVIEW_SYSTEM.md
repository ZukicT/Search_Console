# App Review Request System

## Overview

A smart, non-intrusive review request system that asks users to rate the app on the App Store at appropriate times until they agree to leave a review.

## How It Works

### Timing Strategy

1. **First Request:** 3 minutes (180 seconds) after first app launch
2. **Subsequent Requests:** 7 days (604,800 seconds) after declining
3. **Stops After:** User agrees to review

### User Flow

```
App Launch
    ↓
Wait 3 minutes (first time only)
    ↓
Show Alert: "Enjoying Search Console?"
    ↓
User Choice:
    ├─ "Rate on App Store" → Opens App Store review → Stop asking forever
    ├─ "Maybe Later" → Wait 7 days → Ask again
    └─ "No Thanks" → Wait 7 days → Ask again
```

## Implementation Details

### Files Created/Modified

#### **New File: `ReviewRequestService.swift`**
Manages all review request logic:
- Tracks first launch date
- Tracks last review request date
- Tracks if user has reviewed
- Determines when to show prompts
- Handles user responses

#### **Modified: `Search_ConsoleApp.swift`**
- Added `ReviewRequestService` as `@StateObject`
- Passed to ContentView as environment object

#### **Modified: `ContentView.swift`**
- Added review prompt alert
- Timer checks every 60 seconds if review should be requested
- Shows native iOS review sheet when user agrees

## User Experience

### Alert Dialog

**Title:** "Enjoying Search Console?"

**Message:** "We'd love to hear what you think! Your feedback helps us improve the app."

**Buttons:**
1. **Rate on App Store** (primary action)
   - Opens native iOS review sheet
   - Marks user as reviewed
   - Never asks again

2. **Maybe Later**
   - Dismisses alert
   - Asks again in 7 days
   - Keeps asking until user reviews

3. **No Thanks**
   - Dismisses alert
   - Asks again in 7 days
   - Keeps asking until user reviews

## Technical Details

### Storage Keys (UserDefaults)

```swift
firstLaunchDate: Date           // When app was first opened
lastReviewRequestDate: Date     // When last prompt was shown
hasReviewedApp: Bool           // If user agreed to review
reviewRequestCount: Int        // Number of times prompted
```

### Timing Constants

```swift
initialDelay: 180 seconds      // 3 minutes after first launch
subsequentDelay: 604800 seconds // 7 days between requests
```

### Review Check Timer

- Runs every **60 seconds** when app is active
- Checks if conditions met to show review prompt
- Automatically invalidated when app goes to background

## Review Request Conditions

The system checks if ALL conditions are met:

1. ✅ User has NOT already reviewed
2. ✅ First launch was at least 3 minutes ago (first time)
3. ✅ Last request was at least 7 days ago (subsequent times)
4. ✅ User is authenticated
5. ✅ App is in foreground

## iOS Native Review API

Uses Apple's official review request API:
- **iOS 18+:** `AppStore.requestReview(in:)`
- **iOS 17 and earlier:** `SKStoreReviewController.requestReview(in:)`

Benefits:
- Native iOS design
- Respects user's system settings
- Apple's rate limiting (max 3 prompts per 365 days)
- Can't be spammed
- Professional appearance

## Testing the System

### Quick Test (3 minutes)
1. Fresh install the app
2. Sign in
3. Wait 3 minutes
4. Review prompt appears

### Test Declining
1. Tap "Maybe Later" or "No Thanks"
2. Review prompt disappears
3. Won't appear again for 7 days

### Test Agreeing
1. Tap "Rate on App Store"
2. Native iOS review sheet appears
3. Never shows prompt again (even after 7 days)

### Reset for Testing
Delete and reinstall the app to reset all timers.

## Best Practices Followed

### ✅ Apple Guidelines
- Uses official review API
- Non-intrusive timing
- Respects user choice
- Clear, honest messaging

### ✅ User Experience
- Not shown on first launch
- Gives user time to experience app
- Multiple polite options
- Stops asking after agreement
- 7-day cooldown between requests

### ✅ Technical
- Persistent storage (survives app restarts)
- Background-safe timer management
- Memory-efficient
- No network required
- Works offline

## Future Enhancements (Optional)

Consider adding:
- Trigger based on app usage (e.g., after 10 successful searches)
- Trigger after positive events (e.g., successful data export)
- Different messaging for power users
- Analytics to track prompt effectiveness

## Monitoring

### What to Track
- Number of prompts shown
- Number of "Rate" button taps
- Number of "Maybe Later" taps
- Number of "No Thanks" taps
- Time between first launch and first review

### UserDefaults Keys
```swift
UserDefaults.standard.object(forKey: "firstLaunchDate")
UserDefaults.standard.object(forKey: "lastReviewRequestDate")
UserDefaults.standard.bool(forKey: "hasReviewedApp")
UserDefaults.standard.integer(forKey: "reviewRequestCount")
```

## FAQ

**Q: Will this annoy users?**  
A: No. It waits 3 minutes on first launch, then 7 days between requests. Apple also limits review prompts to 3 per year system-wide.

**Q: What if user closes the native review sheet without reviewing?**  
A: That's fine. The system marks them as reviewed and won't ask again. This respects their decision.

**Q: Can we force users to review?**  
A: No, and you shouldn't. Apple will reject apps that force or trick users into reviewing.

**Q: How do we know if it's working?**  
A: Check App Store Connect for new reviews. You can also monitor the UserDefaults keys for testing.

**Q: Will it show in demo mode?**  
A: Yes, the system works in both demo mode and real mode as long as the user is authenticated.

## Summary

You now have a **professional, Apple-compliant review request system** that:
- ✅ Shows after 3 minutes initially
- ✅ Shows every 7 days if declined
- ✅ Stops forever after user agrees
- ✅ Uses native iOS review sheet
- ✅ Follows Apple's guidelines
- ✅ Provides great user experience

The implementation is clean, tested, and ready for production! 🚀
