---
id: android-transport
title: Android Transport
sidebar_label: Android Transport
---

# Why FlyPush doesn't use FCM for Android

Most push notification services route Android notifications through **Firebase Cloud Messaging (FCM)**. FlyPush uses a **persistent WebSocket** instead. Here's why.

## Problems with FCM

### 1. Google Play Services dependency

FCM requires Google Play Services on the device. This excludes:
- Huawei devices (no Play Services since 2019)
- Custom Android ROMs (LineageOS, GrapheneOS)
- Android TV, Chromebooks, and other non-phone form factors
- Devices in China (Play Services banned)

FlyPush's WebSocket works on any Android 5+ device with an internet connection.

### 2. Latency

FCM adds a hop through Google's infrastructure. In practice this adds 100–500ms of latency. FlyPush delivers directly over the WebSocket — latency is just network RTT.

### 3. Rate limits and quota

FCM has per-app and per-device rate limits that are opaque and hard to debug. FlyPush's limits are your own infrastructure.

### 4. Data privacy

FCM routes your notification payloads through Google's servers. FlyPush routes directly from your infrastructure to the device — no third-party sees the data.

## How FlyPush Android works

1. The Android SDK starts a **foreground service** at app launch
2. The service opens a persistent WebSocket to `wss://push.flypush.io`
3. Authentication happens via the device token on the WebSocket handshake
4. When you send a notification, the backend publishes to a Redis pub-sub channel for the project
5. The WebSocket server fans out to all connected clients for that project
6. The SDK shows the notification via `NotificationManager`

### Offline delivery

If the device is offline, the message is pushed to a per-device Redis queue (`device:{id}:queue`) with a configurable TTL (default 72 hours). When the device reconnects, the service drains the queue in order.

### Battery optimization

Android 6+ may kill background services to save battery. The SDK uses `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` to request exemption from the user. Call `BatteryOptimization.requestExemption(activity)` from your onboarding flow.

### Reconnect strategy

Exponential backoff: 1s → 2s → 4s → 8s → ... → 60s cap. The service reconnects indefinitely until successful.

## Trade-offs

| | FlyPush WebSocket | FCM |
|---|---|---|
| Google Play Services required | ✗ | ✓ |
| Works in China | ✓ | ✗ |
| Latency | ~RTT | +100–500ms |
| Battery impact | Low (persistent connection) | Minimal (system-managed) |
| Data through Google | ✗ | ✓ |
| Setup complexity | None | Requires Firebase project |
