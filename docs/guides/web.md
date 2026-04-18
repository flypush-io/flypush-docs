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

Clicking the notification navigates to `data.url`.

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
