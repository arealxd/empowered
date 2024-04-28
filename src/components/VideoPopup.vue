<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  videourl: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const closePopup = () => {
  emit('close')
}
</script>

<template>
  <div class="popup">
    <div class="popup__content">
      <iframe :src="props.videourl" frameborder="0" allowfullscreen></iframe>
      <div class="popup__buttons">
        <button class="popup__button" @click="closePopup()">Close</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.popup__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  width: 80%;
  height: 80%;
}

.popup__buttons {
  margin-top: 20px;
}

.popup__button {
  padding: 10px 30px;
  font-size: 16px;
  background-color: #007aff;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}
.popup__button:hover {
  background-color: #004895;
}

iframe {
  width: 100%;
  height: 100%;
}
</style>
