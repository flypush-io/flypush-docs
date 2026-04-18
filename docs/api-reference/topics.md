---
id: topics
title: Topics
sidebar_label: Topics
---

# Topics

Topics let you send one notification to many subscribers with a single API call.

## Create a topic

```
POST /v1/topics
```

**Auth:** JWT

```json
{ "name": "breaking-news", "description": "Live breaking news alerts" }
```

**Response:**

```json
{
  "id": "topic_01h9abc",
  "name": "breaking-news",
  "description": "Live breaking news alerts",
  "subscriberCount": 0
}
```

---

## List topics

```
GET /v1/topics
```

**Auth:** JWT

---

## Delete a topic

```
DELETE /v1/topics/:id
```

Unsubscribes all devices and removes the topic.

---

## Subscribe / unsubscribe

Subscriptions are managed via the [Devices API](/api-reference/devices):

```bash
POST /v1/devices/:deviceId/subscribe
POST /v1/devices/:deviceId/unsubscribe
```

```json
{ "topic": "breaking-news" }
```

---

## Send to a topic

```json
{
  "to": { "type": "topic", "topic": "breaking-news" },
  "title": "Live: Election results",
  "body": "Polls close in 30 minutes."
}
```

See [Notifications](/api-reference/notifications) for the full send API.
