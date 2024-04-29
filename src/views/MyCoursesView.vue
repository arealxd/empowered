<script setup lang="ts">
import HeaderC from '@/components/HeaderC.vue'
import FooterC from '@/components/FooterC.vue'
// import coursesJson from '@/json/courses.json'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
const router = useRouter()

const myCourses = ref()

window.scrollTo(0, 0)

axios
  .get('http://localhost:8080/api/user/myCourses', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  })
  .then((res) => {
    myCourses.value = res.data.content
  })
  .catch((err) => {
    console.log(err)
  })
</script>

<template>
  <HeaderC />
  <div class="container">
    <div class="courses">
      <p>My courses</p>
      <div class="courses__content">
        <div class="courses__list">
          <div
            class="courses__list-course"
            v-for="(i, index) in myCourses"
            :key="index"
            @click="router.push('/details/' + i?.id + '/' + 1)"
          >
            <img :src="i?.fileDto?.url" alt="" />
            <div class="course__info">
              <p class="course__info-name">{{ i.title }}</p>
              <p class="course__info-description">{{ i.description }}</p>
              <p class="course__info-author">{{ i.author }}</p>
              <div class="course__info-rating">
                <img src="/img/star.png" alt="" />
                <p>{{ i.rating }}</p>
              </div>
              <div class="course__info-hours">
                <p>{{ i.totalHours }} total hours</p>
                <svg
                  width="6"
                  height="6"
                  viewBox="0 0 6 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.13513 5.42275C4.45513 5.42275 5.51113 4.36675 5.51113 3.04675C5.51113 1.72675 4.45513 0.67075 3.13513 0.67075C1.81513 0.67075 0.759125 1.72675 0.759125 3.04675C0.759125 4.36675 1.81513 5.42275 3.13513 5.42275Z"
                    fill="#6A6F73"
                  />
                </svg>
                <p>{{ i.lecturesQuantity }} lectures</p>
              </div>
            </div>
          </div>
          <div class="havent-buy" v-if="myCourses?.length === 0">
            <p>You haven't bought the course yet</p>
            <button @click="router.push('/courses')">View Courses</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <FooterC />
</template>

<style scoped lang="scss">
.courses {
  padding: 20px 150px;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  p {
    font-weight: 700;
    font-size: 40px;
    color: #ffffff;
  }
}
.courses__content {
  display: flex;
  margin-top: 0px;
  gap: 40px;
}
.courses__list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 40px;
  .courses__list-course {
    cursor: pointer;
    display: flex;
    gap: 15px;
    &:hover {
      -webkit-filter: drop-shadow(0px 0px 5px #fff);
      filter: drop-shadow(0px 0px 5px #fff);
    }
    img {
      width: 260px;
      height: 170px;
      border-radius: 10px;
    }
    .course__info {
      display: flex;
      flex-direction: column;
      gap: 5px;
      .course__info-name {
        font-weight: 700;
        font-size: 20px;
        color: #ffffff;
      }
      .course__info-description {
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        max-width: 650px;
      }
      .course__info-author {
        font-weight: 400;
        font-size: 12px;
        color: #6a6f73;
      }
      .course__info-rating {
        display: flex;
        align-items: center;
        gap: 8px;
        img {
          width: 15px;
          height: 15px;
        }
        p {
          font-weight: 700;
          font-size: 14px;
          color: #ffb800;
        }
      }
      .course__info-hours {
        display: flex;
        align-items: center;
        gap: 5px;
        p {
          font-weight: 400;
          font-size: 12px;
          color: #6a6f73;
        }
      }
    }
  }
}
.havent-buy {
  display: flex;
  flex-direction: column;
  height: 100%;
  p {
    font-weight: 500;
    font-size: 20px;
    color: #bdbdbd;
    margin: 0 auto;
  }
  button {
    width: 100%;
    padding: 10px 0px;
    background: #d0d0d0d6;
    border-radius: 30px;
    border: none;
    font-weight: 700;
    font-size: 15px;
    color: #000000;
    cursor: pointer;
    margin: 0 auto;
    margin-top: 15px;
    transition: all 0.3s ease;
  }
  button:hover {
    background: rgb(241, 255, 46);
  }
}
</style>
