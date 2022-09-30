<template>
  <the-header :lib-name="libName" :links="links"></the-header>
  <div class="h-full min-h-screen pt-16 pb-8 background md:pl-48">
    <router-view></router-view>
  </div>
  <the-sidebar class="fixed left-0 hidden w-48 h-screen p-3 top-16 md:block secondary"></the-sidebar>
</template>

<script setup lang="ts">
import TheHeader from "./components/TheHeader.vue";
import TheSidebar from "./components/TheSidebar.vue";
import { libName, links } from "@/conf";
</script>

<style lang="sass">
.md-content
  em
    @apply font-semibold txt-light not-italic
kbd
  @apply px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500
</style>


