<script setup lang="ts">
import { ref } from 'vue'
import { useToast} from 'vue-toastification'
import { useGlobalStore } from '@/stores/globalStore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const globalStore = useGlobalStore()
const toast = useToast()
const emit = defineEmits(['forgot', 'login'])
const errorMessage = ref('')
const email = ref('')
const password = ref('')
const emailError = ref(false)
const passwordError = ref(false)

const doSignup = async () => {
  if (!email.value || !password.value) {
    toast.clear()
    toast.error('Please fill all fields')
    return
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
  if (password.value.length < 6) {
    passwordError.value = true
    toast.clear()
    toast.error('Password must be at least 6 characters')
    return
  } else {
    passwordError.value = false
  }
  globalStore.isLoading = true
  await createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then(() => {
      emit('login')
      toast.clear()
      toast.success('Signed up successfully')
    }).catch((error) => {
      toast.clear()
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage.value = 'Email already in use'
          passwordError.value = false
          emailError.value = true
          break
        case 'auth/invalid-email':
          errorMessage.value = 'Invalid email'
          passwordError.value = false
          emailError.value = true
          break
        case 'auth/weak-password':
          errorMessage.value = 'Weak password'
          passwordError.value = true
          emailError.value = false
          break
        default:
          errorMessage.value = 'Something went wrong'
          passwordError.value = true
          emailError.value = true
      }
      toast.error(errorMessage.value)
    }).finally(() => {
      globalStore.isLoading = false
    })
}
</script>

<template>
  <div class="login">
    <p class="login__title">Sign up and start learning</p>
    <form @submit.prevent="doSignup" class="login__form">
      <div class="login__inputs-list">
        <input
          type="text"
          v-model="email"
          class="login__input"
          :class="{ 'input-error': emailError }"
          placeholder="Email" />
        <input
          type="password"
          v-model="password"
          class="login__input"
          :class="{ 'input-error': passwordError }"
          placeholder="Password"
        />
      </div>
      <button type="submit" class="login__submit">Sign up</button>
    </form>
    <div class="login__other">
      <!-- <p class="login__other-forget">or <span @click="emit('forgot')">Forgot Password</span></p> -->
      <hr />
      <p class="login__other-signup">
        Already have an account? <span @click="emit('login')">Log in</span>
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
  padding: 47px 0 350px 0;
  width: 100%;
  max-width: 352px;
  margin: 0 auto;
}
.login__title {
  color: #4b4b4b;
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
    color: #000000;
    font-weight: 700;
    font-size: 14px;
    padding: 21px 28px;
    border: 1px solid #F2C94C;
    border-radius: 30px;
    background: transparent;
    width: 100%;
  }
  .login__input::placeholder {
    color: #484848;
    font-weight: 700;
    font-size: 14px;
  }
}
.input-error {
  border: 1px solid #ff0000 !important;
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
    color: #505050;
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
    color: #545454;
    font-weight: 600;
    font-size: 14px;
    span {
      color: #ce9b00;
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
</style>
