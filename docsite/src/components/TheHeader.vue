<template>
  <sw-header class="fixed top-0 left-0 z-40 w-screen h-16 primary" :class="css ? css : 'primary'" breakpoint="md"
    @togglemenu="isMenuVisible = !isMenuVisible">
    <template #branding>
      <a @click="$router.push('/')">
        <div class="ml-5 text-2xl cursor-pointer">
          {{ libName }}
        </div>
      </a>
    </template>
    <template #mobile-branding>
      <a class="ml-3 text-2xl" @click="$router.push('/')">
        {{ libName }}
      </a>
    </template>
    <template #mobile-back>
      <div class="pl-2 text-2xl" v-show="loc != '/'">
        <i-eva:arrow-back-outline />
      </div>
    </template>
    <template #menu>
      <div class="flex flex-row items-center justify-end h-full space-x-1">
        <div class="pr-5 text-2xl cursor-pointer txt-lighter dark:txt-light">
          <a href="https://github.com/synw/restmix">
            <i-fa-brands:github></i-fa-brands:github>
          </a>
        </div>
        <div class="pr-5 text-lg cursor-pointer txt-lighter dark:txt-light" @click="user.toggleDarkMode()">
          <i-fa-solid:moon v-if="!user.isDarkMode.value"></i-fa-solid:moon>
          <i-fa-solid:sun v-else></i-fa-solid:sun>
        </div>
      </div>
    </template>
  </sw-header>
  <sw-mobile-menu :is-visible="isMenuVisible" class="absolute left-0 z-50 w-full lighter top-14">
    <div class="flex flex-col p-3 space-y-5">
      <the-nav @open="closeMenu()"></the-nav>
      <div class="pr-5 text-lg" @click="closeMenu();user.toggleDarkMode()">
        <i-fa-solid:moon v-if="!user.isDarkMode.value"></i-fa-solid:moon>
        <i-fa-solid:sun v-else></i-fa-solid:sun>
      </div>
    </div>
  </sw-mobile-menu>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { SwHeader, SwMobileMenu } from "@snowind/header";
import { user } from "@/state";
import { libName } from "@/conf";
import TheNav from "./TheNav.vue";

defineProps({
  css: {
    type: String,
    default: "",
  },
  skipDarkModeToggle: {
    type: Boolean,
    default: false,
  },
  libName: {
    type: String,
    required: true,
  },
  links: {
    type: Object as () => Array<{ href: string, name: string }>,
    required: true,
  }
})

const isMenuVisible = ref(false);

const loc = computed(() => window.location.pathname);

function closeMenu() {
  isMenuVisible.value = false;
}
</script>