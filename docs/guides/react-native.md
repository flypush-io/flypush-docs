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
