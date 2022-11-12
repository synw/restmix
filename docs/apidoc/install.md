## Install

### With npm

```bash
npm install restmix
# or
yarn add restmix
```

Initialize:

```js
import { useApi } from 'restmix';

const api = useApi();
```

### As script src

```html
<script src="https://unpkg.com/restmix@0.0.1/dist/api.min.js"></script>

<script>
// The api is available as $api
</script>
```

### As script module

```html
<script type="module">
  import { useApi } from "https://unpkg.com/restmix@0.0.1/dist/api.es.js";
  
  const api = useApi();
</script>
```