# StoreKit Testing Setup

## Issue
"Unable to load subscription options" appears when testing in-app purchases.

## Root Cause
The StoreKit Configuration file (`Configuration.storekit`) is not enabled in the Xcode scheme.

## Solution

### Step 1: Enable StoreKit Configuration in Xcode

1. Open the project in Xcode
2. Click on the scheme dropdown (next to the device selector) → **Edit Scheme...**
3. Select **Run** in the left sidebar
4. Go to the **Options** tab
5. Under **StoreKit Configuration**, select: `Configuration.storekit`
6. Click **Close**

### Step 2: Clean Build Folder

1. In Xcode menu: **Product** → **Clean Build Folder** (⇧⌘K)
2. Rebuild and run the app

### Step 3: Verify Configuration

The `Configuration.storekit` file contains:
- **Product ID**: `TarikZukic.Search-Console.monthly`
- **Price**: $5.99/month
- **Free Trial**: 7 days (1 week)
- **Subscription Period**: Monthly (P1M)
- **Team ID**: NWLJHVV8Y3

## Testing Subscriptions

Once enabled, you can:
- Test purchases without real money
- Test free trial flow
- Test subscription renewal
- Test restore purchases

## Production Setup

For App Store submission, ensure:
1. Create the **exact same product** in App Store Connect:
   - Product ID: `TarikZukic.Search-Console.monthly`
   - Price: $5.99/month
   - Free trial: 7 days
2. Add localized descriptions
3. Add subscription group: "Premium Access"
4. Submit for review

## Common Issues

### "No products available"
- Verify StoreKit configuration is selected in scheme
- Clean build folder and rebuild
- Check product ID matches exactly: `TarikZukic.Search-Console.monthly`

### "Transaction failed"
- Check StoreKit Errors are disabled in Configuration.storekit
- Verify `_failTransactionsEnabled` is `false`

### Testing on Device
- StoreKit testing works on simulator and device
- Use TestFlight for production testing
- Sandbox testing requires sandbox Apple ID

## Reference
- [Apple StoreKit Testing Documentation](https://developer.apple.com/documentation/xcode/setting-up-storekit-testing-in-xcode)
