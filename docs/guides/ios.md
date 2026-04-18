---
id: ios
title: iOS Integration
sidebar_label: iOS
---

# iOS Integration

FlyPush delivers iOS push notifications via **APNS** (Apple Push Notification service). This guide covers SDK setup, credential upload, and background handling.

## Prerequisites

- Xcode 15+
- iOS 14+ deployment target
- An Apple Developer account with push notifications enabled

## 1. Enable push notifications in Xcode

In your target's **Signing & Capabilities** tab, add:
- **Push Notifications**
- **Background Modes** → check **Remote notifications**

## 2. Install the SDK

### Swift Package Manager

In Xcode: **File → Add Package Dependencies**

```
https://github.com/flypush-io/flypush-sdk-ios
```

Or in `Package.swift`:

```swift
.package(url: "https://github.com/flypush-io/flypush-sdk-ios", from: "0.1.0")
```

## 3. Configure in AppDelegate

```swift
import FlyPush
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        FlyPush.shared.configure(apiKey: "fp_your_api_key")
        return true
    }

    // Forward the APNS token to FlyPush
    func application(
        _ application: UIApplication,
        didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
    ) {
        FlyPush.shared.application(
            didRegisterForRemoteNotificationsWithDeviceToken: deviceToken
        )
    }

    func application(
        _ application: UIApplication,
        didFailToRegisterForRemoteNotificationsWithError error: Error
    ) {
        print("APNS registration failed: \(error)")
    }
}
```

## 4. Request permission

Call this in response to a user action (onboarding screen, settings, etc.):

```swift
FlyPush.shared.registerForPushNotifications()
```

This requests `UNUserNotificationCenter` permission and registers with APNS automatically.

## 5. Upload your APNS credentials

In the FlyPush dashboard:

1. Go to **Project → Credentials**
2. Select **iOS / APNS**
3. Upload your `.p8` key file (from Apple Developer → Certificates, Identifiers & Profiles → Keys)
4. Enter your **Key ID** and **Team ID**

FlyPush encrypts the key at rest (AES-256-GCM) and uses it only during delivery.

## 6. Handle foreground notifications (optional)

```swift
import UserNotifications
import FlyPush

// In AppDelegate or SceneDelegate:
let delegate = FlyPushNotificationDelegate { message in
    print("Received in foreground: \(message.title)")
}
UNUserNotificationCenter.current().delegate = delegate
```

## 7. Tag users and subscribe to topics

```swift
FlyPush.shared.setUserId("user_123")
FlyPush.shared.setTags(["premium", "us"])
FlyPush.shared.subscribe(topic: "breaking-news")
```

## Testing

Use the FlyPush dashboard **Send Notification** page to send a test to your device token.

## Troubleshooting

| Issue | Fix |
|---|---|
| No token received | Check Push Notifications capability is added |
| Notifications not shown | Confirm permission was granted in Settings |
| Invalid token errors | Re-upload your .p8 key; check Key ID and Team ID |
