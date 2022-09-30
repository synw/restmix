## Options

Available options for initialization:

- <kbd>serverUrl</kbd> the base url for the server
- <kbd>credentials</kbd> option for [RequestCredentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials). 
Default: <em>include</em>
- <kbd>mode</kbd>: option for [RequestMode](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode).
Default: <em>cors</em>
- <kbd>csrfCookieName</kbd> the name of the csrf cookie. Default: <em>csrftoken</em>
- <kbd>csrfHeaderKey</kbd> the name of the csrf header. Default: <em>X-CSRFToken</em>

Example:

```js
import { useApi } from 'restmix';

const api = useApi({
  serverUrl: import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://prodserver',
});
```