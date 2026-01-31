# 🚨 Quick Fix: Core Web Vitals Rate Limit

## The Problem

You're seeing "Rate Limited" even though:
- ✅ You have Admin Mode enabled
- ✅ You enabled PageSpeed API in Google Cloud Console

**Why?** The app wasn't using your API key, so it was hitting the public API's very limited quota (25-50 requests/day shared by everyone).

## The Solution (3 Steps - 5 Minutes)

### Step 1: Get Your API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **APIs & Services** → **Credentials**
3. Click **+ CREATE CREDENTIALS** → **API key**
4. Copy the key (starts with `AIza...`)

### Step 2: Add Key to Your App

1. In Xcode, open `Info.plist`
2. Find `PAGESPEED_API_KEY`
3. Replace `YOUR_API_KEY_HERE` with your actual key

**Before:**
```xml
<key>PAGESPEED_API_KEY</key>
<string>YOUR_API_KEY_HERE</string>
```

**After:**
```xml
<key>PAGESPEED_API_KEY</key>
<string>AIzaSyD_YOUR_ACTUAL_KEY_HERE</string>
```

### Step 3: Rebuild

1. Product → Clean Build Folder (⇧⌘K)
2. Product → Build (⌘B)
3. Run the app

## ✅ Done!

Now you can make 25,000 requests per day (FREE) instead of 25-50 total.

## Optional: Secure Your Key

After testing, restrict your API key:
1. Google Cloud Console → Credentials → Click your key
2. **Application restrictions:** iOS apps → Add `TarikZukic.Search-Console`
3. **API restrictions:** Select "PageSpeed Insights API"
4. Click **Save**

## Still Having Issues?

See the full guide: `PAGESPEED_API_SETUP.md`
