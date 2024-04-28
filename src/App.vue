<script setup lang="ts">
import UiLoader from '@/components/UiLoader.vue'
import { useGlobalStore } from '@/stores/globalStore'

const globalStore = useGlobalStore();
</script>

<template>
  <div class="my-app">
    <div class="global-loader" v-if="globalStore.isLoading">
      <UiLoader />
    </div>
    <router-view />
  </div>
</template>

<style scoped lang="scss">
.my-app {
  height: 100%;
  min-height: 100vh;
  padding-bottom: 258px;
  .global-loader {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
  }
}
</style>
