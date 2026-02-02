# Subscription Setup Guide

This guide explains how to set up the in-app purchase subscription in App Store Connect.

## ✅ What's Already Implemented

The app now includes:

1. **SubscriptionService** - Handles StoreKit 2 integration
2. **PaywallView** - Beautiful subscription offering screen with:
   - Clear pricing: $5.99/month
   - 7-day free trial
   - Transparent messaging about API costs
   - Feature list highlighting app benefits
3. **Subscription Status** - Shows in Settings with manage/upgrade options
4. **Auto-paywall** - Displays after sign-in if user not subscribed
5. **StoreKit Configuration** - For local testing (Configuration.storekit)

## 📋 App Store Connect Setup

### Step 1: Create the Subscription

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Navigate to **Features** → **In-App Purchases**
4. Click **+ (Add)** and select **Auto-Renewable Subscription**

### Step 2: Create Subscription Group

1. Name: **Premium Access**
2. Create the group

### Step 3: Configure the Subscription

Use these exact values to match the code:

**Product Details:**
- **Reference Name**: `Monthly Subscription with 7-day trial`
- **Product ID**: `com.quackdb.searchconsole.monthly` (MUST MATCH CODE)
- **Subscription Duration**: 1 month

**Subscription Pricing:**
- **Price**: $5.99 USD
- Let App Store Connect auto-generate prices for other regions

**Subscription Localizations (English - US):**
- **Display Name**: Monthly Subscription
- **Description**: Full access to Search Console analytics and insights

### Step 4: Add Free Trial Offer

1. In the subscription details, scroll to **Introductory Offers**
2. Click **Create Introductory Offer**
3. Configure:
   - **Type**: Free
   - **Duration**: 7 days
   - **Number of Periods**: 1
4. Save the offer

### Step 5: Save and Submit

1. Click **Save** 
2. Submit the subscription for review along with your app

## 🧪 Testing Locally (Before App Store)

### Using StoreKit Configuration File

1. In Xcode, go to **Product** → **Scheme** → **Edit Scheme**
2. Select **Run** → **Options** tab
3. Under **StoreKit Configuration**, select `Configuration.storekit`
4. Now you can test purchases without real money

### Test the Flow

1. Sign in to the app
2. Paywall should appear automatically
3. Tap "Start Free Trial"
4. Complete the purchase (using StoreKit test account)
5. Verify subscription status shows in Settings

## 🧪 Testing on TestFlight

### Create Sandbox Tester

1. Go to **App Store Connect** → **Users and Access**
2. Select **Sandbox Testers**
3. Create a new sandbox tester account
4. Use this account to test on real devices

### Test the Subscription

1. On your test device, go to **Settings** → **App Store** 
2. Scroll down to **Sandbox Account** and sign in with your test account
3. Install the app via TestFlight
4. Test the subscription purchase flow
5. Verify the 7-day trial starts correctly

## 📊 Important Product IDs

Make sure these match exactly:

- **Monthly Subscription**: `com.quackdb.searchconsole.monthly`

If you change the product ID in App Store Connect, you must also update it in:
- `SubscriptionService.swift` (line 16)

## 💰 Revenue & API Costs Transparency

The paywall includes this message:

> "Subscription proceeds primarily cover API costs (Google Search Console, PageSpeed Insights) required to keep the app running and provide you with real-time data. Your support helps maintain reliable service and regular updates."

This is honest and transparent with users about where their money goes.

## 🔒 Admin Bypass

The admin user (`info@quackdb.app`) has special privileges:
- ✅ Bypasses paywall (no subscription required)
- ✅ Unlimited Core Web Vitals API calls (no rate limits)

This is for testing and support purposes.

## 📱 User Experience Flow

### First Launch
1. User sees login screen
2. User signs in with Google
3. Paywall appears automatically
4. User can start 7-day free trial
5. After trial, $5.99/month subscription begins

### Returning User
1. If subscribed: Goes directly to app
2. If trial expired: Paywall appears
3. Can restore purchases if re-installing

### Demo Mode
- No paywall shown
- All features available for testing
- Only available in DEBUG builds

## 🎨 Paywall Features

The paywall showcases:
- ✅ Real-Time Analytics
- ✅ 24-Hour Data Access
- ✅ Core Web Vitals Monitoring
- ✅ Data Export (CSV/PDF)
- ✅ Multiple Properties

## 🔄 Subscription Management

Users can manage their subscription:
1. **In Settings**: Tap "Manage Subscription"
2. Opens Apple's subscription management
3. Can cancel, change, or view billing info

## 📝 Legal Requirements

The paywall includes:
- Clear pricing information
- Auto-renewal notice
- Cancellation policy
- Links to Terms of Service and Privacy Policy

Make sure these URLs are updated:
- `https://quackdb.app/terms` (Terms of Service)
- `https://quackdb.app/privacy` (Privacy Policy)

## 🚀 Launch Checklist

Before launching:

- [ ] Subscription created in App Store Connect
- [ ] Product ID matches code exactly
- [ ] 7-day free trial configured
- [ ] Pricing set to $5.99/month
- [ ] Tested with sandbox account
- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] App submitted with subscription for review

## 🆘 Troubleshooting

### Live App Store: "Unable to load subscription options"

When the app is downloaded from the **real App Store** and the paywall shows "Unable to load subscription options", StoreKit is returning **no products** for `com.quackdb.searchconsole.monthly`. Fix it in App Store Connect:

1. **In-App Purchase exists and matches**
   - App Store Connect → Your app → **Features** → **In-App Purchases**
   - There must be an **Auto-Renewable Subscription** with Product ID **exactly**: `com.quackdb.searchconsole.monthly`
   - If the ID in App Store Connect is different (e.g. typo, different prefix), products will be empty in production.

2. **Subscription is Ready to Submit and included with the app**
   - The subscription must be in **Ready to Submit** (no "Missing Metadata" or draft).
   - It must be **included in the same app version** you submitted. If you added the IAP after submitting the build, create a new version and submit again with the IAP.

3. **Paid Applications Agreement and banking**
   - **Agreements, Tax, and Banking** must be complete and **Paid Applications** agreement **Active**.
   - Until this is done, in-app purchases do **not** work in production (only in Sandbox).

4. **Bundle ID**
   - The in-app purchase is tied to the app’s **Bundle ID** (e.g. `TarikZukic.Search-Console`). The IAP must be under that app in App Store Connect.

5. **Propagation**
   - New IAPs or new app versions can take a few hours to propagate. If you just submitted, wait and retry later.

After fixing the above, ship a new build if needed and have users update. The paywall now shows the **actual StoreKit error** under "Unable to load subscription options" when present (e.g. "Cannot connect to iTunes Store", or product-not-found style messages) so you can confirm the cause.

**Paywall doesn't appear (local/simulator):**
- Check that StoreKit Configuration is selected in scheme (for local testing)
- Verify product ID matches exactly
- Check SubscriptionService loads products successfully

**Can't complete purchase:**
- Ensure signed into sandbox account (Settings → App Store) when testing
- Check that subscription is approved in App Store Connect
- Verify app has correct capabilities (In-App Purchase)

**Trial doesn't work:**
- Verify introductory offer is configured in App Store Connect
- Check that offer duration is 7 days, 1 period
- Ensure offer type is "Free"

## 📞 Support

For issues with:
- **StoreKit**: Check Apple's documentation
- **App Store Connect**: Use Apple's support
- **Code implementation**: Review SubscriptionService.swift and PaywallView.swift
