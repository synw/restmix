import { useApi } from '../src/api';
import { OnResponseHook } from '../src/interfaces';

const api = useApi({
  serverUrl: 'http://localhost:5714',
});

describe('tests', () => {
  it('200', async () => {
    const res = await api.get<Record<string, any>>("/");
    expect(res.data).toEqual({ response: "ok" })
  });
  it('204', async () => {
    const res = await api.get("/204");
    expect(res.status).toEqual(204);
    expect(res.text).toEqual("")
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
});