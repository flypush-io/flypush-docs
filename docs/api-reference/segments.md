---
id: segments
title: Segments
sidebar_label: Segments
---

# Segments

Segments let you target devices based on rules — platform, tags, last activity, and more.

## Create a segment

```
POST /v1/segments
```

**Auth:** JWT

```json
{
  "name": "Premium Android users",
  "filterRules": [
    { "field": "platform", "op": "eq", "value": "ANDROID" },
    { "field": "tags", "op": "contains", "value": "premium" },
    { "field": "lastSeenAt", "op": "gt", "value": "7d" }
  ]
}
```

### Filter rule operators

| `op` | Applies to | Description |
|---|---|---|
| `eq` | `platform`, `userId` | Exact match |
| `contains` | `tags` | Tag list includes value |
| `not_contains` | `tags` | Tag list does not include value |
| `gt` | `lastSeenAt`, `createdAt` | Greater than (supports `7d`, `30d`, ISO date) |
| `lt` | `lastSeenAt`, `createdAt` | Less than |

Rules are combined with **AND**.

### Response

```json
{
  "id": "seg_01h9abc",
  "name": "Premium Android users",
  "estimatedCount": 12400,
  "filterRules": [...]
}
```

---

## List segments

```
GET /v1/segments
```

---

## Get segment (with live count)

```
GET /v1/segments/:id
```

---

## Update segment

```
PUT /v1/segments/:id
```

---

## Delete segment

```
DELETE /v1/segments/:id
```

---

## Send to a segment

```json
{
  "to": { "type": "segment", "segmentId": "seg_01h9abc" },
  "title": "Exclusive offer",
  "body": "Premium members get 20% off this weekend."
}
```
