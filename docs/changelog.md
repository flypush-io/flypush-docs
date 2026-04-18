---
id: changelog
title: Changelog
sidebar_label: Changelog
---

# Changelog

## v0.1.0 — 2024-12-01

Initial public release.

### Features

- **Multi-platform delivery** — iOS (APNS), Android (WebSocket), Web (VAPID)
- **Topics** — subscribe devices to named channels
- **Segments** — rule-based device targeting (platform, tags, last activity)
- **Scheduling** — send at a future `scheduledAt` timestamp
- **Batch send** — up to 100 notifications in a single API call
- **Idempotency keys** — safe retries without duplicate delivery
- **Analytics** — delivery rate, open rate, daily chart, platform breakdown
- **Webhooks** — real-time event delivery to your endpoint
- **API keys** — scoped, revocable, stored as SHA-256 hash

### Server SDKs

- `@flypush/node` v0.1.0
- `flypush` (Python) v0.1.0
- `flypush-go` v0.1.0

### Mobile / Web SDKs

- FlyPush iOS SDK v0.1.0
- FlyPush Android SDK v0.1.0
- `@flypush/web` v0.1.0
- `@flypush/react-native` v0.1.0

---

Future releases will be documented here.
