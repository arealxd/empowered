<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
</script>

<template>
  <div v-if="width < 850" class="mobile-banner">
    <img class="mobile-banner-logo" src="/img/logo.png" alt="logo">
    <p class="mobile-banner-title">
      Website available only on PC and Laptop. Download our app to use it on your mobile phone.
    </p>
    <a href="https://play.google.com/store/apps?hl=ru&gl=US" target="_blank">
      <img src="/img/play-market.png" alt="play market">
    </a>
  </div>
</template>

<style scoped lang="scss">
.mobile-banner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-image: url('/img/mobile-bg.png');
  background-size: cover;
  background-position: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  min-height: 100vh;
  min-width: 100vw;
  .mobile-banner-logo {
    width: fit-content;
    margin-top: 30%;
    margin-bottom: 30px;
  }
  .mobile-banner-title {
    font-size: 25px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 20px;
    max-width: 90%;
  }
  img {
    width: 200px;
  }
}
</style>