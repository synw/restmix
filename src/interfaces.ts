type RequestCredentials = 'omit' | 'include' | 'same-origin';
type RequestMode = 'cors' | 'no-cors' | 'same-origin' | 'navigate';

/** The composable parameters */
interface UseApiParams {
  serverUrl?: string;
  csrfCookieName?: string;
  csrfHeaderKey?: string;
  credentials?: RequestCredentials | null;
  mode?: RequestMode;
}

/** The standard api response with typed data */
interface ApiResponse<T = Record<string, any> | Array<any>> {
  ok: boolean;
  url: string;
  headers: Record<string, string>;
  status: number;
  statusText: string;
  data: T;
  text: string;
}

/** The on response hook type */
type OnResponseHook = <T>(res: ApiResponse<T>) => Promise<ApiResponse<T>>;

export { UseApiParams, ApiResponse, OnResponseHook, RequestCredentials, RequestMode }