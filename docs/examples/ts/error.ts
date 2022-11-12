// @ts-nocheck
const res = await api.get<Record<string, any>>(
  "https://httpbin.org/status/500"
);
return res
