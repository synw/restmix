# Post with streaming response

This sends a post request, expecting a streaming response of server sent
events, with the header set to `Accept: text/event-stream`.

Create a handler for incoming chunks and an abort controller:

```ts
const onChunk = (payload: Record<string, any>) => {
  console.log(payload)
};
const abortController = new AbortController();
```

Post the request:

```ts
await api.postSse<Record<string, any>>(
  "/some/endpoint",
  {foo: "bar"},
  onChunk,
  abortController,
)
```

The `onChunk` function will be executed each time an incoming data chunk is comming in

To stop a stream:

```ts
abortController.abort()
```




