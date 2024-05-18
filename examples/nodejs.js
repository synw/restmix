#!/usr/bin/env node
import { useApi } from "../dist/api.es.js";

const api = useApi();

const res = await api.get(
    "https://jsonplaceholder.typicode.com/todos/1"
);

console.log("Result:", res)