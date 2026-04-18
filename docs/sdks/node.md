---
id: node
title: Node.js SDK
sidebar_label: Node.js
---

# Node.js Server SDK

```bash
npm install @flypush/node
```

Zero runtime dependencies. Requires Node.js 18+ (uses native `fetch`).

## Initialize

```typescript
import { FlyPush } from "@flypush/node";

const client = new FlyPush({ apiKey: "fp_your_api_key" });
```

| Option | Type | Description |
|---|---|---|
| `apiKey` | string | Your FlyPush API key |
| `baseUrl` | string | Override API URL (default: `https://api.flypush.io`) |

## Notifications

```typescript
// Send to all devices
await client.notifications.send({
  to: { type: "all" },
  title: "Hello!",
  body: "Your order shipped.",
  data: { orderId: "abc123" },
});

// Send to a topic
await client.notifications.send({
  to: { type: "topic", topic: "breaking-news" },
  title: "Breaking News",
  body: "Story here.",
});

// Send to a specific device token
await client.notifications.send({
  to: { type: "device", token: "device_token" },
  title: "Personal",
  body: "Just for you.",
});

// Schedule for later
await client.notifications.send({
  to: { type: "all" },
  title: "Good morning!",
  body: "Rise and shine.",
  scheduledAt: "2024-12-01T08:00:00Z",
});

// Batch send
await client.notifications.sendBatch([
  { to: { type: "device", token: "tok1" }, title: "Hi Alice", body: "..." },
  { to: { type: "device", token: "tok2" }, title: "Hi Bob",   body: "..." },
]);
```

## Devices

```typescript
const device = await client.devices.register({
  platform: "IOS",
  token: "apns_token",
  userId: "user_123",
  tags: ["premium"],
});

await client.devices.update(device.id, { tags: ["premium", "beta"] });
await client.devices.subscribe(device.id, "breaking-news");
await client.devices.unregister(device.id);
```

## Error handling

```typescript
import { FlyPushError } from "@flypush/node";

try {
  await client.notifications.send({ ... });
} catch (err) {
  if (err instanceof FlyPushError) {
    console.error(`${err.statusCode} ${err.code}: ${err.message}`);
  }
}
```

5xx errors are retried automatically (3 attempts, 2s/4s/8s backoff).
