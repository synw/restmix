// @ts-nocheck
const res = await api.get<Record<string, any>>(
  "https://jsonplaceholder.typicode.com/todos/1"
);
return res