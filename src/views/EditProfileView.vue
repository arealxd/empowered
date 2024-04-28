<script setup lang="ts">
import HeaderC from '@/components/HeaderC.vue'
import FooterC from '@/components/FooterC.vue'
import { ref, watch } from 'vue'
import axios from 'axios'

axios
  .get('http://localhost:8080/api/user/myProfile', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  })
  .then((res) => {
    fullName.value = res.data.fullName
    email.value = res.data.email
  })
  .catch((err) => {
    console.log(err)
  })

const fullName = ref<any>(localStorage.getItem('fullName'))
const dateOfBirth = ref<any>('31.07.2000')
const email = ref<any>(localStorage.getItem('email'))
const password = ref('')
const confirmPassword = ref('')

const editProfile = () => {
  axios
    .put(
      'http://localhost:8080/api/user/update',
      {
        fullName: fullName.value,
        dateOfBirth: dateOfBirth.value,
        email: email.value,
        password: password.value,
        matchingPassword: password.value
      },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
    .then((res) => {
      console.log(res)
      successfullySaved.value = true
      setTimeout(() => {
        successfullySaved.value = false
        password.value = ''
        confirmPassword.value = ''
      }, 1500)
    })
    .catch((err) => {
      console.log(err)
    })
}

const mismatch = ref(false)
const successfullySaved = ref(false)
const activeBtn = ref(true)

watch(confirmPassword, () => {
  if (password.value !== confirmPassword.value) {
    mismatch.value = true
    activeBtn.value = false
  } else {
    mismatch.value = false
    activeBtn.value = true
  }
})

const onDateInput = (event: any) => {
  // Remove non-numeric characters from the input
  const cleanedInput = event.target.value.replace(/\D/g, '')
  // Format the input as a date (DD/MM/YYYY)
  if (cleanedInput.length <= 2) {
    dateOfBirth.value = cleanedInput
  } else if (cleanedInput.length <= 4) {
    dateOfBirth.value = cleanedInput.slice(0, 2) + '/' + cleanedInput.slice(2)
  } else {
    dateOfBirth.value =
      cleanedInput.slice(0, 2) + '/' + cleanedInput.slice(2, 4) + '/' + cleanedInput.slice(4, 8)
  }
}

window.scrollTo(0, 0)
</script>

<template>
  <HeaderC />
  <div class="container edit-view">
    <div class="edit-profile">
      <p>Edit profile</p>
    </div>
    <form @submit.prevent="editProfile" class="edit-form">
      <div class="edit" v-auto-animate="{ duration: 500 }">
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
            <input type="email" v-model="email" placeholder="Email address" />
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
      <p class="successfully_saved" v-if="successfullySaved">Successfully saved</p>
      <button type="submit" v-if="activeBtn">Save</button>
      <button type="button" v-else>Save</button>
    </form>
  </div>
  <FooterC />
</template>

<style scoped lang="scss">
.edit-view {
  padding: 20px 150px;
  padding-bottom: 200px;
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
  margin: 0 auto;
  margin: -10px auto;
}
.successfully_saved {
  color: rgb(31, 187, 0);
  font-size: 15px;
  font-weight: 700;
  margin: 0 auto;
  margin: -10px auto;
}
</style>
