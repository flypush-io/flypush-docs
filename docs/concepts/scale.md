---
id: scale
title: Scale
sidebar_label: Scale at 100k/sec
---

# Scale: 100,000 notifications/second

FlyPush is designed to handle burst sends of 100,000+ notifications per second. Here's how.

## The fan-out problem

When you call `POST /v1/notifications/send` with `to: { type: "all" }` for a project with 10 million devices, you can't iterate 10 million rows in the API request handler. You need to:

1. Return immediately to the caller
2. Process the fan-out asynchronously in parallel

## How FlyPush fans out

### Step 1: API creates the job

The API writes a `Notification` record and enqueues a single **fan-out job** to BullMQ. Responds to caller in `<50ms`.

### Step 2: Fan-out worker cursor-paginates

The fan-out worker queries device tokens in cursor pages of **1,000 tokens**. For 10 million devices:

```
10,000,000 tokens / 1,000 per batch = 10,000 send-batch jobs
```

Each `send_batch` job is enqueued to BullMQ independently. The cursor prevents loading all tokens into memory.

### Step 3: Send-batch workers run in parallel

BullMQ processes `send_batch` jobs with configurable **concurrency**. With 100 workers each handling 10 concurrent jobs:

```
100 workers × 10 concurrency × 1,000 tokens/batch = 1,000,000 tokens/sec
```

Each iOS batch invokes an **AWS Lambda** that sends to APNS in parallel. Lambda auto-scales to handle burst load — no capacity planning needed.

### Step 4: Receipts written in bulk

Each worker writes `DeliveryReceipt` rows in a single `createMany` call after the batch completes. Invalid tokens are updated in bulk.

## Numbers

| Layer | Throughput | Notes |
|---|---|---|
| API ingress | Unlimited | Stateless, horizontally scaled |
| Fan-out worker | ~500k tokens/sec cursor speed | Single worker, PostgreSQL-bound |
| Send-batch workers | 1M+ tokens/sec | Linear with worker count |
| AWS Lambda (APNS) | 10k+ req/sec per region | Auto-scales |
| WebSocket server | 100k+ concurrent connections | uWebSockets.js, single process |
| Redis pub-sub | Sub-millisecond fan-out | Single channel per project |

## Plan-based throttling

BullMQ rate limiters cap throughput per subscription plan:

| Plan | Max throughput |
|---|---|
| Free | 100/sec |
| Starter | 1,000/sec |
| Pro | 10,000/sec (priority queue) |
| Enterprise | Unlimited |

Pro plan uses a **dedicated queue** — jobs never wait behind Free/Starter traffic.

## Database at scale

- Tokens table is partitioned by `project_id`
- Delivery receipts are partitioned by `created_at` month, older partitions moved to cold storage
- Analytics queries run against a **read replica** — never touch the primary
- `device_tokens` has a compound index on `(project_id, platform, invalid_at)` for fast fan-out cursor queries

## WebSocket at scale

The WebSocket server uses `uWebSockets.js` — a C++ backed WebSocket library that handles 100k+ concurrent connections on a single Node.js process with minimal memory overhead.

Redis pub-sub delivers a single message per project — the WebSocket server fans it out to all connected clients locally. No per-device Redis calls.
