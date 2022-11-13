## Response

Every request renders a typed `ApiResponse`:

```ts
import { ApiResponse } from "restmix";

const res: ApiResponse<Record<string, any>> = await api.get<Record<string, any>>(
  "https://some_server_response"
);
if (res.ok) {
  const data: Record<string, any> = res.data;
}
```

Api response type:

```ts
interface ApiResponse<T = Record<string, any> | Array<any>> {
  ok: boolean;
  url: string;
  headers: Record<string, string>;
  status: number;
  statusText: string;
  data: T;
  text: string;
}
```

### Automatically process all responses

It is possible to set a hook that will process every response before returning
it. This can be useful to automate some reactions to different status codes and
scenarios. 

Set up an <kbd>onResponse<kbd> hook:

```ts
api.onResponse(async <T>(res: ApiResponse<T>): Promise<ApiResponse<T>> => {
  console.log("Response", JSON.stringify(res, null, "  "));
  if (!res.ok) {
    if ([401, 403].includes(res.status)) {
      console.warn("Unauthorized request", res.status, "from", res.url)
    } else if (res.status == 500) {
      console.warn("Server error", res.status, "from", res.url)
    } else {
      console.warn("Error", res.status, "from", res.url)
    }
  }
  return res
});
```

