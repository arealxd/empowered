<script setup lang="ts">
import LoginC from '@/components/LoginC.vue'
import SignupC from '@/components/SignupC.vue'
import ForgotPasswordC from '@/components/ForgotPasswordC.vue'
import HeaderC from '@/components/HeaderC.vue'
import FooterC from '@/components/FooterC.vue'
import { ref } from 'vue'

const login = ref(true)
const signup = ref(false)
const forgotPassword = ref(false)

const toggleLogin = () => {
  login.value = true
  signup.value = false
  forgotPassword.value = false
}

const toggleSignup = () => {
  signup.value = true
  login.value = false
  forgotPassword.value = false
}

const toggleForgotPassword = () => {
  forgotPassword.value = true
  login.value = false
  signup.value = false
}

window.scrollTo(0, 0)

if (localStorage.getItem('token')) {
  window.location.href = '/'
}
</script>

<template>
  <HeaderC @signup="toggleSignup" @login="toggleLogin" />
  <div class="container">
    <LoginC v-if="login" @signup="toggleSignup" @forgot="toggleForgotPassword" />
    <SignupC v-if="signup" @login="toggleLogin" @forgot="toggleForgotPassword" />
    <ForgotPasswordC v-if="forgotPassword" @login="toggleLogin" />
  </div>
  <FooterC />
</template>

<style scoped lang="scss"></style>
