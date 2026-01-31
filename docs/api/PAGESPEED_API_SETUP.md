# PageSpeed Insights API Setup Guide

The Core Web Vitals feature uses Google's PageSpeed Insights API to analyze website performance. To avoid rate limits, you need to add your own API key.

## Why You Need an API Key

Without an API key:
- **Daily quota:** 25-50 requests per day (shared across all users)
- **Rate limits:** Very restrictive

With an API key:
- **Daily quota:** 25,000 requests per day (per project)
- **Rate limits:** 240 requests per minute
- **Cost:** FREE for most usage (see pricing below)

## Step 1: Enable PageSpeed Insights API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Library**
4. Search for **"PageSpeed Insights API"**
5. Click **Enable**

## Step 2: Create an API Key

1. In Google Cloud Console, go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API key**
3. A new API key will be created (e.g., `AIzaSyD...`)
4. **IMPORTANT:** Click **Restrict Key** to secure it:
   - **API restrictions:** Select "Restrict key"
   - Check **PageSpeed Insights API**
   - **Application restrictions:** 
     - Select "iOS apps"
     - Add your bundle ID: `TarikZukic.Search-Console`
   - Click **Save**

## Step 3: Add API Key to Your App

1. Open the Xcode project
2. Navigate to `Search Console/Search Console/Info.plist`
3. Find the key `PAGESPEED_API_KEY`
4. Replace `YOUR_API_KEY_HERE` with your actual API key

```xml
<key>PAGESPEED_API_KEY</key>
<string>AIzaSyD_YOUR_ACTUAL_KEY_HERE</string>
```

**⚠️ Security Note:** Do NOT commit your API key to public repositories!

## Step 4: Rebuild and Test

1. Clean build folder: **Product** → **Clean Build Folder** (⇧⌘K)
2. Rebuild the app: **Product** → **Build** (⌘B)
3. Run the app and test Core Web Vitals

## Pricing

PageSpeed Insights API pricing (as of 2026):

| Requests per Day | Cost |
|------------------|------|
| 0 - 25,000 | FREE |
| 25,001 - 100,000 | $5 per 1,000 requests |
| 100,000+ | Contact Google |

**Typical usage for this app:** 10-50 requests per day per user = FREE

## Quota Management

Monitor your API usage:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Dashboard**
3. Click **PageSpeed Insights API**
4. View quota usage and set up alerts if needed

## Troubleshooting

### Still getting "Rate Limited" error?

1. **Verify API is enabled:**
   - Check Google Cloud Console → APIs & Services → Dashboard
   - PageSpeed Insights API should show "Enabled"

2. **Check API key restrictions:**
   - Go to Credentials → Click your API key
   - Ensure PageSpeed Insights API is checked under API restrictions
   - Ensure iOS bundle ID is correct: `TarikZukic.Search-Console`

3. **Verify key in Info.plist:**
   - Open Info.plist in Xcode
   - Check `PAGESPEED_API_KEY` has your actual key (not placeholder)
   - Key should start with `AIza`

4. **Clean and rebuild:**
   - Product → Clean Build Folder (⇧⌘K)
   - Product → Build (⌘B)

5. **Check quota:**
   - Go to Google Cloud Console → APIs & Services → Quotas
   - Look for PageSpeed Insights API quotas
   - Ensure daily quota isn't exceeded

### API key not working?

- Wait 5-10 minutes after creating the key (propagation time)
- Ensure key restrictions allow iOS apps
- Check that bundle ID matches exactly
- Try creating a new unrestricted key for testing (then restrict it)

### Getting 403 Forbidden?

- API key restrictions are too strict
- Try temporarily removing all restrictions to test
- Then add back restrictions one by one

## Admin Mode

The app has an **Admin Mode** for `info@quackdb.app` that bypasses client-side rate limiting (the 24-hour wait between requests). However, Admin Mode does NOT bypass Google API quotas - you still need an API key with available quota.

## Alternative: Public API (Not Recommended)

You can technically use the PageSpeed API without a key, but you'll hit rate limits very quickly. This is only suitable for testing, not production use.

## Support

For issues with:
- **Google API setup:** [Google Cloud Support](https://cloud.google.com/support)
- **App implementation:** Create an issue in the project repository
