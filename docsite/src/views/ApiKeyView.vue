<template>
  <div class="p-3 prose md-content maxw-100 dark:prose-invert">
    <h2>Api key</h2>
    <div class="mt-3">Add an api key Authorization header to each request:</div>
    <pre><code v-html="code0"></code></pre>
  </div>
</template>

<script setup lang="ts">
import { hljs } from "@/conf"


const code0 = hljs.highlight(`const apiKey = "xxx";\napi.addHeader("Authorization", \`Bearer \${apiKey}\`)`, { language: "typescript" }).value;
</script>