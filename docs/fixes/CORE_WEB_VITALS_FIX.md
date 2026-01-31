# Core Web Vitals - CRITICAL FIXES REQUIRED

## 🚨 **TWO PROBLEMS IDENTIFIED**

### Problem 1: API Key Not Loading ✅ **FIXED**
**Issue:** The app was reading from `Info.plist` but Xcode uses auto-generated Info.plist (`GENERATE_INFOPLIST_FILE = YES`), so the custom Info.plist file was being ignored.

**Fix Applied:** Added API key to Xcode build settings using `INFOPLIST_KEY_PAGESPEED_API_KEY`

**Status:** ✅ Fixed - API key should now load correctly

---

### Problem 2: Google Cloud Quota Set to ZERO ⚠️ **ACTION REQUIRED**
**Issue:** Your Google Cloud project has PageSpeed API quota set to **0 requests per day**.

**Evidence from logs:**
```json
"quota_limit_value": "0"
"quota_limit": "defaultPerDayPerProject"
```

This means the PageSpeed Insights API is effectively **DISABLED** for your project.

---

## 🔧 **IMMEDIATE ACTION REQUIRED**

### Step 1: Enable PageSpeed API Quota

1. Go to **Google Cloud Console Quotas**:
   ```
   https://console.cloud.google.com/iam-admin/quotas?project=583797351490
   ```

2. Search for: **"PageSpeed Insights API"**

3. Find quota: **"Queries per day per project"**

4. Click **"EDIT QUOTAS"** or **"MANAGE QUOTAS"**

5. Request quota increase:
   - Current limit: **0** (this is the problem!)
   - New limit: **25,000** (free tier default)
   - Or higher if needed

6. Fill out the form:
   - Name: Your name
   - Email: Your email
   - Phone: Your phone
   - Reason: "Need to enable PageSpeed Insights API for iOS app development"

7. Submit request

**Note:** Quota increases are usually approved within minutes to hours for standard amounts like 25,000.

---

### Step 2: Verify API is Enabled

1. Go to **API Library**:
   ```
   https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com?project=583797351490
   ```

2. Make sure it shows **"API Enabled"**

3. If it shows "Enable", click **ENABLE**

---

### Step 3: Check API Key Restrictions

1. Go to **Credentials**:
   ```
   https://console.cloud.google.com/apis/credentials?project=583797351490
   ```

2. Click on your API key: `AIzaSyDtPhY9O6DMYxBceYSPmjsXSyufTwwAmpM`

3. Under **Application restrictions**:
   - Select: **"None"**
   - ❌ DO NOT use "iOS apps" restriction

4. Under **API restrictions**:
   - Select: **"Restrict key"**
   - Check ONLY: ✅ **"PageSpeed Insights API"**

5. Click **SAVE**

---

## 🧪 **TEST AFTER FIXES**

1. Clean build folder in Xcode:
   - Product → Clean Build Folder (Cmd+Shift+K)

2. Run the app on simulator

3. Navigate to **Core Web Vitals**

4. Open **Xcode Console** (View → Debug Area → Activate Console)

5. Tap **"Clear Cache & Retry"** button

6. Look for these logs:

### ✅ **SUCCESS - Should see:**
```
🔑 [PageSpeed] API Key from Info.plist: AIzaSy...
✅ [PageSpeed] API key added to request (length: 39)
📡 [PageSpeed] Response status code: 200
✅ [PageSpeed] Successfully decoded response
```

### ❌ **STILL FAILING - Will see:**
```
📡 [PageSpeed] Response status code: 429
"quota_limit_value": "0"
```
(This means quota is still 0 - wait for Google's approval)

---

## 📊 **Why Quota Was Zero**

Possible reasons:
1. **Project never had quota allocated** - New project or API just enabled
2. **Quota was manually set to 0** - Check project quota settings
3. **Billing not enabled** - Some APIs require billing (unlikely for PageSpeed)
4. **Project restrictions** - Organization policy limiting API usage

---

## 🆓 **Free Tier Limits**

PageSpeed Insights API free tier:
- **25,000 queries per day** (default)
- **240 queries per minute** (rate limit)
- **No cost** for this volume

Your app currently makes:
- **2 requests per site** (mobile + desktop)
- **1 check per 24 hours** (rate limited in app)
- **~60 checks per month** per user

This is well within free tier limits.

---

## 🎯 **Next Steps**

1. ✅ **Done:** API key now in build settings
2. ⏳ **You:** Request quota increase to 25,000
3. ⏳ **You:** Verify API is enabled
4. ⏳ **You:** Check/fix API key restrictions
5. ⏳ **You:** Wait for Google approval (minutes to hours)
6. ✅ **Then:** Test app - should work!

---

## 🔍 **Debug Logs Explanation**

Your logs showed:
```
🔑 [PageSpeed] API Key from Info.plist: nil
⚠️ [PageSpeed] No valid API key - making request without authentication
📡 [PageSpeed] Response status code: 429
"quota_limit_value": "0"
```

**What this means:**
1. API key was nil (fixed now ✅)
2. Request sent without authentication
3. Google returned 429 (quota exceeded)
4. Quota limit is literally 0 requests allowed

**Even with API key, quota being 0 means:**
- Authenticated requests would still fail
- You need to increase quota first
- Then API key will allow higher rate limits

---

## 💡 **Why This Wasn't Caught Earlier**

The error message "Rate Limited" could mean two things:
1. Hit daily quota (normal - wait 24 hours)
2. Quota is set to 0 (abnormal - requires admin action)

The detailed error response shows it's #2:
```json
"quota_limit_value": "0"
```

This is unusual and suggests the API was never properly configured for this project.

---

## 📞 **If Quota Request Is Denied**

If Google denies the quota request:

1. Try enabling **Billing** on the project:
   ```
   https://console.cloud.google.com/billing?project=583797351490
   ```

2. Link a billing account (still free tier, just verified)

3. Re-request quota increase

4. Contact Google Cloud Support if still blocked

---

## 🚀 **Alternative Solution**

If you can't get quota increased, you could:

1. **Use Web Version Link** (already implemented):
   - Button directs users to https://pagespeed.web.dev
   - Users can check manually

2. **Make it Optional**:
   - Show "Core Web Vitals" as disabled/unavailable
   - Add banner: "API quota exceeded - contact support"

3. **Create New Project**:
   - New Google Cloud project
   - Generate new API key
   - Should have default 25,000 quota
   - Replace key in build settings

---

## ✅ **Checklist**

Before App Store submission:

- [ ] Quota increased to 25,000+
- [ ] API enabled in Google Cloud
- [ ] API key restrictions set correctly
- [ ] Test on device (not just simulator)
- [ ] Verify logs show status 200
- [ ] Core Web Vitals data loads correctly
- [ ] Rate limiting works (24h cache)
- [ ] Error handling works if API fails

---

**Current Project:** `projects/583797351490`
**Current API Key:** `AIzaSyDtPhY9O6DMYxBceYSPmjsXSyufTwwAmpM`
**Quota Link:** https://console.cloud.google.com/iam-admin/quotas?project=583797351490
