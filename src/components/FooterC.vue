<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const goMainTop = () => {
  router.push('/')
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<template>
  <div class="full-footer-bg">
    <div class="container">
      <div class="footer">
        <div class="footer__blocks">
          <div class="footer__list">
            <p @click="router.push('/courses')">All courses</p>
            <p @click="router.push('/about')">About us</p>
            <p @click="router.push('/auth')">Log in</p>
          </div>
          <div class="footer__list contact">
            <a href="tel:+77055254909"><span>Contact phone:</span> +7 (700) 235-37-47</a>
            <a href="mailto:empower.ed@gmail.com"><span>E-mail:</span> empower.ed@gmail.com</a>
            <a href="https://2gis.kz/almaty/geo/70030076160263029" target="_blank"
              ><span>Address:</span> Kazakhstan, Almaty, Abaya 90</a
            >
          </div>
        </div>
        <div class="footer__copyright">
          <img class="footer__copyright-logo"
               @click="goMainTop"
               src="/img/logo.png" alt="" />
          <p class="footer__copyright-copyright">© 2024 EmpowerED.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.full-footer-bg {
  background: #2a2a2a;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
.footer {
  padding: 28px 0 32px 0;
  background: #2a2a2a;
}
.footer__blocks {
  display: flex;
  gap: 150px;
}
.footer__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  p,
  a {
    font-weight: 400;
    font-size: 13px;
    color: #ffffff;
    cursor: pointer;
    max-width: 150px;
    transition: all 0.3s ease;
  }
  p:hover,
  a:hover {
    color: #F2C94C;
    text-decoration: underline;
    text-underline-offset: 5px;
  }
}
.contact {
  p,
  a {
    white-space: nowrap;
  }
  span {
    font-weight: 700;
  }
}
.footer__copyright {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 75px;
  .footer__copyright-copyright {
    color: #ffffff;
    font-weight: 400;
    font-size: 12px;
  }
}
.footer__copyright-logo {
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
}
</style>
