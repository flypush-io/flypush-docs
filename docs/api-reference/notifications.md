---
id: notifications
title: Notifications
sidebar_label: Notifications
---

# Notifications

## Send a notification

```
POST /v1/notifications/send
```

**Auth:** API Key

### Request body

```json
{
  "to": { "type": "all" },
  "title": "Your order shipped!",
  "body": "It'll arrive by Friday.",
  "data": { "orderId": "abc123" },
  "imageUrl": "https://example.com/image.png",
  "platforms": ["IOS", "ANDROID"],
  "scheduledAt": "2024-12-01T09:00:00Z"
}
```

### Target types

| `to.type` | Fields | Description |
|---|---|---|
| `all` | — | All devices in the project |
| `device` | `token` | Single device token |
| `topic` | `topic` | All subscribers of a topic |
| `segment` | `segmentId` | Devices matching a segment's rules |

### Full field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `to` | object | ✓ | Delivery target |
| `title` | string | ✓ | Notification title |
| `body` | string | ✓ | Notification body text |
| `data` | object | | Custom JSON payload passed to the device |
| `imageUrl` | string | | Large image URL |
| `platforms` | string[] | | Filter by platform. Default: all |
| `scheduledAt` | ISO 8601 | | Schedule for future delivery |

### Response

```json
{
  "id": "notif_01h9xyz",
  "status": "QUEUED"
}
```

### curl example

```bash
curl -X POST https://api.flypush.io/v1/notifications/send \
  -H "Authorization: Bearer fp_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "to": { "type": "topic", "topic": "breaking-news" },
    "title": "Breaking News",
    "body": "Something big just happened.",
    "data": { "url": "/news/story-456" }
  }'
```

---

## Send batch

```
POST /v1/notifications/send-batch
```

Send multiple notifications with different targets or payloads in one call. Max 100 items per batch.

### Request body

```json
{
  "notifications": [
    {
      "to": { "type": "device", "token": "tok_alice" },
      "title": "Hi Alice",
      "body": "Your report is ready."
    },
    {
      "to": { "type": "device", "token": "tok_bob" },
      "title": "Hi Bob",
      "body": "Your report is ready."
    }
  ]
}
```

### Response

```json
{ "ids": ["notif_01", "notif_02"] }
```

---

## Get notification status

```
GET /v1/notifications/:id
```

**Auth:** API Key or JWT

### Response

```json
{
  "id": "notif_01h9xyz",
  "title": "Breaking News",
  "status": "COMPLETED",
  "sentAt": "2024-11-30T12:00:00Z",
  "stats": {
    "total": 45000,
    "delivered": 44120,
    "failed": 880,
    "opened": 8900
  }
}
```

### Notification statuses

| Status | Description |
|---|---|
| `QUEUED` | Accepted, fan-out not started |
| `SENDING` | Fan-out in progress |
| `COMPLETED` | All batches finished |
| `FAILED` | Fatal error before delivery |
| `SCHEDULED` | Waiting for `scheduledAt` time |
| `CANCELLED` | Cancelled before delivery |

---

## Topics {#topics}

Devices subscribe to named topics. You can send to a topic with `to: { type: "topic", topic: "name" }`.

Topics are created via the dashboard or the [Topics API](/api-reference/topics).

---

## Idempotency

Add an `Idempotency-Key` header to safely retry send requests without duplicate delivery:

```bash
curl -X POST https://api.flypush.io/v1/notifications/send \
  -H "Authorization: Bearer fp_your_api_key" \
  -H "Idempotency-Key: order-shipped-abc123" \
  -H "Content-Type: application/json" \
  -d '...'
```

Duplicate requests with the same key within 24 hours return the original response without resending.
