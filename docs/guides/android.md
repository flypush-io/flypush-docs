---
id: android
title: Android Integration
sidebar_label: Android
---

# Android Integration

FlyPush delivers Android notifications via a **persistent WebSocket** — no FCM dependency. This gives you lower latency, no Google Play Services requirement, and full control over the transport layer.

## Prerequisites

- Android API 21+ (Android 5.0)
- Kotlin 1.9+ recommended

## 1. Add the dependency

In your app's `build.gradle.kts`:

```kotlin
dependencies {
    implementation("io.flypush:sdk-android:0.1.0")
}
```

Add Maven Central to your repositories if not already present:

```kotlin
repositories {
    mavenCentral()
}
```

## 2. Initialize in Application.onCreate()

```kotlin
import io.flypush.sdk.FlyPush

class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        FlyPush.init(this, apiKey = "fp_your_api_key")
    }
}
```

Register `MyApp` in `AndroidManifest.xml`:

```xml
<application
    android:name=".MyApp"
    ...>
```

## 3. Request permissions (Android 13+)

```kotlin
// In your Activity, request POST_NOTIFICATIONS permission
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
    requestPermissions(
        arrayOf(Manifest.permission.POST_NOTIFICATIONS),
        REQUEST_CODE_NOTIFICATIONS
    )
}
```

## 4. Register the device

Call after the user grants notification permission:

```kotlin
FlyPush.registerDevice(context, userId = "user_123")
```

## 5. Request battery optimization exemption

This is **strongly recommended** to keep the WebSocket alive. Without it, Android may kill the connection in the background.

```kotlin
// In your main Activity:
import io.flypush.sdk.BatteryOptimization

override fun onResume() {
    super.onResume()
    if (!BatteryOptimization.isIgnored(this)) {
        BatteryOptimization.requestExemption(this)
    }
}
```

This opens the system dialog: *"Allow [App] to always run in the background?"*

## 6. Tags and topics

```kotlin
FlyPush.setTags(mapOf("plan" to "premium", "region" to "us"))
FlyPush.subscribe("breaking-news")
FlyPush.unsubscribe("breaking-news")
```

## 7. Custom notification rendering

```kotlin
FlyPush.setNotificationHandler(object : NotificationHandler {
    override fun onMessage(context: Context, message: FlyPushMessage): Notification? {
        val channel = NotificationChannel(
            "alerts",
            "Alerts",
            NotificationManager.IMPORTANCE_HIGH
        )
        (context.getSystemService(NOTIFICATION_SERVICE) as NotificationManager)
            .createNotificationChannel(channel)

        return Notification.Builder(context, "alerts")
            .setContentTitle(message.title)
            .setContentText(message.body)
            .setSmallIcon(R.drawable.ic_notification)
            .setAutoCancel(true)
            .build()
    }
})
```

Return `null` to suppress the notification and handle it yourself.

## How it works

- `FlyPush.init()` starts a **foreground service** that maintains a persistent WebSocket to `wss://push.flypush.io`
- Messages are delivered in real-time when the device is online
- Offline messages are queued server-side (default 72h TTL) and flushed on reconnect
- The service uses exponential backoff reconnect: 1s → 2s → 4s → … → 60s max
- After device reboot, `BootReceiver` restarts the service automatically

## Why no FCM?

See [Android Transport](/concepts/android-transport) for the full explanation.

## Troubleshooting

| Issue | Fix |
|---|---|
| Service stops in background | Request battery optimization exemption |
| No notifications received | Check `FlyPush.registerDevice()` was called |
| Notification not shown | Check `POST_NOTIFICATIONS` permission granted |
