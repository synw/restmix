<template>
  <div class="p-3">
    <render-md-file :file-url="'/sse.md'" :hljs="hljs"></render-md-file>
  </div>
</template>

<script setup lang="ts">
import RenderMdFile from '@/widgets/RenderMdFile.vue';
import { hljs } from "@/conf";
</script>