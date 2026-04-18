---
id: webhooks
title: Webhooks
sidebar_label: Webhooks
---

# Webhooks

FlyPush sends HTTP `POST` requests to your endpoint when events occur.

## Create a webhook

```
POST /v1/webhooks
```

**Auth:** JWT

```json
{
  "url": "https://yourapp.com/webhooks/flypush",
  "events": ["notification.delivered", "notification.opened", "device.invalid"],
  "secret": "your_signing_secret"
}
```

---

## Events

| Event | Trigger |
|---|---|
| `notification.queued` | Notification accepted and queued |
| `notification.completed` | All batches finished |
| `notification.failed` | Fatal delivery failure |
| `notification.delivered` | Individual device delivery confirmed |
| `notification.opened` | Device reported notification opened |
| `device.registered` | New device token registered |
| `device.invalid` | Token marked as invalid (bounced) |

---

## Payload schema

```json
{
  "event": "notification.delivered",
  "projectId": "proj_01h9abc",
  "timestamp": "2024-11-30T12:00:05Z",
  "data": {
    "notificationId": "notif_01h9xyz",
    "deviceId": "dev_01h9abc",
    "platform": "IOS",
    "deliveredAt": "2024-11-30T12:00:05Z"
  }
}
```

---

## Signature verification

Every webhook request includes an `X-FlyPush-Signature` header — an HMAC-SHA256 of the raw request body using your webhook secret.

```typescript
import crypto from "crypto";

function verifySignature(rawBody: Buffer, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

Always verify signatures before processing webhook payloads.

---

## Retries

If your endpoint returns a non-2xx response, FlyPush retries up to **5 times** with exponential backoff (1s, 2s, 4s, 8s, 16s). After 5 failures the delivery is marked as failed.

Delivery logs are available in the dashboard under **Webhooks → Delivery Logs**.

---

## List webhooks

```
GET /v1/webhooks
```

---

## Update webhook

```
PUT /v1/webhooks/:id
```

---

## Delete webhook

```
DELETE /v1/webhooks/:id
```
