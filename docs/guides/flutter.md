---
id: flutter
title: Flutter
sidebar_label: Flutter
---

# Flutter Integration

:::info Coming soon
The FlyPush Flutter SDK (`flypush_flutter`) is currently in development. In the meantime, you can use our REST API directly or wrap the native Android/iOS SDKs with platform channels.
:::

## Planned API

```dart
import 'package:flypush_flutter/flypush_flutter.dart';

// Initialize
await FlyPush.init(apiKey: 'fp_your_api_key');

// Register device
await FlyPush.registerDevice(userId: 'user_123');

// Topics
await FlyPush.subscribe('breaking-news');
await FlyPush.unsubscribe('breaking-news');

// Tags
await FlyPush.setTags({'plan': 'premium'});
```

## Manual integration (REST API)

Until the Flutter SDK ships, call the FlyPush API directly using `http` or `dio`:

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<void> registerDevice(String token) async {
  final response = await http.post(
    Uri.parse('https://api.flypush.io/v1/devices/register'),
    headers: {
      'Authorization': 'Bearer fp_your_api_key',
      'Content-Type': 'application/json',
    },
    body: jsonEncode({
      'platform': 'IOS', // or 'ANDROID'
      'token': token,
    }),
  );

  if (response.statusCode != 200) {
    throw Exception('Registration failed: ${response.body}');
  }
}
```

[Star the Flutter SDK repo](https://github.com/flypush-io/flypush-sdk-flutter) to get notified when it ships.
