<script setup lang="ts">
import UiLoader from '@/components/UiLoader.vue'
import { useGlobalStore } from '@/stores/globalStore'
import MobileBanner from '@/components/MobileBanner.vue'
import { useWindowSize } from '@vueuse/core'
import { useRouter } from 'vue-router'

const { width } = useWindowSize()
const router = useRouter()
const globalStore = useGlobalStore();

const setLoader = () => {
  if (width.value < 850) {
    globalStore.isLoading = false
    globalStore.splashLoading = false
    return
  }
  setTimeout(() => {
    globalStore.splashLoading = false
  }, 2000)
}

if (globalStore.isAdmin || localStorage.getItem('isAdmin') === 'true') {
  router.push('/panel')
}

setLoader()
</script>

<template>
  <div class="my-app">
    <MobileBanner />
    <div class="global-loader" v-if="globalStore.isLoading || globalStore.splashLoading || globalStore.loader">
      <UiLoader />
    </div>
    <router-view v-if="width > 850"/>
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
