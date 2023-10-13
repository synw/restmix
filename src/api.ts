import Cookies from 'js-cookie';
import { ApiResponse, OnResponseHook, UseApiParams } from './interfaces.js';

/** The main api composable */
const useApi = (params: UseApiParams = {
  serverUrl: "",
  csrfCookieName: "csrftoken",
  csrfHeaderKey: "X-CSRFToken",
  credentials: "include",
  mode: "cors",
}) => {
  // options
  let _serverUrl = params.serverUrl ?? "";
  let _csrfCookieName = params?.csrfCookieName ?? "csrftoken";
  let _csrfHeaderKey = params?.csrfHeaderKey ?? "X-CSRFToken";
  let _mode = params?.mode ?? "cors";
  let _credentials: RequestCredentials | null = params.credentials ?? "include";
  // state
  let _csrfToken: string | null = null;
  let _extraHeaders: Record<string, string> = {};
  let _hasExtraHeaders = false;
  // hooks
  let _onResponse: OnResponseHook;

  const csrfToken = () => _csrfToken;

  const hasCsrfCookie = (): boolean => {
    const cookie = Cookies.get(_csrfCookieName);
    if (cookie) {
      return true
    }
    return false
  }

  const _csrfFromCookie = (): string => {
    const c = Cookies.get(_csrfCookieName);
    if (!c) {
      throw ("Csrf cookie not found")
    }
    return c
  }

  const addHeader = (key: string, val: string) => {
    _extraHeaders[key] = val;
    _hasExtraHeaders = true;
  }

  const removeHeader = (key: string) => {
    delete _extraHeaders[key];
    if (Object.keys(_extraHeaders).length == 0) {
      _hasExtraHeaders = false
    }
  }

  /** Set the on response hook */
  const onResponse = (hook: OnResponseHook) => {
    _onResponse = hook;
  }

  /** Set a csrf token to use with request headers */
  const setCsrfToken = (token: string) => {
    _csrfToken = token;
  }

  /** Get the csrf token from a cookie and set it to use with request headers */
  const setCsrfTokenFromCookie = (verbose = false): boolean => {
    if (hasCsrfCookie()) {
      _csrfToken = _csrfFromCookie();
      if (verbose) {
        console.log("User logged in with csrf cookie, setting api token", _csrfToken);
      }
      return true
    } else {
      if (verbose) {
        console.log("User does not have csrf cookie")
      }
    }
    return false
  }

  const _processResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
    const head: Record<string, string> = {};
    response.headers.forEach((v, k) => head[k] = v);
    let apiResp: ApiResponse<T> = {
      ok: response.ok,
      url: response.url,
      headers: head,
      status: response.status,
      statusText: response.statusText,
      data: {} as unknown as T,
      text: "",
    }
    if (!(response.status == 204)) {
      if (!response.headers.get("Content-Type")?.startsWith("application/json")) {
        const txt = await response.text();
        apiResp.text = txt;
      } else {
        try {
          apiResp.data = (await response.json()) as T
        } catch (e) {
          console.warn(`Json parsing error: ${e}`);
        }
      }
    }
    if (_onResponse) {
      apiResp = await _onResponse<T>(apiResp)
    }
    return apiResp
  }

  /** Post request with server sent events streaming response support */
  const postSse = async<T>(
    uri: string,
    payload: Array<any> | Record<string, any> | FormData,
    onChunk: (payload: T) => void,
    abortController: AbortController,
    multipart: boolean = false,
    verbose = false
  ): Promise<void> => {
    addHeader('Accept', 'text/event-stream');
    const opts = _postHeader(payload, "post", multipart);
    opts.signal = abortController.signal;
    let url = _serverUrl + uri;
    if (verbose) {
      console.log("POST SSE", url);
      console.log(JSON.stringify(opts, null, "  "));
    }
    const response = await fetch(url, opts);
    if (response.body) {
      const reader = response.body.getReader();  // @ts-ignore
      const decoder = new TextDecoder();
      while (true) {
        const result = await reader.read();
        if (result.done) {
          break
        }
        const text = decoder.decode(result.value);
        const rawText = text.replace(/data: |[\r\n]/g, '');
        let data: T | string = rawText;
        try {
          data = JSON.parse(rawText) as T;
        } catch (e) { }
        onChunk(data as T)
      }
    }
  }

  /** Post request */
  const post = async <T>(
    uri: string,
    payload: Array<any> | Record<string, any> | FormData,
    multipart: boolean = false,
    verbose = false
  ): Promise<ApiResponse<T>> => {
    const opts = _postHeader(payload, "post", multipart);
    let url = _serverUrl + uri;
    if (verbose) {
      console.log("POST", url);
      console.log(JSON.stringify(opts, null, "  "));
    }
    const response = await fetch(url, opts);
    return await _processResponse<T>(response)
  }

  /** Patch request */
  const patch = async <T>(
    uri: string, payload: Array<any> | Record<string, any>, verbose = false
  ): Promise<ApiResponse<T>> => {
    const opts = _postHeader(payload, "patch");
    let url = _serverUrl + uri;
    if (verbose) {
      console.log("PATCH", url);
      console.log(JSON.stringify(opts, null, "  "));
    }
    const response = await fetch(url, opts);
    return await _processResponse<T>(response)
  }

  /** Put request */
  const put = async <T>(
    uri: string, payload: Array<any> | Record<string, any>, verbose = false
  ): Promise<ApiResponse<T>> => {
    let url = _serverUrl + uri;
    const opts = _postHeader(payload, "put");
    if (verbose) {
      console.log("PUT", url);
      console.log(JSON.stringify(opts, null, "  "));
    }
    const response = await fetch(url, opts);
    return await _processResponse<T>(response)
  }

  /** Get request */
  const get = async <T>(uri: string, verbose = false): Promise<ApiResponse<T>> => {
    let url = _serverUrl + uri;
    const opts = _getHeader("get");
    if (verbose) {
      console.log("GET", url);
      console.log(JSON.stringify(opts, null, "  "));
    }
    const response = await fetch(url, opts);
    return await _processResponse<T>(response)
  }

  /** Delete request */
  const del = async <T>(uri: string, verbose = false): Promise<ApiResponse<T>> => {
    const url = _serverUrl + uri;
    const opts = _getHeader("delete");
    if (verbose) {
      console.log("DELETE", url);
      console.log(JSON.stringify(opts, null, "  "));
    }
    const response = await fetch(url, opts);
    return await _processResponse<T>(response)
  }

  const _getHeader = (method: string = "get"): RequestInit => {
    const h = {
      method: method,
      mode: _mode,
    } as RequestInit;
    if (_credentials !== null) {
      h.credentials = _credentials
    }
    const headers = { "Content-Type": "application/json" }
    h.headers = _getBaseHeaders(headers);
    return h;
  }

  const _postHeader = (payload: Array<any> | Record<string, any> | FormData, method = "post", multipart: boolean = false): RequestInit => {
    const pl = multipart ? payload as FormData : JSON.stringify(payload);
    const r: RequestInit = {
      method: method,
      mode: _mode,
      body: pl
    };
    let headers: Record<string, any> = {};
    if (!multipart) {
      headers = { "Content-Type": "application/json" }
    }
    if (_credentials !== null) {
      r.credentials = _credentials
    }
    r.headers = _getBaseHeaders(headers);
    return r;
  }

  function _getBaseHeaders(headers: Record<string, string>): Record<string, string> {
    if (_csrfToken !== null) {
      headers[_csrfHeaderKey] = _csrfToken;
    }
    if (_hasExtraHeaders) {
      for (const [k, v] of Object.entries(_extraHeaders)) {
        headers[k] = v
      }
    }
    return headers
  }

  return {
    csrfToken,
    hasCsrfCookie,
    setCsrfToken,
    setCsrfTokenFromCookie,
    addHeader,
    removeHeader,
    onResponse,
    get,
    post,
    put,
    patch,
    del,
    postSse,
  }
}

export { useApi }
