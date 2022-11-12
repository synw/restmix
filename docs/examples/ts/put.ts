// @ts-nocheck
const url = "https://jsonplaceholder.typicode.com/posts/1";
const payload = {
  id: 1,
  title: 'foo',
  body: 'bar',
  userId: 1,
};

const res = await api.put<Record<string, any>>(url, payload);
return res