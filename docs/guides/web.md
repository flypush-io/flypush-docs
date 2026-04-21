---
id: web
title: Web Push
sidebar_label: Web
---

# Web Push Integration

FlyPush delivers browser push notifications via the **Web Push API** and **VAPID** keys. No FCM account needed.

## Prerequisites

- HTTPS (Web Push requires a secure context)
- A browser supporting the Push API (Chrome 50+, Firefox 44+, Edge 17+, Safari 16.1+)

## 1. Install the SDK

```bash
npm install @flypush/web
```

## 2. Copy the service worker

The service worker **must** be at your domain root:

```bash
cp node_modules/@flypush/web/public/flypush-sw.js public/flypush-sw.js
```

Or with Vite, add to `public/`:

```bash
cp node_modules/@flypush/web/public/flypush-sw.js public/
```

## 3. Get your VAPID public key

In the FlyPush dashboard: **Project → Credentials → Web / VAPID**. FlyPush auto-generates a VAPID key pair for each project. Copy the **Public Key**.

## 4. Initialize the SDK

```typescript
import { FlyPush } from "@flypush/web";

const flyPush = new FlyPush({
  apiKey: "fp_your_api_key",
  vapidPublicKey: "your_vapid_public_key_from_dashboard",
});

// Register service worker at app startup
await flyPush.init();
```

## 5. Request permission

:::info
Call this in response to a **user gesture** (button click). Browsers block permission prompts that are not triggered by user interaction.
:::

```typescript
const enableNotifications = async () => {
  try {
    const deviceId = await flyPush.requestPermission();
    console.log("Subscribed! Device ID:", deviceId);
  } catch (err) {
    console.error("Permission denied or subscription failed:", err);
  }
};
```

## 6. React example

```tsx
import { useEffect, useRef } from "react";
import { FlyPush } from "@flypush/web";

export function useNotifications() {
  const fp = useRef<FlyPush | null>(null);

  useEffect(() => {
    fp.current = new FlyPush({
      apiKey: import.meta.env.VITE_FLYPUSH_API_KEY,
      vapidPublicKey: import.meta.env.VITE_FLYPUSH_VAPID_KEY,
    });
    fp.current.init().catch(console.error);
  }, []);

  return {
    enable: () => fp.current?.requestPermission(),
    subscribe: (topic: string) => fp.current?.subscribe(topic),
  };
}
```

## 7. Tags and topics

```typescript
flyPush.setUserId("user_123");
flyPush.setTags(["premium", "us"]);
await flyPush.subscribe("breaking-news");
```

## 8. Foreground message handler

When your tab is **open and focused**, FlyPush routes push events directly to your page instead of showing a system notification. Register a handler with `onMessage()`:

```typescript
flyPush.onMessage((message) => {
  console.log("Push received in foreground:", message.title, message.body);
  // Show an in-app toast, update a badge counter, etc.
  showInAppBanner(message);
});

// Call init() after setting the handler
await flyPush.init();
```

The `message` object shape:

```typescript
interface PushMessage {
  notificationId: string;
  title: string;
  body: string;
  imageUrl?: string;
  data?: Record<string, unknown>;
}
```

:::info How it works
The service worker checks whether any tab with your app is currently focused. If yes, it forwards the push payload to the page via `postMessage` and skips the system notification. If no tab is focused, it falls back to a normal system notification.
:::

### React example — in-app toast

```tsx
import { useEffect, useRef } from "react";
import { FlyPush } from "@flypush/web";

export function useFlyPush() {
  const fp = useRef<FlyPush | null>(null);

  useEffect(() => {
    fp.current = new FlyPush({
      apiKey: import.meta.env.VITE_FLYPUSH_API_KEY,
      vapidPublicKey: import.meta.env.VITE_FLYPUSH_VAPID_KEY,
    });

    fp.current.onMessage((msg) => {
      // e.g. show a toast notification in your UI
      toast(`${msg.title}: ${msg.body}`);
    });

    fp.current.init().catch(console.error);
  }, []);

  return fp;
}
```

## Notification payload

FlyPush sends this JSON to the service worker's `push` event:

```json
{
  "title": "Breaking News",
  "body": "Something important happened.",
  "id": "notif_abc123",
  "imageUrl": "https://example.com/image.png",
  "data": {
    "url": "/news/story-123",
    "icon": "/icon-192.png"
  }
}
```

Clicking a system notification navigates to `data.url`.

## Unsubscribe

```typescript
await flyPush.unregister(); // removes from browser + FlyPush
```

## Browser support

| Browser | Version | Notes |
|---|---|---|
| Chrome | 50+ | Full support |
| Edge | 17+ | Full support |
| Firefox | 44+ | Full support |
| Safari | 16.1+ | macOS Ventura + iOS 16.4+ |
| Opera | 37+ | Full support |

## Receiving missed messages

If your app was closed or push was blocked, messages are queued server-side for up to 72 hours. Call `fetchMessages()` on page load to drain the queue:

```typescript
// On page load — catch any notifications missed while the tab was closed
const messages = await flyPush.fetchMessages();
for (const msg of messages) {
  console.log(`[Missed] ${msg.title}: ${msg.body}`, msg.data);
  // Show an in-app banner, badge, etc.
}
```

Each call consumes the queue — messages are delivered once.

## Why two keys?

Web Push (VAPID) requires **two separate credentials**:

| Key | Where to find it | Used by |
|-----|-----------------|---------|
| **API Key** (`apiKey`) | Dashboard → API Keys | Authenticates your app with the FlyPush API |
| **VAPID Public Key** (`vapidPublicKey`) | Dashboard → Settings → Project | Used by the browser to verify push subscription belongs to you |

The VAPID key pair is generated automatically by FlyPush per project. You only need the **public** key in your frontend code — the private key stays on FlyPush servers and is never exposed.

```typescript
const flyPush = new FlyPush({
  apiKey: "fp_live_...",         // from API Keys page
  vapidPublicKey: "BDx...",     // from Settings → Project → VAPID Public Key
});
```
