<script setup lang="ts">
import HeaderC from '@/components/HeaderC.vue'
import FooterC from '@/components/FooterC.vue'
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useGlobalStore } from '@/stores/globalStore'

const globalStore = useGlobalStore()
const toast = useToast()
const fullName = ref<any>(localStorage.getItem('fullName'))
const dateOfBirth = ref<any>(localStorage.getItem('dateOfBirth'))
const email = ref<any>(localStorage.getItem('email'))
const password = ref('')
const confirmPassword = ref('')
const mismatch = ref(false)
const activeBtn = ref(true)

const editProfile = () => {
  if (localStorage.getItem('fullName') === fullName.value && localStorage.getItem('dateOfBirth') === dateOfBirth.value && localStorage.getItem('email') === email.value && password.value === '') {
    toast.clear()
    toast.warning('No changes were made!')
    return
  }
  if (fullName.value === '') {
    toast.clear()
    toast.error('Please enter your full name!')
    return
  }
  if (dateOfBirth.value === '') {
    toast.clear()
    toast.error('Please enter your date of birth!')
    return
  }
  if (email.value === '') {
    toast.clear()
    toast.error('Please enter your email address!')
    return
  }
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (!emailPattern.test(email.value)) {
    toast.clear()
    toast.error('Please enter a valid email address!')
    return
  }
  if (dateOfBirth.value.length !== 10) {
    toast.clear()
    toast.error('Please enter a valid date of birth!')
    return
  }
  if (password.value !== '' && password.value.length < 6) {
    toast.clear()
    toast.error('Password must be at least 6 characters!')
    return
  }
  globalStore.fullName = fullName.value
  globalStore.dateOfBirth = dateOfBirth.value
  globalStore.email = email.value
  localStorage.setItem('fullName', fullName.value)
  localStorage.setItem('dateOfBirth', dateOfBirth.value)
  localStorage.setItem('email', email.value)
  if (password.value) {
    localStorage.setItem('password', password.value)
  }
  password.value = ''
  confirmPassword.value = ''
  toast.clear()
  toast.success('Profile updated successfully!')
}

watch([password, confirmPassword], () => {
  if (password.value !== confirmPassword.value) {
    mismatch.value = true
    activeBtn.value = false
  } else {
    mismatch.value = false
    activeBtn.value = true
  }
})

const onDateInput = (event: any) => {
  const cleanedInput = event.target.value.replace(/\D/g, '')
  if (cleanedInput.length <= 2) {
    dateOfBirth.value = cleanedInput
  } else if (cleanedInput.length <= 4) {
    dateOfBirth.value = cleanedInput.slice(0, 2) + '/' + cleanedInput.slice(2)
  } else {
    dateOfBirth.value =
      cleanedInput.slice(0, 2) + '/' + cleanedInput.slice(2, 4) + '/' + cleanedInput.slice(4, 8)
  }
}

window.scrollTo({
  top: 0,
  behavior: 'smooth'
})
</script>

<template>
  <HeaderC />
  <div class="container edit-view">
    <div class="edit-profile">
      <p>Edit profile</p>
    </div>
    <form @submit.prevent="editProfile" class="edit-form">
      <div class="edit">
        <div class="edit-blocks">
          <div class="edit-input">
            <p>Full name</p>
            <input type="text" v-model="fullName" placeholder="First name" />
          </div>
          <div class="edit-input">
            <p>Date of birth</p>
            <input
              @input="onDateInput"
              type="text"
              v-model="dateOfBirth"
              placeholder="Date of birth"
            />
          </div>
        </div>
        <div class="edit-blocks">
          <div class="edit-input">
            <p>Email address</p>
            <input type="text" v-model="email" placeholder="Email address" />
          </div>
          <div class="edit-input">
            <p>Password (optional)</p>
            <input v-model="password" type="password" placeholder="Password" />
          </div>
          <div class="edit-input">
            <p>Confirm password</p>
            <input v-model="confirmPassword" type="password" placeholder="Confirm password" />
          </div>
        </div>
      </div>
      <p class="password_mismatch" v-if="mismatch">Password mismatch!</p>
      <button type="submit" v-if="activeBtn">Save</button>
      <button type="button" v-else>Save</button>
    </form>
  </div>
  <FooterC />
</template>

<style scoped lang="scss">
.edit-view {
  padding: 20px 150px 200px;
}
.edit-profile {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  p {
    margin: 0 auto;
    font-weight: 700;
    font-size: 40px;
    color: #ffffff;
  }
}
.edit-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  gap: 20px;
  margin: 0 auto;
  button {
    width: 100%;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    background-color: rgb(1, 119, 253);
    outline: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  button:hover {
    background-color: rgb(0, 82, 204);
  }
}
.edit {
  display: flex;
  margin-top: 20px;
  gap: 50px;
}
.edit-blocks {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.edit-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
  p {
    font-weight: 500;
    font-size: 17px;
    color: #ffffff;
  }
  input {
    width: 100%;
    max-width: 300px;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    background-color: rgb(255, 246, 123);
    outline: none;
  }
  input::placeholder {
    color: #535353;
    font-size: 16px;
    font-weight: 600;
  }
}
.password_mismatch {
  color: red;
  font-size: 15px;
  font-weight: 700;
  margin: -10px auto;
}
</style>
