<template>
  <div>
    <div class="flex flex-col mt-3 space-y-1">
      <div>
        <button class="btn" @click="open('/apidoc/install')">Install</button>
      </div>
      <div>
        <button class="btn" @click="open('/apidoc/options')">Options</button>
      </div>
      <div>
        <button class="btn" @click="open('/apidoc/how')">How it works</button>
      </div>
      <div>
        <button class="btn" @click="open('/apidoc/response')">Response</button>
      </div>
    </div>
    <div class="mt-5 text-xl">Methods</div>
    <div class="flex flex-col mt-3 space-y-1">
      <div>
        <button class="btn" @click="open('/ts/get')">Get</button>
      </div>
      <div>
        <button class="btn" @click="open('/ts/post')">Post</button>
      </div>
      <div>
        <button class="btn" @click="open('/ts/postsse')">Post sse</button>
      </div>
      <div>
        <button class="btn" @click="open('/ts/put')">Put</button>
      </div>
    </div>
    <div class="mt-5 text-xl">Errors</div>
    <div class="flex flex-col mt-3 space-y-1">
      <div>
        <button class="btn" @click="open('/ts/error')">Manage errors</button>
      </div>
    </div>
    <div class="mt-5 text-xl">Headers</div>
    <div class="flex flex-col mt-3 space-y-1">
      <div>
        <button class="btn" @click="open('/ts/apikey')">Api key</button>
      </div>
      <div>
        <button class="btn" @click="open('/ts/csrf')">Csrf tokens</button>
      </div>
      <div>
        <button class="btn" @click="open('/ts/headers')">Extra headers</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';

const emit = defineEmits(["open"]);

function open(url: string) {
  router.push(url);
  emit("open")
}
</script>