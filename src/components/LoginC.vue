<script setup lang="ts">
import { ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'
import { useToast } from 'vue-toastification'
import router from '@/router'

const globalStore = useGlobalStore()
const toast = useToast()
const emit = defineEmits(['forgot', 'signup'])

const email = ref('')
const password = ref('')
const emailError = ref(false)
const passwordError = ref(false)

const doLogin = () => {
  if (!email.value || !password.value) {
    toast.clear()
    toast.error('Please fill all fields')
    emailError.value = true
    passwordError.value = true
    if (!email.value && password.value) {
      emailError.value = true
      passwordError.value = false
    }
    if (!password.value && email.value) {
      passwordError.value = true
      emailError.value = false
    }
    return
  } else {
    emailError.value = false
    passwordError.value = false
  }
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (!emailPattern.test(email.value)) {
    emailError.value = true
    toast.clear()
    toast.error('Invalid email')
    return
  } else {
    emailError.value = false
  }
  if (localStorage.getItem('email') === email.value && localStorage.getItem('password') === password.value) {
    localStorage.setItem('isAuth', 'true')
    globalStore.isAuth = true
    toast.clear()
    toast.success('Logged in successfully')
    router.push('/')
  } else {
    toast.clear()
    toast.error('Invalid email or password')
    emailError.value = true
    passwordError.value = true
  }
}
</script>

<template>
  <div class="login">
    <p class="login__title">Log in to your <span>EmpowerED</span> account</p>
    <form @submit.prevent="doLogin" class="login__form">
      <div class="login__inputs-list">
        <input type="text"
               v-model="email"
               class="login__input"
               :class="{ 'input-error': emailError }"
               placeholder="Email"
        />
        <input type="password"
              v-model="password"
              class="login__input"
              :class="{ 'input-error': passwordError }"
              placeholder="Password"
        />
      </div>
      <button type="submit" class="login__submit">Log in</button>
    </form>
    <div class="login__other">
      <!-- <p class="login__other-forget">or <span @click="emit('forgot')">Forgot Password</span></p> -->
      <hr />
      <p class="login__other-signup">
        Don't have an account? <span @click="emit('signup')">Sign up</span>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrong-password {
  color: #ff0000;
  font-weight: 700;
  font-size: 14px;
  margin-top: 16px;
  text-align: center;
  margin-bottom: -20px;
}
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 47px 0 250px 0;
  width: 100%;
  max-width: 352px;
  margin: 0 auto;
}
.login__title {
  color: #e0e1e3;
  font-weight: 700;
  font-size: 16px;
  span {
    color: #F2C94C;
    font-weight: 700;
    font-size: 16px;
  }
}
.login__form {
  width: 100%;
}
.login__inputs-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 34px;
  width: 100%;
  .login__input {
    color: #e0e1e3;
    font-weight: 700;
    font-size: 14px;
    padding: 21px 28px;
    border: 1px solid #F2C94C;
    border-radius: 30px;
    background: transparent;
    width: 100%;
  }
  .login__input::placeholder {
    color: #e0e1e3;
    font-weight: 700;
    font-size: 14px;
  }
}
.login__submit {
  color: #0d0d0d;
  padding: 13.41px 0;
  background: #F2C94C;
  border-radius: 30px;
  transition: all 0.3s ease;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  margin-top: 16px;
  width: 100%;
  border: none;
}
.login__submit:hover {
  background: #fff600;
}
.login__other {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 25px;
  .login__other-forget {
    color: #ffffff;
    font-weight: 400;
    font-size: 16px;
    span {
      color: #F2C94C;
      font-weight: 700;
      font-size: 16px;
      transition: all 0.3s ease;
      text-decoration: underline;
      cursor: pointer;
    }
    span:hover {
      color: orange;
    }
  }
  hr {
    width: 100%;
    display: block;
    height: 2px;
    border: 0;
    border-top: 2px solid #2e363c;
    margin: 1em 0;
    padding: 0;
  }
  .login__other-signup {
    color: #ffffff;
    font-weight: 400;
    font-size: 14px;
    span {
      color: #F2C94C;
      font-weight: 700;
      font-size: 14px;
      transition: all 0.3s ease;
      text-decoration: underline;
      cursor: pointer;
    }
    span:hover {
      color: orange;
    }
  }
}

.input-error {
  border: 1px solid #ff0000 !important;
}
</style>
