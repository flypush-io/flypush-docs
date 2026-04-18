---
id: go
title: Go SDK
sidebar_label: Go
---

# Go Server SDK

```bash
go get github.com/flypush-io/flypush-go
```

Zero dependencies — uses only the Go standard library. Requires Go 1.21+.

## Initialize

```go
import "github.com/flypush-io/flypush-go/flypush"

client := flypush.New("fp_your_api_key")

// With custom base URL:
client := flypush.New("fp_your_api_key", flypush.WithBaseURL("https://api.flypush.io"))
```

## Notifications

```go
ctx := context.Background()

// Send to all
res, err := client.Notifications.Send(ctx, flypush.SendOptions{
    To:    flypush.ToAll(),
    Title: "Hello!",
    Body:  "Your order shipped.",
    Data:  map[string]any{"orderId": "abc123"},
})

// Send to a topic
client.Notifications.Send(ctx, flypush.SendOptions{
    To:    flypush.ToTopic("breaking-news"),
    Title: "Breaking News",
    Body:  "Story here.",
})

// Batch send
client.Notifications.SendBatch(ctx, []flypush.BatchItem{
    {To: flypush.ToDevice("tok1"), Title: "Hi Alice", Body: "..."},
    {To: flypush.ToDevice("tok2"), Title: "Hi Bob",   Body: "..."},
})
```

## Devices

```go
device, err := client.Devices.Register(ctx, flypush.RegisterOptions{
    Platform: flypush.PlatformIOS,
    Token:    "apns_token",
    UserID:   "user_123",
    Tags:     []string{"premium"},
})

userID := "user_456"
client.Devices.Update(ctx, device.ID, &userID, nil)
client.Devices.Subscribe(ctx, device.ID, "breaking-news")
client.Devices.Unregister(ctx, device.ID)
```

## Error handling

```go
import "errors"

res, err := client.Notifications.Send(ctx, opts)
if err != nil {
    var fpErr *flypush.Error
    if errors.As(err, &fpErr) {
        log.Printf("FlyPush %d %s: %s", fpErr.StatusCode, fpErr.Code, fpErr.Message)
    }
    return err
}
```

Pass a context with `context.WithTimeout` to control the total retry budget:

```go
ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()

client.Notifications.Send(ctx, opts)
```
