import { User } from "@snowind/state";
import { useApi } from '../../src/main';
import { libName } from "./conf";

const user = new User();
const api = useApi({
  serverUrl: import.meta.env.MODE === 'development' ? '' : `/${libName.toLowerCase()}`,
});

const apiDemo = useApi();

export { user, api, apiDemo }