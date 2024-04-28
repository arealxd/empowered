<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['login'])

const email = ref('')

const doForgot = () => {
  console.log('forgot: ' + email.value)
}
</script>

<template>
  <div class="login">
    <p class="login__title">Recover account via email</p>
    <form @submit.prevent="doForgot" class="login__form">
      <div class="login__inputs-list">
        <input type="email" v-model="email" class="login__input" placeholder="Email" required />
      </div>
      <button type="submit" class="login__submit">Recover</button>
    </form>
    <div class="login__other">
      <p class="login__other-signup">
        Remembered your login details? <span @click="emit('login')">Log in</span>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 47px 0 302px 0;
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
</style>
