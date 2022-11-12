## How it works

It is the same as [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) except that it takes care of the response
body parsing and delivers typed data

### Status codes

Check if a response status code is in the range 200/299:

```ts
const res = await api.get(
  "https://some_server_response"
);
if (res.ok) {
  console.log(`The response status code is ${res.status}`)
}
```

Process the response using the status code:

```ts
const res = await api.get(
  "https://some_500_server_response"
);
if (!res.ok) {
  if (res.status == 500) {
    console.log(res.statusText)
  }
}
```

### Response data type

#### Json data

For json data declare the response data type when building the request:

```ts
interface TodoItemContract {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const res = await api.get<TodoItemContract>(
  "https://jsonplaceholder.typicode.com/todos/1"
);
```

To retrieve the parsed data:

```ts
const data: TodoItemContract = res.data;
```

Default data type if not declared is `Record<string, any> | Array<any>`

#### Text data

If the response header is not `application/json` it will parse
the response text and make it available:

```ts
const res = await api.get(
  "https://some_text_server_response"
);

const text: string = res.text;
```