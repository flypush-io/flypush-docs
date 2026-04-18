---
id: analytics
title: Analytics
sidebar_label: Analytics
---

# Analytics

## Overview

```
GET /v1/analytics/:projectId/overview?days=30
```

**Auth:** JWT

Returns aggregated delivery metrics for the specified project and time range.

### Query params

| Param | Default | Description |
|---|---|---|
| `days` | `30` | Time range: `7`, `14`, `30`, or `90` |

### Response

```json
{
  "overview": {
    "notificationsSent": 124500,
    "delivered": 121200,
    "deliveryRate": 97.35,
    "opened": 24300,
    "openRate": 20.05,
    "failedTokens": 210
  },
  "dailyData": [
    { "date": "2024-11-01", "delivered": 4200, "failed": 80 },
    { "date": "2024-11-02", "delivered": 3900, "failed": 65 }
  ],
  "platformBreakdown": [
    { "platform": "IOS", "total": 68000 },
    { "platform": "ANDROID", "total": 52000 },
    { "platform": "WEB", "total": 4500 }
  ],
  "topNotifications": [
    {
      "id": "notif_01",
      "title": "Flash sale starts now",
      "deliveries": 45200,
      "sentAt": "2024-11-15T10:00:00Z"
    }
  ]
}
```

### Field reference

| Field | Description |
|---|---|
| `notificationsSent` | Total notifications created in period |
| `delivered` | Successfully delivered (APNS/WebSocket ACK) |
| `deliveryRate` | `delivered / notificationsSent * 100` |
| `opened` | Notifications tapped/clicked |
| `openRate` | `opened / delivered * 100` |
| `failedTokens` | Tokens invalidated in period (Unregistered, BadDeviceToken) |
| `dailyData` | Per-day breakdown, gaps filled for continuous chart |
| `platformBreakdown` | Total deliveries per platform |
| `topNotifications` | Top 10 by delivery count |

---

## Per-notification breakdown

```
GET /v1/analytics/notifications/:notificationId
```

**Auth:** JWT or API Key

### Response

```json
{
  "notification": {
    "id": "notif_01",
    "title": "Flash sale starts now",
    "sentAt": "2024-11-15T10:00:00Z",
    "status": "COMPLETED"
  },
  "stats": {
    "total": 45200,
    "delivered": 44100,
    "failed": 1100,
    "opened": 8820,
    "deliveryRate": 97.57,
    "openRate": 19.99
  },
  "platformBreakdown": [
    { "platform": "IOS", "delivered": 28000, "failed": 800 },
    { "platform": "ANDROID", "delivered": 16100, "failed": 300 }
  ],
  "failureBreakdown": [
    { "reason": "Unregistered", "count": 900 },
    { "reason": "BadDeviceToken", "count": 200 }
  ]
}
```
