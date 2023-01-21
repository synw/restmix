<template>
  <div class="p-3 prose md-content maxw-100 dark:prose-invert">
    <h2>Extra headers</h2>
    <div class="mt-3">Add an extra header to each request:</div>
    <pre><code v-html="code0"></code></pre>
    <div class="mt-3">Remove an extra header:</div>
    <pre><code v-html="code1"></code></pre>
  </div>
</template>

<script setup lang="ts">
import { hljs } from "@/conf"


const code0 = hljs.highlight(`api.addHeader("X-My-Header", "some value")`, { language: "typescript" }).value;

const code1 = hljs.highlight(`api.removeHeader("X-My-Header")`, { language: "typescript" }).value;
</script>

<style lang="sass">
  .maxw-100
      max-width: 100ch
</style>