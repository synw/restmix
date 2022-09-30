// @ts-nocheck
const url = "https://httpbin.org/put";
const payload = { "foo": "bar" };

const res = await api.put<Record<string, any>>(url, payload);
return res