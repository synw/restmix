<template>
  <div class="p-3 prose md-content maxw-100 dark:prose-invert">
    <h2>Csrf tokens</h2>
    <div class="mt-3">Set a csrf token to be sent in the header:</div>
    <pre><code v-html="code0"></code></pre>
    <div class="mt-3">This will add a header to all requests:</div>
    <pre><code v-html="code1"></code></pre>
    <h3>Options</h3>
    <div class="mt-3">To change the default <kbd>X-CSRFToken</kbd> header key use the options:</div>
    <pre><code v-html="code2"></code></pre>
    <h3>Set the csrf token from a cookie</h3>
    <pre><code v-html="code3"></code></pre>
    <div class="mt-3">This will look for a readable <kbd>csrftoken</kbd> cookie and read it's
      value to set the csrf token. To change the cookie name:
    </div>
    <pre><code v-html="code4"></code></pre>
  </div>
</template>

<script setup lang="ts">
import { hljs } from "@/conf"


const code0 = hljs.highlight(`const token="xxx";
api.setCsrfToken(token)`, { language: "typescript" }).value;

const code1 = hljs.highlight(`{
  "X-CSRFToken": "xxx"
}`, { language: "json" }).value;

const code2 = hljs.highlight(`const api = useApi({
  csrfHeaderKey: "CUSTOM-CSRFToken-KEY",
});`, { language: "typescript" }).value;

const code3 = hljs.highlight(`const hasCsrfTokenBeenSet: boolean = api.setCsrfTokenFromCookie()`, { language: "typescript" }).value;

const code4 = hljs.highlight(`const api = useApi({
  csrfCookieName: "my-csrf-cookie-name",
});`, { language: "typescript" }).value;
</script>

<style lang="sass">
  .maxw-100
      max-width: 100ch
</style>