---
id: architecture
title: Architecture
sidebar_label: Architecture
---

# How FlyPush Works

## Overview

```
Your backend  →  FlyPush API  →  Queue (BullMQ)  →  Workers  →  APNS / WebSocket / Web Push  →  Device
```

Every notification send is **asynchronous**. The API accepts the request, writes a record, enqueues a fan-out job, and returns immediately. Delivery happens in the background.

## Delivery pipeline

### 1. API accepts the request

`POST /v1/notifications/send` validates the payload, creates a `Notification` record with status `QUEUED`, and enqueues a **fan-out job**.

### 2. Fan-out worker

The fan-out worker cursor-paginates through matching device tokens in batches of 1,000. For each batch it:

- Creates a `NotificationJob` record
- Enqueues a **send-batch job** (iOS/Android) or **web-push job** (Web)

A send to "all devices" for a project with 10 million tokens creates 10,000 send-batch jobs — all processed in parallel.

### 3. Send-batch worker

**iOS:** Decrypts the APNS credential, invokes an **AWS Lambda** function with the 1,000-token batch + payload. Lambda sends to APNS in parallel and returns per-token results.

**Android:** Publishes the payload to a Redis pub-sub channel (`project:{id}:notifications`). Connected WebSocket clients receive it in real-time. Offline devices get the message pushed to their individual Redis queue (72h TTL, drained on reconnect).

**Web:** Calls `web-push` with the stored subscription object + VAPID keys.

### 4. Delivery receipts

After each batch, the worker writes `DeliveryReceipt` rows — one per token with status `DELIVERED`, `FAILED`, or `PENDING` (Android WebSocket, awaiting ACK). Invalid tokens (`Unregistered`, `BadDeviceToken`) are marked with `invalidAt`.

## Multi-tenancy

Every database query is scoped to `orgId` or `projectId`. No data crosses tenant boundaries.

API keys are stored as SHA-256 hashes. The raw key is shown once at creation time.

## Credential security

APNS `.p8` keys and certificates are encrypted at rest with AES-256-GCM before storage. The encryption key lives only in the environment variable `CREDENTIAL_ENCRYPTION_KEY` — never in the database.

## Scaling

- **Horizontal workers:** BullMQ supports multiple worker processes. Add workers to increase throughput linearly.
- **Rate limiting per plan:** BullMQ rate limiters cap send throughput per subscription plan.
- **Redis pub-sub:** A single Redis subscription fans out to all connected Android WebSocket clients for a project.
- **PostgreSQL read replicas:** Analytics queries use read replicas to avoid impacting write throughput.

See [Scale: 100k/sec](/concepts/scale) for the detailed scaling architecture.
