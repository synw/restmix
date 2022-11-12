# Restmix

[![pub package](https://img.shields.io/npm/v/restmix)](https://www.npmjs.com/package/restmix)

A lightweight Typescript friendly requests manager for rest apis

:books: [Documentation](https://synw.github.io/restmix)

```ts
import { useApi, ApiResponse } from 'restmix';

const api = useApi();

interface TodoItemContract {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const res: ApiResponse<TodoItemContract> = await api.get<TodoItemContract>(
  "https://jsonplaceholder.typicode.com/todos/1",
);
if (res.ok) {
  // status code is in the 200/299 range
  const data: TodoItemContract = res.data;
} else {
  // status code is > 299
  const responseStatus: number = res.status;
  throw new Error(res.status)
}
```