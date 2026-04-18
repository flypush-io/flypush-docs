---
id: python
title: Python SDK
sidebar_label: Python
---

# Python Server SDK

```bash
pip install flypush
```

Zero dependencies — uses only the Python standard library. Requires Python 3.9+.

## Initialize

```python
from flypush import FlyPush

client = FlyPush(api_key="fp_your_api_key")
```

## Notifications

```python
from flypush.models import SendOptions, BatchItem, NotificationTarget

# Send to all
client.notifications.send(SendOptions(
    to=NotificationTarget(type="all"),
    title="Hello!",
    body="Your order shipped.",
    data={"orderId": "abc123"},
))

# Send to a topic
client.notifications.send(SendOptions(
    to=NotificationTarget(type="topic", topic="breaking-news"),
    title="Breaking News",
    body="Story here.",
))

# Batch send
client.notifications.send_batch([
    BatchItem(to=NotificationTarget(type="device", token="tok1"), title="Hi Alice", body="..."),
    BatchItem(to=NotificationTarget(type="device", token="tok2"), title="Hi Bob",   body="..."),
])
```

## Devices

```python
from flypush.models import RegisterOptions

device = client.devices.register(RegisterOptions(
    platform="IOS",
    token="apns_token",
    user_id="user_123",
    tags=["premium"],
))

client.devices.update(device["id"], tags=["premium", "beta"])
client.devices.subscribe(device["id"], "breaking-news")
client.devices.unregister(device["id"])
```

## Error handling

```python
from flypush import FlyPushError

try:
    client.notifications.send(...)
except FlyPushError as e:
    print(f"{e.status_code} {e.code}: {e}")
```

5xx errors are retried automatically (3 attempts, 2s/4s/8s backoff).

## Django example

```python
# notifications/tasks.py
from flypush import FlyPush
from flypush.models import SendOptions, NotificationTarget
from django.conf import settings

_client = FlyPush(api_key=settings.FLYPUSH_API_KEY)

def notify_user(user_id: str, title: str, body: str):
    _client.notifications.send(SendOptions(
        to=NotificationTarget(type="device", token=user_id),
        title=title,
        body=body,
    ))
```
