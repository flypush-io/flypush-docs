---
id: quickstart
title: Quickstart
sidebar_label: Quickstart
slug: /quickstart
---

# Get started in 5 minutes

FlyPush lets you send push notifications to iOS, Android, and Web from a single API. This guide gets you from zero to your first notification in under 5 minutes.

## 1. Create an account

Sign up at [app.flypush.io](https://app.flypush.io) — no credit card required.

## 2. Create a project

In the dashboard, click **New Project** and select the platforms you want to target.

## 3. Get your API key

Go to **Settings → API Keys** and create a key. You'll use this in your backend to send notifications.

## 4. Install an SDK

Pick your backend language:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="node" label="Node.js">

```bash
npm install @flypush/node
```

</TabItem>
<TabItem value="python" label="Python">

```bash
pip install flypush
```

</TabItem>
<TabItem value="go" label="Go">

```bash
go get github.com/flypush-io/flypush-go
```

</TabItem>
</Tabs>

## 5. Send your first notification

<Tabs>
<TabItem value="node" label="Node.js">

```typescript
import { FlyPush } from "@flypush/node";

const client = new FlyPush({ apiKey: "fp_your_api_key" });

await client.notifications.send({
  to: { type: "all" },
  title: "Hello from FlyPush! 🚀",
  body: "Your first push notification just worked.",
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
from flypush import FlyPush
from flypush.models import SendOptions, NotificationTarget

client = FlyPush(api_key="fp_your_api_key")

client.notifications.send(SendOptions(
    to=NotificationTarget(type="all"),
    title="Hello from FlyPush!",
    body="Your first push notification just worked.",
))
```

</TabItem>
<TabItem value="go" label="Go">

```go
client := flypush.New("fp_your_api_key")

client.Notifications.Send(ctx, flypush.SendOptions{
    To:    flypush.ToAll(),
    Title: "Hello from FlyPush!",
    Body:  "Your first push notification just worked.",
})
```

</TabItem>
<TabItem value="curl" label="curl">

```bash
curl -X POST https://api.flypush.io/v1/notifications/send \
  -H "Authorization: Bearer fp_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "to": { "type": "all" },
    "title": "Hello from FlyPush!",
    "body": "Your first push notification just worked."
  }'
```

</TabItem>
</Tabs>

## 6. Install the mobile/web SDK

To receive notifications, install the client SDK on your app:

| Platform | Guide |
|---|---|
| iOS | [iOS integration guide](/guides/ios) |
| Android | [Android integration guide](/guides/android) |
| Web (browser) | [Web Push guide](/guides/web) |
| React Native | [React Native guide](/guides/react-native) |

## Next steps

- [Send to a topic](/api-reference/notifications#topics)
- [Register a device](/api-reference/devices)
- [Set up webhooks](/api-reference/webhooks)
- [Understand the architecture](/concepts/architecture)
