// @ts-nocheck
interface TodoItemContract {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const res = await api.get<TodoItemContract>(
  "https://jsonplaceholder.typicode.com/todos/1",
  true
);
return res.data