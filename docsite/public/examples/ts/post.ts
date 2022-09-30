// @ts-nocheck
const url = "https://httpbin.org/post";
const payload = { "foo": "bar" };

const res = await api.post<Record<string, any>>(url, payload);
return res