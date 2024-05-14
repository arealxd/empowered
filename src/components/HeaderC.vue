<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGlobalStore } from '@/stores/globalStore'

const globalStore = useGlobalStore()
const router = useRouter()
const route = useRoute()

const showProfile = ref(false)
const searchValue = ref('')

const doSearch = () => {
  router.push(`/courses/search?find=${searchValue.value}`)
}

const goHome = () => {
  router.push('/')
}

const goCourses = () => {
  searchValue.value = ''
  router.push('/courses')
}

const goProfile = () => {
  if (globalStore.isAuth || localStorage.getItem('isAuth') === 'true') {
    showProfile.value = !showProfile.value
  } else {
    router.push('/auth')
  }
}

const toggleLogin = () => {
  if (route.path !== '/auth') {
    router.push('/auth')
  }
}

const logout = () => {
  localStorage.clear()
  globalStore.isAuth = false
  router.push('/auth')
}

const openMyCourses = () => {
  showProfile.value = false
  router.push('/my-courses')
}

const addLocalToGlobal = () => {
  globalStore.isLoading = true
  if (localStorage.getItem('myCourses') != null) {
    globalStore.myCourses = localStorage.getItem('myCourses')?.split(',').map(Number)
  }
  console.log(globalStore.myCourses)
  globalStore.isLoading = false
}

addLocalToGlobal()
</script>

<template>
  <div class="full-header-bg">
    <div class="container">
      <div class="header">
        <img src="/img/logo.png" @click="goHome" class="header__logo" alt="" />
        <RouterLink to="/courses" @click="goCourses" class="header__my-courses"
          >All courses</RouterLink
        >
        <form @submit.prevent="doSearch" class="header__search-form">
          <input
            type="text"
            v-model="searchValue"
            placeholder="&#xF002;      Search by courses"
            class="header__search"
          />
          <input type="submit" hidden />
        </form>
        <img src="/img/profile_icon.png"
             v-if="globalStore.isAuth"
             @click="goProfile"
             class="header__profile"
             alt="user" />
        <Transition>
          <div class="profile-popup" v-if="showProfile">
            <img src="/img/userAva.png" alt="" />
            <p class="user-name">{{ globalStore.fullName }}</p>
            <p class="user-email">{{ globalStore.email }}</p>
            <hr />
            <div class="notification" @click="openMyCourses">
              <img src="/img/learning.png" alt="" />
              <p class="notification-text">My courses</p>
            </div>
            <p class="edit-profile" @click="router.push('/edit-profile')">Edit profile</p>
            <p class="logout-profile" @click="logout">Logout</p>
          </div>
        </Transition>
        <button class="header__login"
                @click="toggleLogin"
                v-if="!globalStore.isAuth">
          Log in
        </button>
        <button
          class="header__login header__auth-active about"
          @click="router.push('/about')"
        >
          About us
        </button>
      </div>
    </div>
  </div>
  <div v-if="showProfile" @click="showProfile = false" class="cover_dark" />
</template>

<style scoped lang="scss">
.full-header-bg {
  background: #F2C94C;
  width: 100%;
}
.header {
  display: flex;
  align-items: center;
  padding: 25px 0;
  background: #F2C94C;
}
.header__logo {
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
}
.header__my-courses {
  color: #000;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  padding: 10px 20px;
  background: #fff;
  border-radius: 30px;
  transition: all 0.3s ease;
  margin: 0 30px;
  white-space: nowrap;
}

.header__search-form {
  width: 100%;
  margin-right: 30px;
}
.header__search {
  font-family: 'Roboto', FontAwesome;
  color: #000;
  padding: 15px 20px;
  background: #fff;
  border: 1px solid #fff;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 14px;
  width: 100%;
}
.header__search::placeholder {
  color: #000;
  font-weight: 400;
  font-size: 14px;
}
.header__profile {
  margin: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  scale: 1.2;
  filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%) hue-rotate(360deg) brightness(103%) contrast(104%);
  &:hover {
    scale: 1.4;
  }
}
.profile-popup {
  position: absolute;
  padding: 37px 46px;
  background: #ffffff;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  z-index: 9999;
  right: 0;
  top: 75px;
  text-align: center;
}
.cover_dark {
  background: #000000;
  opacity: 0.5;
  z-index: 999;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
}
.user-name {
  font-weight: 500;
  font-size: 20px;
  color: #202020;
  margin-top: 10px;
}
.user-email {
  font-weight: 275;
  font-size: 13px;
  color: #202020;
}

hr {
  width: 250px;
  margin-top: 10px;
  border-top: 2px solid #dcdbdd;
}

.notification {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 24px auto 0;
  cursor: pointer;
  width: fit-content;
}

.notification img {
  width: 24px;
  height: 24px;
}

.notification-text {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #202020;
}

.notification:hover .notification-text {
  transition: all 0.3s ease-out;
  text-decoration: underline;
  text-underline-offset: 5px;
  text-decoration-thickness: 2px;
}

.edit-profile {
  font-weight: 600;
  font-size: 15px;
  color: #ffffff;
  padding: 8px 0px;
  width: 100%;
  max-width: 155px;
  background: #009580;
  border-radius: 12px;
  margin: 25px auto 0;
  cursor: pointer;
  transition: all 0.3s ease-out;
}

.edit-profile:hover {
  background: #035a4e;
}

.logout-profile {
  font-weight: 600;
  font-size: 15px;
  color: #ffffff;
  padding: 8px 0px;
  width: 100%;
  max-width: 155px;
  background: #aa2020;
  border-radius: 12px;
  margin: 0 auto;
  margin-top: 10px;
  cursor: pointer;
  transition: all 0.3s ease-out;
}

.logout-profile:hover {
  background: #8b0101;
}
.header__login,
.header__signup {
  color: #000;
  font-weight: 700;
  font-size: 14px;
  padding: 12px 16px;
  border: 1px solid #F2C94C;
  border-radius: 30px;
  background: #ffffff;
  transition: all 0.3s ease;
  white-space: nowrap;
}
.header__login:hover,
.header__signup:hover {
  background: #226aff;
  color: #fff;
}
.header__auth-active {
  font-weight: 700;
  font-size: 14px;
  color: #0d0d0d;
  padding: 12px 16px;
  background: #fff;
  border-radius: 30px;
  white-space: nowrap;
}

.header__my-courses:hover {
  background: #226aff;
  color: #fff;
}
.about {
  margin-left: 20px;
}
.about:hover {
  background: #226aff;
  color: #fff;
}
</style>
