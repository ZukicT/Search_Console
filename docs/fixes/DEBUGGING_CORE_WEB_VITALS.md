# Core Web Vitals Debug Guide

## Issue
Core Web Vitals showing "Rate Limited" error despite API being connected and configured correctly.

## Debug Tools Added

### 1. Comprehensive Logging

**PageSpeedService.swift** now logs:
- ✅ API request start with URL and strategy
- 🔑 API key status (present/missing/length)
- 🌐 Full request URL (for manual testing)
- 📡 HTTP response status code
- 📊 Response data size
- ✅ Successful decode confirmation
- ❌ Detailed error messages with response body

**CoreWebVitalsView.swift** now logs:
- 🚀 Function entry points
- 🔍 Rate limit status and timing
- 💾 Cache status (loaded/empty)
- 📱 API fetch triggers
- ✅ Successful data receipt
- ❌ Error details

### 2. Cache Clearing Button

Added "Clear Cache & Retry" button that appears when rate limited:
- Clears UserDefaults cache
- Resets rate limit timer
- Resets all result data
- Immediately retries fetch

## How to Debug

### Step 1: Check Console Logs
When you tap on Core Web Vitals, look for these log patterns:

**Good API Request:**
```
🔍 [PageSpeed] Starting fetch for: example.com (mobile)
🔑 [PageSpeed] API Key from Info.plist: AIzaSy...
✅ [PageSpeed] API key added to request (length: 39)
🌐 [PageSpeed] Full request URL: https://www.googleapis.com/pagespeedonline/v5/runPagespeed?...
📡 [PageSpeed] Response status code: 200
✅ [PageSpeed] Successfully decoded response
```

**Rate Limited (429):**
```
❌ [PageSpeed] Response status code: 429
❌ [PageSpeed] Error response body: {"error": {...}}
⚠️ [CWV View] Rate limited (429) - saving fetch date
```

**No API Key:**
```
🔑 [PageSpeed] API Key from Info.plist: nil
⚠️ [PageSpeed] No valid API key - making request without authentication
```

### Step 2: Test API Key Manually

Copy the URL from the logs (🌐 Full request URL) and test it in your browser or curl:

```bash
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com&strategy=mobile&category=performance&key=YOUR_API_KEY"
```

Expected response: JSON with `lighthouseResult` object
Error response: `{"error": {"code": 429, "message": "..."}}`

### Step 3: Check API Key Setup

1. **Verify Info.plist:**
   - Open `Search Console/Info.plist`
   - Confirm `PAGESPEED_API_KEY` exists
   - Value should start with `AIza...`
   - Should NOT be empty or "YOUR_API_KEY_HERE"

2. **Verify Google Cloud Console:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click on your PageSpeed API key
   - **Application restrictions**: Should be "None"
   - **API restrictions**: Should have "PageSpeed Insights API" checked
   - **DO NOT** use "iOS apps" restriction

### Step 4: Clear Cache and Retry

If rate limited:
1. Tap "Clear Cache & Retry" button
2. Watch console logs for new API request
3. Check if status code is 200 or 429

### Step 5: Verify API is Enabled

1. Go to: https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com
2. Make sure "PageSpeed Insights API" shows as "ENABLED"
3. Check quota limits: https://console.cloud.google.com/apis/api/pagespeedonline.googleapis.com/quotas

## Common Issues

### Issue 1: Cached Rate Limit
**Symptom:** Shows rate limited immediately without making request
**Solution:** Tap "Clear Cache & Retry" button

### Issue 2: Wrong API Key Restrictions
**Symptom:** 403 Forbidden or 400 Bad Request
**Solution:** Change restrictions to "None" (application) and "PageSpeed Insights API" (API)

### Issue 3: Missing API Key
**Symptom:** Works but gets rate limited quickly (no auth = lower quota)
**Solution:** Verify key is in Info.plist and starts with "AIza"

### Issue 4: API Not Enabled
**Symptom:** 403 Forbidden
**Solution:** Enable PageSpeed Insights API in Google Cloud Console

### Issue 5: Actual Rate Limit
**Symptom:** Status code 429 in logs
**Solution:** Wait 24 hours OR increase quota in Google Cloud Console

## Admin Mode Bypass

If your email is `info@quackdb.app`, the app bypasses the 24-hour rate limit cache.
You can still hit Google's actual API limits, but the app won't prevent you from retrying.

## API Key Location

Current API key in Info.plist: `AIzaSyDtPhY9O6DMYxBceYSPmjsXSyufTwwAmpM`

**IMPORTANT:** This is visible in the app bundle and should be rotated before App Store release if compromised.

## Next Steps for User

1. Open the app in Xcode
2. Run on simulator or device
3. Navigate to Core Web Vitals
4. Open Xcode Console (View → Debug Area → Activate Console)
5. Tap "Clear Cache & Retry" button
6. Share the console logs (everything starting with 🔍, 📡, ✅, ❌)

This will reveal exactly what's happening with the API request.
