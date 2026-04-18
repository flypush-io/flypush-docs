---
id: devices
title: Devices
sidebar_label: Devices
---

# Devices

Device tokens are the core primitive in FlyPush. Each physical device registers a token; FlyPush uses that token to route notifications.

## Register a device

```
POST /v1/devices/register
```

**Auth:** API Key  
Called by your mobile/web SDK on first launch and whenever the token changes.

### Request

```json
{
  "platform": "IOS",
  "token": "apns_device_token_hex",
  "userId": "user_123",
  "tags": ["premium", "us"],
  "metadata": { "appVersion": "2.1.0", "osVersion": "17.2" }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `platform` | `IOS` \| `ANDROID` \| `WEB` | ✓ | Device platform |
| `token` | string | ✓ | Raw APNS token (hex), FCM token, or Web Push subscription JSON |
| `userId` | string | | Your user ID — links device to a user |
| `tags` | string[] | | Arbitrary tags for segmentation |
| `metadata` | object | | Arbitrary key/value pairs (stored as JSON) |

### Response

```json
{
  "id": "dev_01h9abc",
  "platform": "IOS",
  "token": "apns_token...",
  "userId": "user_123",
  "tags": ["premium", "us"],
  "lastSeenAt": "2024-11-30T12:00:00Z"
}
```

If the token already exists, the record is **upserted** — metadata and tags are updated, `invalidAt` is cleared.

---

## Update a device

```
PUT /v1/devices/:id
```

**Auth:** API Key

```json
{
  "userId": "user_456",
  "tags": ["premium", "us", "beta"],
  "metadata": { "appVersion": "2.2.0" }
}
```

---

## Unregister a device

```
DELETE /v1/devices/:id
```

**Auth:** API Key  
Call when the user logs out or explicitly disables notifications.

---

## Subscribe to topic

```
POST /v1/devices/:id/subscribe
```

```json
{ "topic": "breaking-news" }
```

---

## Unsubscribe from topic

```
POST /v1/devices/:id/unsubscribe
```

```json
{ "topic": "breaking-news" }
```

---

## Token invalidation

FlyPush automatically marks tokens as invalid when:

- **APNS** returns `BadDeviceToken` or `Unregistered`
- **Web Push** returns `410 Gone`

Invalid tokens are excluded from future sends and shown in the dashboard as **Invalid** devices.

When a device re-registers with the same token, `invalidAt` is cleared and the device becomes active again.

---

## List devices (dashboard)

```
GET /v1/projects/:projectId/devices
```

**Auth:** JWT

Query params: `page`, `limit`, `platform`, `search` (token or userId prefix).
