---
id: web
title: Web Push SDK
sidebar_label: Web (@flypush/web)
---

# Web Push SDK (`@flypush/web`)

Browser push notifications via the Web Push API and VAPID. No FCM account needed.

```bash
npm install @flypush/web
```

Zero runtime dependencies. Requires a browser with Service Worker and Push API support.

## Quick start

```typescript
import { FlyPush } from "@flypush/web";

const flyPush = new FlyPush({
  apiKey: "fp_your_api_key",
  vapidPublicKey: "your_vapid_public_key_from_dashboard",
});

// Register service worker (call once at app startup)
await flyPush.init();

// Request permission + subscribe (must be called from a user gesture)
const deviceId = await flyPush.requestPermission();
```

See the [Web Push integration guide](/guides/web) for a full walkthrough including service worker setup.

## Constructor

```typescript
new FlyPush(options: FlyPushInitOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | string | Yes | Your FlyPush API key |
| `vapidPublicKey` | string | Yes | VAPID public key from Dashboard → Project → Credentials |
| `baseUrl` | string | No | Override API base URL (default: `https://api.flypush.io`) |
| `serviceWorkerPath` | string | No | Path to service worker (default: `/flypush-sw.js`) |

## Methods

### `init(): Promise<void>`
Registers the service worker. Call once at app startup. Does not request notification permission.

### `requestPermission(): Promise<string>`
Requests notification permission from the browser, subscribes to push, and registers the device with FlyPush. Returns the device ID. Must be called in response to a user gesture.

### `onMessage(handler): void`
Registers a callback for push messages received while the tab is open and focused. The service worker routes the push to this handler instead of showing a system notification.

```typescript
flyPush.onMessage((message) => {
  console.log(message.title, message.body, message.data);
});
```

### `fetchMessages(): Promise<PushMessage[]>`
Drains the server-side offline queue. Call on page load to receive notifications missed while the browser was closed. Each call consumes the queue.

### `setUserId(id: string): void`
Associates the current device with a user ID.

### `setTags(tags: string[]): void`
Replaces the device's tag list.

### `subscribe(topic: string): Promise<void>`
Subscribes the device to a topic.

### `unsubscribe(topic: string): Promise<void>`
Unsubscribes the device from a topic.

### `unregister(): Promise<void>`
Unregisters the device from FlyPush and unsubscribes from browser push.

## Types

```typescript
interface PushMessage {
  notificationId: string;
  title: string;
  body: string;
  imageUrl?: string;
  data?: Record<string, unknown>;
}

class FlyPushError extends Error {
  statusCode: number;
  code: string;
}
```

## Error handling

```typescript
import { FlyPushError } from "@flypush/web";

try {
  await flyPush.requestPermission();
} catch (err) {
  if (err instanceof FlyPushError) {
    console.error(`${err.statusCode} ${err.code}: ${err.message}`);
  }
}
```

5xx errors on device registration are retried automatically (3 attempts with exponential backoff).