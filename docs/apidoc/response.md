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
  headers: Record<string, string>;
  status: number;
  statusText: string;
  data: T;
  text: string;
}
```