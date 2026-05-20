---
id: ios
title: iOS SDK
sidebar_label: iOS (Swift)
---

# iOS SDK (Swift)

Native iOS push notifications via APNS. No Google account or FCM dependency needed.

**Minimum deployment target:** iOS 14+

## Installation

### Swift Package Manager

In Xcode: **File > Add Package Dependencies** and enter:

```
https://github.com/flypush-io/flypush-sdk-ios
```

Or add to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/flypush-io/flypush-sdk-ios", from: "0.1.0")
],
targets: [
    .target(name: "YourApp", dependencies: ["FlyPush"])
]
```

## Setup

### 1. Configure in AppDelegate

Call `configure(apiKey:)` once before any other FlyPush call.

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

    func application(
        _ application: UIApplication,
        didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
    ) {
        FlyPush.shared.application(didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
    }
}
```

### 2. Request notification permission

Call this from a ViewController or SwiftUI view after the user is ready to receive notifications. It requests the system permission dialog and registers the device with FlyPush automatically.

```swift
FlyPush.shared.registerForPushNotifications()
```

That's it. Once the user grants permission, the device token is sent to FlyPush and is ready to receive notifications.

## Setting user identity and tags

Associate the registered device with a user in your system:

```swift
FlyPush.shared.setUserId("user_12345")
```

Add tags for audience segmentation:

```swift
FlyPush.shared.setTags(["premium", "ios"])
```

Both can be called after `configure()`. If the device is already registered, the values are sent to the backend immediately. If not yet registered, they are included in the registration call.

## Topics

Subscribe or unsubscribe the current device from a notification topic:

```swift
// Subscribe
FlyPush.shared.subscribe(topic: "breaking-news")

// Unsubscribe
FlyPush.shared.unsubscribe(topic: "breaking-news")
```

Topics must be created in the FlyPush dashboard or via the API before subscribing.

## Handling received notifications

FlyPush delivers standard APNS notifications. Use the standard `UNUserNotificationCenterDelegate` methods to handle foreground and background notifications:

```swift
extension AppDelegate: UNUserNotificationCenterDelegate {

    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        // Show banner + sound while app is in foreground
        completionHandler([.banner, .sound])
    }

    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        let userInfo = response.notification.request.content.userInfo
        // Handle tap - userInfo contains any custom data from the notification payload
        completionHandler()
    }
}
```

Don't forget to set the delegate:

```swift
UNUserNotificationCenter.current().delegate = self
```

## Unregistering a device

To remove the device token from FlyPush (e.g., on logout):

```swift
FlyPush.shared.unregister()
```

## Custom API base URL

For staging environments or self-hosted deployments:

```swift
FlyPush.shared.configure(apiKey: "fp_your_api_key", baseUrl: "https://api.staging.flypush.io")
```

## Error handling

The SDK retries failed requests with exponential backoff (up to 3 attempts). Network errors and 5xx responses are retried automatically. Client errors (4xx) are thrown immediately and not retried.

To handle errors from explicit SDK calls:

```swift
do {
    try await FlyPush.shared.subscribe(topic: "alerts")
} catch FlyPushAPIError.httpError(let status, let code, let message) {
    print("Subscription failed: \(code) - \(message) (HTTP \(status))")
} catch {
    print("Unexpected error: \(error)")
}
```

## API reference

The SDK exposes the following public surface on `FlyPush.shared`:

| Method | Description |
|---|---|
| `configure(apiKey:baseUrl:)` | Initialize the SDK. Call once in AppDelegate. |
| `registerForPushNotifications()` | Request system permission and register device. |
| `application(didRegisterForRemoteNotificationsWithDeviceToken:)` | Forward APNS token from AppDelegate. |
| `setUserId(_:)` | Associate device with a user ID. |
| `setTags(_:)` | Set audience tags for this device. |
| `subscribe(topic:)` | Subscribe device to a notification topic. |
| `unsubscribe(topic:)` | Unsubscribe device from a topic. |
| `unregister()` | Remove device token from FlyPush. |

## Requirements

- iOS 14.0 or later
- Swift 5.9 or later (Xcode 15+)
- Push Notifications capability enabled in your Xcode target

## Next steps

- [iOS integration guide](/guides/ios) - full walkthrough with APNS certificate setup
- [Send your first notification](/api-reference/notifications) via the API
- [Topics reference](/api-reference/topics) - manage notification topics
