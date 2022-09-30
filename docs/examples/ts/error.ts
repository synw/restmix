// @ts-nocheck
try {
  const res = await api.get<Record<string, any>>(
    "https://httpbin.org/status/500"
  );
  return res
} catch (e) {
  if (e instanceof ResponseError) {
    return `Error: ${e.status} ${e.statusText} ${e.text}`
  }
}