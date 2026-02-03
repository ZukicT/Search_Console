# Privacy & Data Collection Disclosure

## Fact-Checked Privacy Statement

### What Data Does This App Access?

This app displays data from **Google Search Console API**, which includes:

1. **Search Analytics Data**
   - Search queries that led users to your website
   - Number of clicks and impressions
   - Click-through rate (CTR)
   - Average position in search results
   - Filtered by date, country, device, and search appearance

2. **Site Information**
   - List of properties you own or have access to in Search Console
   - Permission levels (owner, full user, restricted user)

3. **URL Inspection Data**
   - Google index status of specific pages
   - Crawl information
   - Mobile usability data

4. **Sitemap Data**
   - Submitted sitemaps
   - Sitemap processing status

5. **Core Web Vitals** (via PageSpeed Insights API)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)
   - Interaction to Next Paint (INP)
   - Performance scores

### What Data Does This App Collect or Store?

**The app does NOT collect, store, or transmit your Search Console data to any third-party servers.**

All data is:
- ✅ Fetched directly from Google's servers in real-time
- ✅ Displayed locally on your device
- ✅ Cached temporarily in device memory for performance
- ✅ Never uploaded to external servers
- ✅ Never shared with third parties

### Data Privacy Clarification

**Important**: All data shown in this app is based on:
1. What **Google collects** about your website's search performance
2. What you have **enabled in your Google Account settings**

This app is a **viewer** for your existing Google Search Console data. It does not collect any additional data beyond what Google already collects.

### Google Account Privacy Controls

You control what data Google collects through your Google Account settings:

**Manage Your Google Account Privacy:**
- **Data & Privacy Settings**: https://myaccount.google.com/data-and-privacy
- **Privacy Checkup**: https://myaccount.google.com/intro/privacycheckup
- **Search Console Permissions**: https://search.google.com/search-console/users

### Authentication & Permissions

This app uses **OAuth 2.0** to authenticate with Google:
- You grant read-only access to your Search Console data
- The app requests these specific scopes:
  - `https://www.googleapis.com/auth/webmasters.readonly` (Search Console read-only)
  - `https://www.googleapis.com/auth/userinfo.email` (Email for account identification)
  - `https://www.googleapis.com/auth/userinfo.profile` (Profile for display name)

You can revoke access at any time:
https://myaccount.google.com/permissions

### Third-Party Services Used

1. **Google Search Console API**
   - Purpose: Fetch your website analytics data
   - Data accessed: Search performance metrics
   - Privacy policy: https://policies.google.com/privacy

2. **Google PageSpeed Insights API**
   - Purpose: Fetch Core Web Vitals performance data
   - Data accessed: Public website performance metrics
   - Privacy policy: https://policies.google.com/privacy

3. **Apple StoreKit** (for subscriptions)
   - Purpose: Process in-app purchases
   - Data accessed: Purchase history (managed by Apple)
   - Privacy policy: https://www.apple.com/legal/privacy/

### Data Retention

- **No server-side storage**: Your data is never stored on our servers
- **Local cache**: Temporary cache is cleared when you log out
- **Authentication tokens**: Stored securely in iOS Keychain

### Compliance

This app complies with:
- ✅ Google API Services User Data Policy
- ✅ Apple App Store Review Guidelines
- ✅ GDPR (General Data Protection Regulation)
- ✅ CCPA (California Consumer Privacy Act)

### Your Rights

You have the right to:
1. **Access**: View all data the app displays (it's your Google data)
2. **Control**: Manage permissions in Google Account settings
3. **Delete**: Revoke app access at any time
4. **Export**: Use built-in CSV/PDF export features
5. **Portability**: Your data remains in your Google Account

### Questions or Concerns?

- **App Privacy Policy**: https://search-console.org/privacy.html
- **Google Search Console Help**: https://support.google.com/webmasters
- **Google Privacy Policy**: https://policies.google.com/privacy
- **Contact**: info@quackdb.app

---

**Last Updated**: 2026-02-03

**Fact-Checked Against**:
- Google Search Console API Documentation (2026)
- Google API Services User Data Policy
- Apple App Store Guidelines
- GDPR & CCPA Requirements
