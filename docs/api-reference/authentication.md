---
id: authentication
title: Authentication
sidebar_label: Authentication
---

# Authentication

FlyPush uses two separate authentication mechanisms depending on who is calling:

| Caller | Mechanism | Header |
|---|---|---|
| Dashboard / management API | JWT Bearer token | `Authorization: Bearer <jwt>` |
| Your backend sending notifications | API Key | `Authorization: Bearer fp_<key>` |

## API Keys

API keys are used by your **server-side code** to send notifications and manage devices.

### Create an API key

In the dashboard: **Settings → API Keys → New Key**.

The secret is shown **once** — store it in your environment variables immediately.

```bash
fp_a3f9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
```

### Using an API key

```bash
curl https://api.flypush.io/v1/notifications/send \
  -H "Authorization: Bearer fp_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{ "to": { "type": "all" }, "title": "Hello", "body": "World" }'
```

### Key scopes

| Scope | Description |
|---|---|
| `notifications:send` | Send notifications |
| `devices:write` | Register and update device tokens |
| `topics:write` | Manage topics |
| `read` | Read-only access to project data |

## JWT (Dashboard)

The dashboard authenticates with short-lived JWT access tokens (15 min) + long-lived refresh tokens (30 days).

### Login

```bash
POST /v1/auth/login
```

```json
{
  "email": "you@example.com",
  "password": "your_password"
}
```

**Response:**

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "rt_...",
  "user": { "id": "...", "email": "...", "role": "OWNER" }
}
```

### Refresh

```bash
POST /v1/auth/refresh
```

```json
{ "refreshToken": "rt_..." }
```

### Logout

```bash
POST /v1/auth/logout
```

```json
{ "refreshToken": "rt_..." }
```

## Rate limiting

All endpoints are rate-limited. Auth endpoints have a stricter limit.

| Endpoint group | Limit |
|---|---|
| Auth endpoints | 10 req/min per IP |
| General API | 1,000 req/min per API key |

When rate-limited, you'll receive `HTTP 429` with headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1714000000
```

## Error format

All API errors follow this format:

```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is invalid or has been revoked.",
    "details": {}
  }
}
```

### Common error codes

| Code | HTTP | Description |
|---|---|---|
| `INVALID_API_KEY` | 401 | Key not found or revoked |
| `INVALID_TOKEN` | 401 | JWT expired or invalid |
| `FORBIDDEN` | 403 | Key lacks required scope |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `VALIDATION_ERROR` | 400 | Request body failed validation |
| `INTERNAL_ERROR` | 500 | Server error — retry with backoff |
