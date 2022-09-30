<template>
  <div class="p-3 prose md-content dark:prose-invert">
    <h2>Patch request</h2>
    <render-ts-file file-url="/examples/ts/patch.ts"></render-ts-file>
  </div>
</template>

<script setup lang="ts">
import RenderTsFile from '@/widgets/RenderTsFile.vue';
</script>