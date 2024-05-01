import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  const isLoading = ref<boolean>(false)
  const splashLoading = ref<boolean>(true)
  const isAuth = ref<boolean>(localStorage.getItem('isAuth') === 'true' || false)
  const fullName = ref<string>(localStorage.getItem('fullName') || '')
  const dateOfBirth = ref<string>(localStorage.getItem('dateOfBirth') || '')
  const email = ref<string>(localStorage.getItem('email') || '')
  const myCourses = ref<number[] | undefined>([])
  const videoPopup = ref<boolean>(false)

  return {
    isLoading,
    splashLoading,
    isAuth,
    fullName,
    dateOfBirth,
    email,
    myCourses,
    videoPopup
  }
})
