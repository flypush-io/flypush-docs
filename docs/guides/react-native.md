---
id: react-native
title: React Native
sidebar_label: React Native
---

# React Native Integration

The `@flypush/react-native` SDK wraps the FlyPush REST API and provides a `useFlyPush()` hook for function components.

## Installation

```bash
npm install @flypush/react-native @react-native-async-storage/async-storage
```

For iOS, install pods:

```bash
cd ios && pod install
```

## Setup

### 1. Configure once (e.g. in `App.tsx`)

```tsx
import { configure } from "@flypush/react-native";

configure({ apiKey: "fp_your_api_key" });
```

### 2. Request permissions and register

You need a notification library to get the device token. Here's an example with `@notifee/react-native`:

```tsx
import { registerDevice } from "@flypush/react-native";
import notifee, { AuthorizationStatus } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";

async function setupPush() {
  const settings = await notifee.requestPermission();
  if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) return;

  // For iOS: get APNS token
  // For Android with FCM fallback: get FCM token
  const token = await messaging().getToken();

  await registerDevice({
    token,
    userId: "user_123",
    tags: ["premium"],
  });
}
```

:::tip No FCM on Android?
If you want to use FlyPush's native Android WebSocket transport (no FCM), use the [Android SDK](/guides/android) directly in a native module or via the React Native Android SDK bridge (coming soon).
:::

## Handling messages in the foreground

When the app is **open**, the OS delivers the push but your notification library controls whether to show a system alert. Use your library's foreground handler to intercept the message and show a custom in-app UI instead:

```tsx
// With @notifee/react-native
import notifee, { EventType } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";

// Register foreground handler (call in App.tsx)
useEffect(() => {
  // Intercept incoming push while app is in foreground
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    const { title, body } = remoteMessage.notification ?? {};
    // Show an in-app banner instead of a system notification
    showInAppBanner({ title, body, data: remoteMessage.data });
  });

  return unsubscribe;
}, []);
```

Or with Notifee's event listener:

```tsx
useEffect(() => {
  return notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      // User tapped notification while app was open
      navigateTo(detail.notification?.data?.url as string);
    }
  });
}, []);
```

:::tip
`fetchMessages()` covers a different scenario — messages that arrived while the app was **completely closed** (no foreground handler running). Use both together for full coverage.
:::

## useFlyPush hook

```tsx
import { useFlyPush } from "@flypush/react-native";

export function NotificationSettings() {
  const fp = useFlyPush();

  return (
    <View>
      <Text>Device ID: {fp.deviceId ?? "Not registered"}</Text>
      <Button
        title="Subscribe to News"
        onPress={() => fp.subscribe("breaking-news")}
      />
      <Button
        title="Unsubscribe"
        onPress={() => fp.unsubscribe("breaking-news")}
      />
    </View>
  );
}
```

## API

```typescript
configure({ apiKey, baseUrl? })

registerDevice({ token, userId?, tags? }) → Promise<string>

setUserId(id: string)
setTags(tags: string[])
subscribe(topic: string)
unsubscribe(topic: string)
unregister()

// Hook
useFlyPush() → {
  deviceId: string | null,
  isReady: boolean,
  registerDevice,
  setUserId,
  setTags,
  subscribe,
  unsubscribe,
  unregister,
}
```

## Requirements

- React Native 0.68+
- iOS 14+
- Android API 21+

## Receiving missed messages

When the app was closed or in the background, notifications may not have been received. Call `fetchMessages()` after the app comes to foreground to drain the server queue:

```tsx
import { fetchMessages } from "@flypush/react-native";
import { AppState } from "react-native";

// In App.tsx — check for missed messages when app becomes active
AppState.addEventListener("change", async (state) => {
  if (state === "active") {
    const messages = await fetchMessages();
    for (const msg of messages) {
      console.log(`[Missed] ${msg.title}`, msg.data);
      // Show in-app notification banner or badge
    }
  }
});
```

Or with the hook:

```tsx
import { useFlyPush } from "@flypush/react-native";

function App() {
  const { fetchMessages } = useFlyPush();

  useEffect(() => {
    // Fetch on mount
    fetchMessages().then((msgs) => {
      if (msgs.length > 0) console.log(`${msgs.length} missed messages`);
    });
  }, []);
}
```

Messages are consumed on each call — each message is delivered once.

## API reference

```typescript
configure({ apiKey, baseUrl? })

registerDevice({ token, userId?, tags? }) → Promise<string>

setUserId(id: string) → Promise<void>
setTags(tags: string[]) → Promise<void>
subscribe(topic: string) → Promise<void>
unsubscribe(topic: string) → Promise<void>
unregister() → Promise<void>
fetchMessages() → Promise<PushMessage[]>   // drain offline queue

interface PushMessage {
  notificationId: string;
  title: string;
  body: string;
  imageUrl?: string;
  data?: Record<string, unknown>;
}

// Hook
useFlyPush() → {
  deviceId: string | null,
  isReady: boolean,
  registerDevice,
  setUserId,
  setTags,
  subscribe,
  unsubscribe,
  unregister,
  fetchMessages,
}
```
