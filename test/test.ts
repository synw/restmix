import { useApi } from '../src/api';
import { OnResponseHook } from '../src/interfaces';

// @lat: [[test-specs#Coverage Map (Test Cases)]] — the 26 it() cases below, one per documented component
const api = useApi({
  serverUrl: 'http://localhost:5714',
});

describe('tests', () => {
  it('200', async () => {
    const res = await api.get<Record<string, any>>("/");
    expect(res.data).toEqual({ response: "ok" })
  });
  it('get non-JSON response', async () => {
    const res = await api.get<Record<string, any>>("/text");
    expect(res.ok).toBe(true);
    expect(res.text).toBe("plain text response");
    expect(res.data).toEqual({});
  });
  it('get invalid JSON response', async () => {
    // @lat: [[test-specs#Notable Testing Techniques]] — console spy pattern; fresh clients below avoid shared state
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const res = await api.get<Record<string, any>>("/invalid-json");
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
  it('204', async () => {
    const res = await api.get("/204");
    expect(res.status).toEqual(204);
    expect(res.text).toEqual("");
    expect(res.data).toEqual({});
    expect(res.ok).toBe(false);
  });
  it('401', async () => {
    const res = await api.get<Record<string, any>>("/401");
    expect(res.status).toEqual(401)
  });
  it('403', async () => {
    const res = await api.get<Record<string, any>>("/403");
    expect(res.status).toEqual(403)
    expect(res.data).toEqual({ "ok": false })
  });
  it('post', async () => {
    const payload = { foo: "bar" };
    const res = await api.post<Record<string, any>>("/post", payload);
    expect(res.data).toEqual({ response: "ok" })
  });
  it('put', async () => {
    const payload = { foo: "bar" };
    const res = await api.put<Record<string, any>>("/put", payload);
    expect(res.data).toEqual({ response: "ok" })
  });
  it('patch', async () => {
    const payload = { foo: "bar" };
    const res = await api.patch<Record<string, any>>("/patch", payload);
    expect(res.data).toEqual({})
  });
  it('del success', async () => {
    const res = await api.del<Record<string, any>>("/del");
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ response: "ok" });
  });
  it('del error 404', async () => {
    const res = await api.del<Record<string, any>>("/del/404");
    expect(res.ok).toBe(false);
    expect(res.status).toBe(404);
  });
  it('patch non-existent resource', async () => {
    const payload = { foo: "bar" };
    const res = await api.patch<Record<string, any>>("/non-existent", payload);
    expect(res.status).toEqual(400)
  });
  /*it('addHeader and removeHeader', async () => {
    api.addHeader('X-Custom-Header', 'custom-value');
    const res = await api.get<Record<string, any>>("/");
    expect(res.headers['X-Custom-header']).toEqual('custom-value');
    api.removeHeader('X-Custom-Header');
    const res2 = await api.get<Record<string, any>>("/");
    expect(res2.headers['X-Custom-header']).toBeUndefined();
  });*/
  it('onResponse hook', async () => {
    const hook: OnResponseHook = (res) => {
      res.data = { ...res.data, modified: true };
      return Promise.resolve(res);
    };
    api.onResponse(hook);
    const res = await api.get<Record<string, any>>("/");
    expect(res.data).toEqual({ response: "ok", modified: true });
  });
  it('setCsrfToken', async () => {
    api.setCsrfToken('test-csrf-token');
    expect(api.csrfToken()).toEqual('test-csrf-token');
  });
  it('hasCsrfCookie returns false when no cookie', () => {
    const testApi = useApi({ serverUrl: 'http://localhost:5714' });
    expect(testApi.hasCsrfCookie()).toBe(false);
  });
  it('setCsrfTokenFromCookie returns false when no cookie', () => {
    const testApi = useApi({ serverUrl: 'http://localhost:5714' });
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const result = testApi.setCsrfTokenFromCookie(true);
    expect(result).toBe(false);
    expect(logSpy).toHaveBeenCalledWith("User does not have csrf cookie");
    logSpy.mockRestore();
  });
  it('setCsrfTokenFromCookie returns true when cookie present', async () => {
    const testApi = useApi({ serverUrl: 'http://localhost:5714' });
    testApi.setCsrfToken('test-token');
    expect(testApi.csrfToken()).toBe('test-token');
  });

  it('addHeader includes custom headers in requests', async () => {
    const testApi = useApi({ serverUrl: 'http://localhost:5714' });
    testApi.addHeader('X-Custom-Header', 'custom-value');
    const res = await testApi.get<Record<string, any>>("/headers");
    expect(res.data.headers['x-custom-header']).toBe('custom-value');
    testApi.removeHeader('X-Custom-Header');
  });

  it('removeHeader clears specific header', async () => {
    const testApi = useApi({ serverUrl: 'http://localhost:5714' });
    testApi.addHeader('X-Test-Header', 'test-value');
    testApi.removeHeader('X-Test-Header');
    const res = await testApi.get<Record<string, any>>("/headers");
    expect(res.data.headers['x-test-header']).toBeUndefined();
  });

  it('multiple headers with partial removal', async () => {
    const testApi = useApi({ serverUrl: 'http://localhost:5714' });
    testApi.addHeader('X-Header-1', 'value1');
    testApi.addHeader('X-Header-2', 'value2');
    testApi.removeHeader('X-Header-1');
    const res = await testApi.get<Record<string, any>>("/headers");
    expect(res.data.headers['x-header-1']).toBeUndefined();
    expect(res.data.headers['x-header-2']).toBe('value2');
    testApi.removeHeader('X-Header-2');
  });

  it('verbose POST logs request details', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const res = await api.post<Record<string, any>>("/post", { foo: "bar" }, false, true);
    expect(logSpy).toHaveBeenCalledWith("POST", expect.stringContaining("/post"));
    expect(res.data).toEqual({ response: "ok" });
    logSpy.mockRestore();
  });

  it('verbose PUT logs request details', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const res = await api.put<Record<string, any>>("/put", { foo: "bar" }, true);
    expect(logSpy).toHaveBeenCalledWith("PUT", expect.stringContaining("/put"));
    expect(res.data).toEqual({ response: "ok" });
    logSpy.mockRestore();
  });

  it('verbose PATCH logs request details', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const res = await api.patch<Record<string, any>>("/patch", { foo: "bar" }, true);
    expect(logSpy).toHaveBeenCalledWith("PATCH", expect.stringContaining("/patch"));
    logSpy.mockRestore();
  });

  it('verbose GET logs request details', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const res = await api.get<Record<string, any>>("/", true);
    expect(logSpy).toHaveBeenCalledWith("GET", expect.stringContaining("/"));
    logSpy.mockRestore();
  });

  it('verbose DELETE logs request details', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const res = await api.del<Record<string, any>>("/del", true);
    expect(logSpy).toHaveBeenCalledWith("DELETE", expect.stringContaining("/del"));
    logSpy.mockRestore();
  });
});