<script setup lang="ts">
import HeaderC from '@/components/HeaderC.vue'
import FooterC from '@/components/FooterC.vue'
// import { ref } from 'vue'
// import { useRouter } from 'vue-router'
// const router = useRouter()

window.scrollTo(0, 0)
</script>

<template>
  <HeaderC />
  <div class="container">
    <div class="about">
      <p>
        <span>EmpowerED</span> - Where Knowledge Meets Opportunity.
      </p>
      <img src="/img/about.png" alt="" />
    </div>
    <div class="info">
      <p class="info__title">Improving lives through learning</p>
      <p class="info__description">
        At EmpowerED, we believe in the transformative power of education. Our platform is designed to empower learners worldwide by providing access to high-quality, engaging courses taught by experts in their fields. Whether you're looking to enhance your professional skills, explore new interests, or simply expand your knowledge, EmpowerED has something for everyone.
      </p>
      <img src="/img/about_info.png" alt="" />
    </div>
  </div>
  <div class="facts">
    <div class="facts__container container">
      <p class="facts__container-title">We just keep growing</p>
      <p class="facts__container-description">
        Our global community and our course catalog get bigger every day. Check out our latest data
        for the last year.
      </p>
      <div class="facts__container-cards">
        <div class="facts__container-cards__card">
          <p class="facts__container-cards__card-title">200K+</p>
          <p class="facts__container-cards__card-description">Learners</p>
        </div>
        <div class="facts__container-cards__card">
          <p class="facts__container-cards__card-title">10K+</p>
          <p class="facts__container-cards__card-description">Teachers</p>
        </div>
        <div class="facts__container-cards__card">
          <p class="facts__container-cards__card-title">120K+</p>
          <p class="facts__container-cards__card-description">Courses</p>
        </div>
        <div class="facts__container-cards__card">
          <p class="facts__container-cards__card-title">50K+</p>
          <p class="facts__container-cards__card-description">Course enrollments</p>
        </div>
      </div>
    </div>
  </div>
  <FooterC />
</template>

<style scoped lang="scss">
.about {
  padding: 40px 60px 40px 100px;
  background: #d5d5d5;
  border-radius: 24.6857px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  p {
    font-weight: 400;
    font-size: 40px;
    line-height: normal;
    color: #b07c00;
    @media (max-width: 1000px) {
      font-size: 30px;
    }
  }
  span {
    color: #F2C94C;
    font-weight: 600;
    background-image: linear-gradient(
        -225deg,
        #231557 0%,
        #44107a 29%,
        #ff1361 67%,
        #fff800 100%
    );
    background-size: auto auto;
    background-clip: border-box;
    background-size: 200% auto;
    background-clip: text;
    text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: textclip 2s linear infinite;
    display: inline-block;
  }
  @keyframes textclip {
    to {
      background-position: 200% center;
    }
  }
  img {
    max-width: 600px;
    @media (max-width: 1200px) {
      max-width: 350px;
    }
  }
}
.info {
  display: flex;
  flex-direction: column;
  padding-top: 70px;
  padding-bottom: 120px;
  align-items: center;
  justify-content: center;
  .info__title {
    font-weight: 700;
    font-size: 45px;
    line-height: 1;
    color: #ffbe00;
    max-width: 700px;
    text-align: center;
  }
  .info__description {
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    color: #8f8f8f;
    max-width: 662px;
    margin-top: 15px;
    margin-bottom: 25px;
    text-align: center;
  }
  img {
    max-width: 500px;
    margin-top: 30px;
    animation: zoomInOut 3s ease-in-out infinite;
  }
}
@keyframes zoomInOut {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
.facts {
  background: rgb(136, 108, 32);
  padding: 100px 0;
  .facts__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .facts__container-title {
      font-weight: 700;
      font-size: 45px;
      line-height: 1;
      color: #ffffff;
      max-width: 700px;
      text-align: center;
    }
    .facts__container-description {
      font-weight: 400;
      font-size: 20px;
      line-height: 28px;
      color: #ffffff;
      max-width: 700px;
      margin-top: 15px;
      margin-bottom: 25px;
      text-align: center;
    }
    .facts__container-cards {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      padding: 0px 120px;
    }
    .facts__container-cards__card {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;
      justify-content: center;
      .facts__container-cards__card-title {
        font-size: 35px;
        font-weight: 700;
        color: white;
      }
      .facts__container-cards__card-description {
        font-size: 18px;
        font-weight: 500;
        color: white;
      }
    }
  }
}
</style>
