<template>
  <div class="p-3 prose md-content max-w-prose dark:prose-invert">
    <h2>Response error</h2>
    <render-ts-file file-url="/examples/ts/error.ts"></render-ts-file>
  </div>
</template>

<script setup lang="ts">
import RenderTsFile from '@/widgets/RenderTsFile.vue';
</script>