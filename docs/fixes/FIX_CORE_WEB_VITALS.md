# Fix Core Web Vitals "Rate Limited" Error

## Quick Fix (2 minutes)

The "Rate Limited" error happens because you need to add your actual Google PageSpeed API key.

### Step 1: Get Your API Key

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "**+ CREATE CREDENTIALS**" → "**API key**"
3. Copy the API key (starts with `AIza...`)

### Step 2: Add Key to App

1. Open Xcode
2. Navigate to: `Search Console/Search Console/Info.plist`
3. Find the line:
   ```xml
   <key>PAGESPEED_API_KEY</key>
   <string>YOUR_API_KEY_HERE</string>
   ```
4. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```xml
   <key>PAGESPEED_API_KEY</key>
   <string>AIzaSyC_your_actual_key_here</string>
   ```
5. Save and rebuild the app

### Step 3: Verify

1. Run the app
2. Go to any site → **Core Web Vitals**
3. Should now show data instead of "Rate Limited"

---

## Important Notes

- **Admin Mode** doesn't bypass rate limits - you NEED an API key
- The PageSpeed API has limits:
  - **Free tier**: 25,000 requests/day  - **Per second**: 1-2 requests/second
- If you still see rate limits, you've exceeded daily quota

---

## Need More Details?

See `PAGESPEED_API_SETUP.md` for full setup instructions including:
- API restrictions
- Security best practices
- Quota management

---

**Current Status**: API key is set to placeholder `YOUR_API_KEY_HERE` (not valid)
**Action Required**: Replace with real API key from Google Cloud Console
