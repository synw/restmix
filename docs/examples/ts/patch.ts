// @ts-nocheck
const url = "https://httpbin.org/patch";
const payload = { "foo": "bar" };

const res = await api.patch<Record<string, any>>(url, payload, true);
return res