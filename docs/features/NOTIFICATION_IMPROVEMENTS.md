# Push Notification Improvements

## What's New

### 1. Enhanced Notification Types

**Daily Summary** 📊
- Customizable time (any hour from 12 AM - 11 PM)
- Performance recap every 24 hours
- Default: 9:00 AM

**Weekly Report** 📈
- Choose any day of the week
- Customizable time
- 7-day summary
- Default: Monday at 9:00 AM

**Monthly Report** 🎯 (NEW)
- Choose day of month (1-28)
- Customizable time
- 30-day insights
- Default: 1st of month at 9:00 AM

**Performance Alerts** ⚡️ (NEW)
- Real-time notifications for significant traffic changes
- Time-sensitive interruption level
- Daily checks for anomalies

**Core Web Vitals Alerts** 🚨 (NEW)
- Weekly checks for poor CWV performance
- Critical alert sound for urgent issues
- Helps catch performance regressions early

### 2. Better UI/UX

**Organized Layout:**
- Each notification type has its own section
- Icon indicators for notification type
- Descriptive subtitles explaining each option
- Time pickers appear inline when enabled

**Visual Hierarchy:**
- Main toggle for all notifications
- Sub-toggles appear only when notifications enabled
- Settings indented for visual grouping
- Dividers separate notification types

**Time Customization:**
- Daily: Pick hour (12 AM - 11 PM)
- Weekly: Pick day of week + hour
- Monthly: Pick day of month (1-28) + hour
- Formatted as "9:00 AM" for clarity

**Test Notification:**
- "Send Test Notification" button
- Sends immediately (2 second delay)
- Confirms notifications are working

### 3. Technical Improvements

**Notification Features:**
- ✅ Badge count support
- ✅ Sound alerts
- ✅ Banner display
- ✅ Notification center persistence
- ✅ Category identifiers for organization
- ✅ Time-sensitive interruption levels for alerts
- ✅ Critical alerts for CWV issues

**Better Cleanup:**
- Clear all notifications when disabled
- Clear badge count on disable
- Individual notification cancellation
- Proper memory management

**Helper Functions:**
- `formatHour()` - Converts 24h to 12h format
- `scheduleAllNotifications()` - Batch scheduling
- Persists settings with @AppStorage
- Auto-reschedules on setting changes

## Settings Location

**Settings → Preferences → Push Notifications**

Structure:
```
┌─────────────────────────────────────┐
│ 🔔 Push Notifications         [ON] │
├─────────────────────────────────────┤
│   📊 Daily Summary                  │
│   Performance recap every 24 hours  │
│   └─ Time: [9:00 AM ▼]              │
├─────────────────────────────────────┤
│   📅 Weekly Report                  │
│   7-day summary on your chosen day  │
│   └─ Day: [Monday ▼] Time: [9:00 AM]│
├─────────────────────────────────────┤
│   📈 Monthly Report                 │
│   30-day insights on 1st each month │
│   └─ Day: [1 ▼] Time: [9:00 AM ▼]  │
├─────────────────────────────────────┤
│   ⚡️ Performance Alerts             │
│   Significant traffic changes       │
├─────────────────────────────────────┤
│   🚨 Core Web Vitals Alerts         │
│   Weekly alerts for poor CWV        │
├─────────────────────────────────────┤
│   [📤 Send Test Notification]       │
└─────────────────────────────────────┘
```

## Storage Keys

All settings persist using @AppStorage:
- `pushNotificationsEnabled` - Master toggle
- `dailySummaryEnabled` - Daily summary on/off
- `dailySummaryHour` - Hour (0-23)
- `weeklyReportEnabled` - Weekly report on/off
- `weeklyReportDay` - Day (1=Sunday, 7=Saturday)
- `weeklyReportHour` - Hour (0-23)
- `monthlyReportEnabled` - Monthly report on/off
- `monthlyReportDay` - Day of month (1-28)
- `monthlyReportHour` - Hour (0-23)
- `performanceAlertsEnabled` - Performance alerts on/off
- `coreWebVitalsAlertsEnabled` - CWV alerts on/off

## Notification Identifiers

- `daily_performance_summary` - Daily summary
- `weekly_report` - Weekly report
- `monthly_report` - Monthly report
- `performance_alerts` - Performance alerts
- `cwv_alerts` - Core Web Vitals alerts

## Permission Handling

1. First enable requests iOS notification permission
2. User grants/denies in system dialog
3. If granted, all enabled notifications are scheduled
4. If denied, toggle stays off and shows disabled state
5. Can retry permission request by toggling off/on

## Future Enhancements (Not Implemented Yet)

These could be added later:
- [ ] Rich notifications with actual data (clicks, impressions)
- [ ] Custom thresholds for performance alerts
- [ ] Notification actions (View in App, Dismiss, Snooze)
- [ ] Push notification via APNS (requires backend)
- [ ] Per-site notification preferences
- [ ] Notification history view

## Notes

- All notifications are **local** (scheduled on device)
- No backend/server required
- No real-time data in notifications (generic messages)
- Actual data shown when user opens the app
- Weekly CWV check happens every 7 days (not specific day)
- Performance alerts check daily at midnight
