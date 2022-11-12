// @ts-nocheck
const url = "https://jsonplaceholder.typicode.com/posts";
const payload = {
  title: 'foo',
  body: 'bar',
  userId: 1,
};

const res = await api.post<Record<string, any>>(url, payload);
return res