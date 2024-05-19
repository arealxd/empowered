<script setup lang="ts">
import HeaderC from '@/components/HeaderC.vue'
import FooterC from '@/components/FooterC.vue'
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useGlobalStore } from '@/stores/globalStore'
import { getAuth, updateEmail, updatePassword } from 'firebase/auth'

const globalStore = useGlobalStore()
const toast = useToast()
const email = ref<any>(localStorage.getItem('email'))
const password = ref('')
const confirmPassword = ref('')
const mismatch = ref(false)
const activeBtn = ref(true)
let user;

const editProfile = async () => {
  user = getAuth().currentUser
  if (localStorage.getItem('email') === email.value && password.value === '') {
    toast.clear()
    toast.info('No changes were made!')
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
  if (password.value !== '' && password.value.length < 6) {
    toast.clear()
    toast.error('Password must be at least 6 characters!')
    return
  }
  if (user && email.value !== localStorage.getItem('email')) {
    globalStore.isLoading = true
    await updateEmail(user, email.value).then(() => {
      globalStore.email = email.value
      localStorage.setItem('email', email.value)
      toast.success('Email updated successfully!')
    }).catch((error) => {
      toast.clear()
      toast.error(error.message)
    }).finally(() => {
      globalStore.isLoading = false
    })
  }
  if (user && password.value !== '') {
    globalStore.isLoading = true
    await updatePassword(user, password.value).then(() => {
      toast.success('Password updated successfully!')
      password.value = ''
      confirmPassword.value = ''
    }).catch((error) => {
      toast.clear()
      toast.error(error.message)
    }).finally(() => {
      globalStore.isLoading = false
    })
  }
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
  padding: 20px 150px 300px;
}
.edit-profile {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  p {
    margin: 0 auto;
    font-weight: 700;
    font-size: 40px;
    color: #525252;
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
  width: 100%;
}
.edit-blocks {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}
.edit-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
  p {
    font-weight: 500;
    font-size: 17px;
    color: #3a3a3a;
  }
  input {
    width: 100%;
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
