import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  const isLoading = ref<boolean>(false)

  return { isLoading }
})
