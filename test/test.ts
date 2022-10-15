import { useApi } from '../src/main';

const api = useApi({
  serverUrl: 'http://localhost:5714',
});

describe('my test', () => {
  it('200', async () => {
    const res = await api.get<Record<string, any>>("/");
    expect(res).toEqual({ response: "ok" })
  });
  it('401', async () => {
    try {
      await api.get<Record<string, any>>("/401");
    } catch (e: any) {
      expect(e.status).toEqual(401)
    }
  });
  it('403', async () => {
    try {
      await api.get<Record<string, any>>("/403");
    } catch (e: any) {
      expect(e.status).toEqual(403)
      expect(e.content).toEqual({ "ok": false })
    }
  });
  it('post', async () => {
    const payload = { foo: "bar" };
    const res = await api.post<Record<string, any>>("/post", payload);
    expect(res).toEqual({ response: "ok" })
  });
  it('put', async () => {
    const payload = { foo: "bar" };
    const res = await api.put<Record<string, any>>("/put", payload);
    expect(res).toEqual({ response: "ok" })
  });
  /*it('patch', async () => {
    const payload = { foo: "bar" };
    const res = await api.patch<Record<string, any>>("/patch", payload, true);
    expect(res).toEqual({ response: "ok" })
  });*/
});