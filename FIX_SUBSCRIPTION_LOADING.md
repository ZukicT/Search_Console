# Fix: Subscription Not Loading - Step-by-Step Guide

## Problem
"Unable to load subscription options" appears when testing subscriptions.

## Important: TestFlight vs Local Testing

**TestFlight builds DO NOT use the local `.storekit` configuration file!**

- **Local testing** (Xcode Simulator/Device in Debug mode): Uses `Configuration.storekit`
- **TestFlight builds**: Connect to **real App Store Connect sandbox servers**

If you're seeing this error in **TestFlight**, skip to the [TestFlight Fix](#testflight-fix-app-store-connect-setup) section.

---

## Root Cause Analysis

### For Local Testing (Xcode)

The StoreKit configuration file exists and is referenced in the scheme, but products aren't loading. This typically happens when:

1. ✅ StoreKit file exists (`Configuration.storekit`)
2. ✅ Scheme references the file (line 53-55 in `.xcscheme`)
3. ⚠️ File might not be added to Xcode project properly
4. ⚠️ Testing in production mode instead of debug mode

### For TestFlight

Products not loading in TestFlight means:

1. ⚠️ Subscription not created in App Store Connect
2. ⚠️ Subscription pending review or not approved
3. ⚠️ Paid Applications Agreement not signed
4. ⚠️ Banking/tax information incomplete
5. ⚠️ Product ID mismatch between code and App Store Connect

---

## Solution: Complete Fix Steps

### Step 1: Verify StoreKit File in Xcode Project

1. Open `Search Console.xcodeproj` in Xcode
2. In Project Navigator (left sidebar), look for `Configuration.storekit`
3. If you DON'T see it:
   - Right-click on "Search Console" folder
   - Select **Add Files to "Search Console"...**
   - Navigate to and select `Configuration.storekit`
   - **IMPORTANT**: Uncheck "Copy items if needed"
   - **IMPORTANT**: Uncheck "Add to targets"
   - Click **Add**

### Step 2: Verify Scheme Configuration

1. Click scheme dropdown (next to device selector)
2. Select **Edit Scheme...**
3. Select **Run** in left sidebar
4. Go to **Options** tab
5. Under **StoreKit Configuration**:
   - Should show: `Configuration.storekit`
   - If it says "None", select `Configuration.storekit` from dropdown
6. Click **Close**

### Step 3: Clean Build

1. In Xcode menu: **Product** → **Clean Build Folder** (⇧⌘K)
2. Wait for cleaning to complete
3. Rebuild: **Product** → **Build** (⌘B)

### Step 4: Run in Debug Mode

**CRITICAL**: StoreKit testing only works in **Debug** mode, not Release mode.

1. Edit Scheme → Run → Info tab
2. Verify **Build Configuration** is set to **Debug** (not Release)
3. Run the app (⌘R)

### Step 5: Verify in Simulator/Device

1. Run the app
2. Navigate to paywall
3. Products should now load
4. You should see "$5.99/month" with "7-day free trial"

---

## Alternative: Manual StoreKit File Path Fix

If the above doesn't work, the scheme might have an incorrect file path.

### Fix the Scheme File Directly:

1. Close Xcode
2. Open this file in a text editor:
   ```
   Search Console/Search Console.xcodeproj/xcshareddata/xcschemes/Search Console.xcscheme
   ```

3. Find this section (around line 53):
   ```xml
   <StoreKitConfigurationFileReference
      identifier = "../../../Search Console/Configuration.storekit">
   </StoreKitConfigurationFileReference>
   ```

4. The path should be relative to the `.xcodeproj` file. Try these alternatives:

   **Option A** (relative to project root):
   ```xml
   <StoreKitConfigurationFileReference
      identifier = "Search Console/Configuration.storekit">
   </StoreKitConfigurationFileReference>
   ```

   **Option B** (absolute path - replace with your actual path):
   ```xml
   <StoreKitConfigurationFileReference
      identifier = "/Users/tarikzukic/Desktop/Spookers/Search_Console/Search Console/Search Console/Configuration.storekit">
   </StoreKitConfigurationFileReference>
   ```

5. Save the file
6. Reopen Xcode
7. Clean build and run

---

## Verification Checklist

After applying fixes, verify:

- [ ] `Configuration.storekit` visible in Xcode Project Navigator
- [ ] Scheme → Run → Options shows `Configuration.storekit`
- [ ] Build Configuration is **Debug** (not Release)
- [ ] Clean build completed successfully
- [ ] App runs without errors
- [ ] Paywall loads and shows products
- [ ] Price displays: "$5.99/month"
- [ ] Trial message: "7-day free trial included"
- [ ] "Start Free Trial" button is enabled

---

## Testing the Subscription

Once products load successfully:

### Test Purchase Flow:

1. Tap "Start Free Trial"
2. Apple StoreKit sheet appears
3. Should show:
   - "Monthly Subscription"
   - "$5.99"
   - "7 Days Free, Then $5.99/Month"
4. Tap "Subscribe"
5. Confirm with Face ID/Touch ID
6. Purchase should succeed
7. Paywall should dismiss

### Test Subscription Status:

1. Go to Settings in the app
2. Should show subscription status
3. Should indicate "Free Trial" active
4. Should show days remaining (7 days)

### Test Cancellation:

1. In StoreKit testing, subscriptions auto-renew quickly
2. You can manage test subscriptions in:
   - Settings → [Your Name] → Subscriptions (on device)
   - Or in Xcode: Debug → StoreKit → Manage Transactions

---

## Common Issues & Solutions

### Issue: "No products available"

**Cause**: StoreKit file not loaded or product ID mismatch

**Fix**:
1. Verify product ID in `Configuration.storekit` matches `SubscriptionService.swift`
2. Should be: `TarikZukic.Search-Console.monthly`
3. Check for typos or extra spaces

### Issue: "Failed to load products: [error]"

**Cause**: Network error or StoreKit not initialized

**Fix**:
1. Check internet connection
2. Restart simulator/device
3. Clean build and run again

### Issue: Products load but purchase fails

**Cause**: Sandbox account issue or StoreKit error simulation

**Fix**:
1. Check `Configuration.storekit` → Settings
2. Verify `_failTransactionsEnabled` is `false`
3. Verify all StoreKit errors are disabled

### Issue: "Transaction verification failed"

**Cause**: StoreKit signature verification (normal in testing)

**Fix**:
1. This is expected in local testing
2. Verification will work properly in TestFlight/Production
3. For local testing, the code handles this gracefully

---

## TestFlight Fix: App Store Connect Setup

**This is the fix for TestFlight builds showing "No subscription products available".**

### Step 1: Check App Store Connect Subscription Status

1. Go to https://appstoreconnect.apple.com
2. Select your app (Search Console)
3. Click **Subscriptions** in the sidebar (under Monetization)
4. Look for subscription group "Premium Access"

**If subscription group exists:**
- Check the subscription status
- Must be "Ready to Submit" or "Approved"
- Verify Product ID is exactly: `TarikZukic.Search-Console.monthly`

**If subscription group doesn't exist:**
- Follow Step 2 below to create it

### Step 2: Create Subscription (if needed)

1. In App Store Connect > Your App > Subscriptions
2. Click **+** to create new subscription group
3. **Group Reference Name**: "Premium Access"
4. Click **Create**
5. Click **+** next to subscriptions to add a subscription
6. Fill in:
   - **Reference Name**: "Monthly Subscription with 7-day trial"
   - **Product ID**: `TarikZukic.Search-Console.monthly` (**MUST MATCH EXACTLY**)
7. Set **Subscription Duration**: 1 Month
8. Set **Subscription Price**: $5.99 (Tier 6)
9. Add **Introductory Offer**:
   - **Type**: Free Trial
   - **Duration**: 7 days
10. Add **Localization** (at least English):
    - **Display Name**: "Monthly Subscription"
    - **Description**: "Full access to Search Console analytics and insights"
11. **Review Information** (if required):
    - Add screenshot of subscription benefits
12. Click **Save**

### Step 3: Check Agreements, Tax, and Banking

1. Go to **App Store Connect > Agreements, Tax, and Banking**
2. Look for **Paid Applications** agreement
3. Status must be **Active** (green checkmark)

**If not active:**
- Click **View and Agree to Terms**
- Complete banking information
- Complete tax information
- Wait for Apple to verify (can take 24-48 hours)

### Step 4: Wait for Propagation

After creating/updating a subscription:
- **Initial setup**: Wait 24-48 hours for sandbox servers to sync
- **Updates**: Wait 1-2 hours for changes to propagate
- New subscriptions may need internal processing before becoming available

### Step 5: Test Again in TestFlight

1. Delete and reinstall the app from TestFlight
2. Sign out of any Apple ID and sign back in
3. Open the app and go to the paywall
4. Tap "Retry" to reload products
5. Products should now load

---

## Production Deployment

For App Store release, you MUST also:

### 1. Verify Subscription in App Store Connect

Ensure all the above TestFlight steps are completed with:
   - **Product ID**: `TarikZukic.Search-Console.monthly` (EXACT MATCH)
   - **Reference Name**: "Monthly Subscription with 7-day trial"
   - **Duration**: 1 month
   - **Price**: $5.99 (Tier 6)
   - **Introductory Offer**: 7-day free trial
   - **Localizations**: English (at least)
   - **Status**: Ready to Submit

### 2. Test with TestFlight

1. Upload build to TestFlight
2. Test with sandbox Apple ID
3. Verify 7-day trial works
4. Verify auto-renewal after trial
5. Test cancellation flow

### 3. Submit for Review

1. Add subscription screenshot to App Review
2. Add review notes explaining subscription
3. Submit app for review

---

## Quick Diagnostic Commands

Run these in Terminal to diagnose issues:

```bash
# Check if StoreKit file exists
ls -la "/Users/tarikzukic/Desktop/Spookers/Search_Console/Search Console/Search Console/Configuration.storekit"

# Validate JSON structure
python3 -m json.tool "/Users/tarikzukic/Desktop/Spookers/Search_Console/Search Console/Search Console/Configuration.storekit"

# Check product ID in code
grep -r "TarikZukic.Search-Console.monthly" "/Users/tarikzukic/Desktop/Spookers/Search_Console/Search Console/Search Console/"

# Check scheme configuration
cat "/Users/tarikzukic/Desktop/Spookers/Search_Console/Search Console/Search Console.xcodeproj/xcshareddata/xcschemes/Search Console.xcscheme" | grep -A 2 "StoreKitConfigurationFileReference"
```

---

## Support Resources

- **Apple StoreKit Testing**: https://developer.apple.com/documentation/xcode/setting-up-storekit-testing-in-xcode
- **Subscription Best Practices**: https://developer.apple.com/app-store/subscriptions/
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/#in-app-purchase

---

## Summary

**Most Likely Fix**: 
1. Verify StoreKit file is in Xcode project
2. Ensure running in **Debug** mode (not Release)
3. Clean build and run

**If Still Not Working**:
1. Fix scheme file path manually
2. Use absolute path to StoreKit file
3. Restart Xcode

**For Production**:
1. Create matching subscription in App Store Connect
2. Test with TestFlight
3. Submit for review

---

**Last Updated**: 2026-02-02  
**Status**: Ready to fix  

**Fix Time Estimates:**
- Local testing fix: 5-10 minutes
- TestFlight fix (App Store Connect setup): 15-30 minutes
- Wait for sandbox propagation: 24-48 hours (first time)
