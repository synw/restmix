<template>
  <div class="p-3 prose max-w-prose md-content dark:prose-invert">
    <h2>Get request</h2>
    <render-ts-file file-url="/examples/ts/get.ts"></render-ts-file>
    <div class="pt-3">
      With a custom type:
    </div>
    <render-ts-file class="pt-5" file-url="/examples/ts/get_typed.ts"></render-ts-file>
  </div>
</template>

<script setup lang="ts">
import RenderTsFile from '@/widgets/RenderTsFile.vue';
</script>