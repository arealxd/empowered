<script setup lang="ts">
import HeaderC from '@/components/HeaderC.vue'
import FooterC from '@/components/FooterC.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { useRoute } from 'vue-router'
import axios from 'axios'
// import coursesJson from '@/json/courses.json'
import VideoPopup from '@/components/VideoPopup.vue'

const route = useRoute()
const course = ref()

window.scrollTo(0, 0)

const buyed = ref(false)

const buyForm = ref(false)
const successBuy = ref(false)
const authorized = ref(false)

if (localStorage.getItem('token')) {
  authorized.value = true
}

const buyNow = () => {
  if (localStorage.getItem('token')) {
    buyForm.value = true
  } else {
    router.push('/auth')
  }
}

const buy_post = () => {
  axios
    .post(
      `http://localhost:8080/api/user/buy/${route.params.id}`,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
    .then((res) => {
      console.log(res)
      getCourseToken()
      successBuy.value = true
      setTimeout(() => {
        buyed.value = true
        buyForm.value = false
        window.scrollTo(0, 0)
      }, 2000)
    })
    .catch((err) => {
      console.log(err)
    })
}

const showPopup = ref(false)

const getCourseById = () => {
  axios
    .get(`http://localhost:8080/api/public/course/${route.params.id}`, {})
    .then((res) => {
      course.value = res.data
    })
    .catch((err) => {
      console.log(err)
    })
}

const getCourseToken = () => {
  axios
    .get(`http://localhost:8080/api/public/course/${route.params.id}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then((res) => {
      course.value = res.data
      console.log(course.value)
    })
    .catch((err) => {
      console.log(err)
    })
}

getCourseById()

const myCourses = ref()

if (localStorage.getItem('token')) {
  axios
    .get('http://localhost:8080/api/user/myCourses', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then((res) => {
      myCourses.value = res.data.content
      myCourses.value.forEach((i) => {
        if (i.id == route.params.id) {
          buyed.value = true
          getCourseToken()
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

const showReviews = ref(true)

const courseId = ref(route.params.id)
const text = ref('')
const rating = ref('')
const successLeaveReview = ref(false)
const showForm = ref(true)

const postReview = () => {
  axios
    .post(
      `http://localhost:8080/api/user/comment`,
      {
        courseId: courseId.value,
        text: text.value,
        rating: Number(rating.value)
      },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
    .then((res) => {
      console.log(res)
      getCourseToken()
      text.value = ''
      rating.value = ''
      successLeaveReview.value = true
      setTimeout(() => {
        successLeaveReview.value = false
        showForm.value = false
      }, 2000)
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>

<template>
  <HeaderC />
  <div class="container">
    <div class="courses" :class="{ 'unset-padding': buyed }">
      <div class="courses__breadcrumbs">
        <p @click="router.push('/')">Home</p>
        <svg
          width="7"
          height="12"
          viewBox="0 0 7 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-1.34741 1.41L3.23259 6L-1.34741 10.59L0.0625877 12L6.06259 6L0.0625877 0L-1.34741 1.41Z"
            fill="white"
          />
        </svg>
        <p v-if="route.params.from == 1" @click="router.push('/my-courses')">My courses</p>
        <p v-else-if="route.params.from == 2" @click="router.push('/courses')">Courses</p>
        <p v-else-if="route.params.from == 3">{{ course?.title }}</p>
        <p v-else>Courses</p>
        <svg
          v-if="route.params.from != 3"
          width="7"
          height="12"
          viewBox="0 0 7 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-1.34741 1.41L3.23259 6L-1.34741 10.59L0.0625877 12L6.06259 6L0.0625877 0L-1.34741 1.41Z"
            fill="white"
          />
        </svg>
        <p v-if="route.params.from != 3">{{ course?.title }}</p>
      </div>
      <div class="courses__preview">
        <div class="courses__preview-img">
          <img :src="course?.fileDto?.url" alt="" />
          <div class="courses__preview-info-btns">
            <button
              class="courses__preview-info-btns-buy"
              type="button"
              @click="buyNow"
              v-if="!buyForm && !buyed"
            >
              Buy now
            </button>
            <form @submit.prevent="buy_post" v-if="buyForm" class="buy-form">
              <div class="form-inputs">
                <input type="text" class="buy-form__num" required placeholder="Card number" />
                <input type="text" class="buy-form__date" required placeholder="Expiration date" />
                <input type="text" class="buy-form__cvv" required placeholder="CVV" />
              </div>
              <div class="form-inputs">
                <input type="text" class="buy-form__num owner" required placeholder="Owner" />
                <img src="/img/visa.png" alt="" />
              </div>
              <button class="courses__preview-info-btns-buy" type="submit" style="margin-top: 15px">
                Buy now
              </button>
              <p class="success_buy" v-if="successBuy">Purchased successfully</p>
            </form>
          </div>
        </div>
        <div class="courses__preview-info">
          <div class="courses__preview-header">
            <p class="courses__preview-info-title">{{ course?.title }}</p>

            <p class="price" v-if="!buyed">{{ course?.price }} $</p>
          </div>
          <p class="author">
            Author: <span v-if="course?.author">{{ course?.author }}</span>
            <span v-else>Course Lab</span>
          </p>
          <p class="language">
            Language: <span>{{ course?.language }}</span>
          </p>
          <div class="hours">
            <p>{{ course?.totalHours }} total hours</p>
            <svg
              width="6"
              height="6"
              viewBox="0 0 6 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.79138 5.37588C4.11138 5.37588 5.16738 4.31987 5.16738 2.99987C5.16738 1.67987 4.11138 0.623875 2.79138 0.623875C1.47138 0.623875 0.415375 1.67987 0.415375 2.99987C0.415375 4.31987 1.47138 5.37588 2.79138 5.37588Z"
                fill="#6A6F73"
              />
            </svg>

            <p>{{ course?.lecturesQuantity }} lectures</p>
          </div>
          <div class="rating" v-if="course?.rating">
            <img src="/img/star.png" alt="" />
            <p>{{ course?.rating }}</p>
          </div>
          <p class="courses__preview-info-desc">{{ course?.description }}</p>
        </div>
      </div>
    </div>
    <div class="content">
      <!-- <div class="content__learn">
        <p class="content__learn-title">What you'll learn</p>
        <div class="content__learn-list">
          <div class="content__learn-list-item" v-for="i in 6" :key="i">
            <svg
              width="24"
              height="20"
              viewBox="0 0 24 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.99991 16.6232L4.82991 12.4532L3.40991 13.8632L8.99991 19.4532L20.9999 7.45315L19.5899 6.04315L8.99991 16.6232Z"
                fill="#E0E1E3"
              />
            </svg>
            <p>
              Pianoforte solicitude so decisively unpleasing conviction is partiality he. Or
              particular so diminution entreaties oh do. Real he me fond show gave shot plan. Mirth
              blush linen small hoped way its along.
            </p>
          </div>
        </div>
      </div> -->
      <div class="comments" v-if="(buyed && authorized) || course?.commentDtos?.length > 0">
        <div class="comments__show" @click="showReviews = !showReviews">
          <p class="comments__title">Course Reviews</p>
          <p>{{ showReviews ? '🔽' : '🔼' }}</p>
        </div>
        <form
          @submit.prevent="postReview"
          class="comments__leave-form"
          v-if="showReviews && buyed && showForm"
        >
          <input
            type="number"
            placeholder="Rating from 1 to 5"
            class="comments__leave-form__rating"
            required
            v-model="rating"
          />
          <input
            type="text"
            placeholder="Your review about the course"
            class="comments__leave-form__text"
            required
            v-model="text"
          />
          <button type="submit">Leave a review</button>
          <p class="success" v-if="successLeaveReview">Successfully sent</p>
        </form>
        <div v-if="showReviews && course?.commentDtos?.length > 0">
          <div
            class="comments__comment"
            v-for="(comment, index) in course?.commentDtos"
            :key="index"
          >
            <div class="comments__comment-header">
              <div class="comments__comment-header-user">
                <img src="/img/user.png" alt="" />
                <p>{{ comment?.createdBy?.fullName }}</p>
              </div>
              <div class="comments__comment-header-rating">
                <img src="/img/star.png" alt="" />
                <p>{{ comment?.rating }}</p>
              </div>
            </div>
            <p class="comments__comment-text">
              {{ comment?.text }}
            </p>
          </div>
        </div>
      </div>
      <p class="content__title" v-if="buyed">Course content</p>
      <div v-if="buyed">
        <div class="content__section" v-for="(n, index) in course?.sectionDtos" :key="index">
          <div class="content__section-title">
            <p>{{ ++index }}. {{ n?.title }}</p>
            <p>{{ n?.moduleDtos?.length }} lectures</p>
          </div>
          <div class="content__section-videos" v-for="(i, index) in n?.moduleDtos" :key="index">
            <div class="content__section-videos-name">
              <svg
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.6364 0.59375H1.36364C0.606818 0.59375 0 1.20057 0 1.95739V10.1392C0 10.5009 0.143668 10.8477 0.3994 11.1034C0.655131 11.3592 1.00198 11.5028 1.36364 11.5028H4.77273V12.8665H10.2273V11.5028H13.6364C14.3864 11.5028 14.9932 10.8892 14.9932 10.1392L15 1.95739C15 1.59573 14.8563 1.24888 14.6006 0.99315C14.3449 0.737418 13.998 0.59375 13.6364 0.59375ZM13.6364 10.1392H1.36364V1.95739H13.6364V10.1392ZM10.2273 6.0483L5.45455 8.77557V3.32102L10.2273 6.0483Z"
                  fill="#E0E1E3"
                />
              </svg>
              <p @click="showPopup = true">{{ i?.title }}</p>
            </div>
            <p class="content__section-videos-duration">{{ i?.duration }}</p>
            <VideoPopup
              :videourl="i?.videoLink"
              :onClose="
                () => {
                  showPopup = false
                }
              "
              v-if="showPopup"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <FooterC />
</template>

<style scoped lang="scss">
.comments__leave-form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 50px;
  width: 100%;
  max-width: 400px;
  input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #ffffff;
    padding: 5px 10px;
    background: transparent;
    outline: none;
    color: white;
    font-weight: 500;
    font-size: 16px;
    max-width: 400px;
  }
  input::placeholder {
    color: #b3b3b3;
    font-weight: 500;
    font-size: 16px;
  }
  button {
    width: 100%;
    max-width: 400px;
    padding: 15px 0px;
    background: #F2C94C;
    border-radius: 30px;
    border: none;
    font-weight: 700;
    font-size: 18px;
    color: #000000;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  button:hover {
    background: #4ea884;
  }
  .success {
    font-weight: 500;
    font-size: 16px;
    margin: 0 auto;
    color: #00cb07;
    margin-top: -10px;
  }
}
.comments {
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  .comments__show {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 0px 0px;
    p {
      font-weight: 700;
      font-size: 25px;
      color: #ffffff;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    :nth-child(2) {
      border-radius: 100%;
    }
  }
  .comments__show p:hover {
    color: #569dff;
  }
  .comments__comment {
    padding: 20px 30px;
    border: 1px solid #2e363c;
    border-radius: 30px;
    margin-bottom: 30px;
    margin-top: 20px;
    .comments__comment-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      .comments__comment-header-user {
        display: flex;
        align-items: center;
        gap: 10px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        p {
          font-weight: 700;
          font-size: 16px;
          color: #ffffff;
        }
      }
      .comments__comment-header-rating {
        display: flex;
        align-items: center;
        gap: 10px;
        img {
          width: 15px;
          height: 15px;
        }
        p {
          font-weight: 700;
          font-size: 16px;
          color: #f0c800;
        }
      }
    }
    .comments__comment-text {
      font-weight: 400;
      font-size: 16px;
      color: #ffffff;
    }
  }
}
.courses {
  padding: 30px 0px 0px 150px;
  padding-bottom: 230px;
  display: flex;
  flex-direction: column;
  background: #383535;
  border-radius: 30px;
  margin-bottom: 40px;
}
.unset-padding {
  padding-bottom: 50px;
}
.courses__breadcrumbs {
  display: flex;
  align-items: center;
  gap: 10px;
  p {
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  p:hover {
    color: #F2C94C;
  }
}
.courses__preview {
  display: flex;
  gap: 30px;
  margin-top: 30px;

  .courses__preview-img {
    width: 100%;
    height: 400px;
    max-width: 400px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 30px;
    }
    .courses__preview-info-btns {
      margin-top: 20px;

      .courses__preview-info-btns-buy {
        width: 100%;
        padding: 15px 0px;
        background: #F2C94C;
        border-radius: 30px;
        border: none;
        font-weight: 700;
        font-size: 18px;
        color: #000000;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .courses__preview-info-btns-buy:hover {
        background: #4ea884;
      }
    }
  }
  .courses__preview-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-right: 100px;
    width: 100%;
    .courses__preview-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .price {
        font-weight: 700;
        font-size: 25px;
        color: #1ae200;
      }
    }
    .courses__preview-info-title {
      font-weight: 700;
      font-size: 30px;
      color: #ffffff;
    }
    .courses__preview-info-desc {
      font-weight: 400;
      font-size: 18px;
      color: #ffffff;
      max-width: 867px;
    }
  }
  .author {
    font-weight: 400;
    font-size: 14px;
    color: #c9c9c9;
    span {
      font-weight: 700;
      font-size: 14px;
      color: #c9c9c9;
    }
  }
  .language {
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
    span {
      font-weight: 700;
      font-size: 14px;
      color: #fdff87;
    }
  }
  .hours {
    display: flex;
    align-items: center;
    gap: 10px;
    p {
      font-weight: 500;
      font-size: 13px;
      color: #cbcbcb;
    }
  }
  .rating {
    display: flex;
    align-items: center;
    gap: 10px;
    img {
      width: 15px;
      height: 15px;
    }
    p {
      font-weight: 700;
      font-size: 16px;
      color: #f0c800;
    }
  }
}
.content {
  padding: 0px 150px 0px 150px;
  padding-bottom: 200px;
  .content__learn {
    padding: 25px;
    border: 1px solid #2e363c;
    border-radius: 30px;
    .content__learn-title {
      font-weight: 700;
      font-size: 26px;
      color: #F2C94C;
    }
    .content__learn-list {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      gap: 8px;
    }
    .content__learn-list-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  .content__title {
    font-weight: 700;
    font-size: 26px;
    color: #F2C94C;
    margin-top: 40px;
    margin-bottom: 20px;
  }
}
.content__section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: #131313;
  border: #2e363c 1px solid;
  :nth-child(1) {
    font-weight: 700;
    font-size: 16px;
    color: #ffffff;
  }
}
.content__section-videos {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 15px 30px;
  background: #000000;
  border: #2e363c 1px solid;
  .content__section-videos-name {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 0px 20px;
    cursor: pointer;
    p {
      font-weight: 500;
      font-size: 14px;
      text-decoration: underline;
      color: #F2C94C;
      text-underline-offset: 5px;
      transition: all 0.3s ease;
    }
  }
  .content__section-videos-name:hover p {
    color: #ffffff;
  }
  .content__section-videos-duration {
    color: #9a9a9a;
    font-weight: 500;
    font-size: 14px;
  }
}
.buy-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 25px;
  .form-inputs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    .buy-form__num,
    .buy-form__date,
    .buy-form__cvv {
      width: 100%;
      border: none;
      border-bottom: 1px solid #ffffff;
      padding: 5px 10px;
      background: transparent;
      outline: none;
      margin: 0 auto;
      color: white;
      font-weight: 500;
      font-size: 16px;
    }
    .buy-form__date {
      width: 70%;
    }
    .buy-form__cvv {
      width: 30%;
    }
    input::placeholder {
      color: #b3b3b3;
      font-weight: 500;
      font-size: 16px;
    }
    img {
      width: 130px;
    }
    .owner {
      text-transform: uppercase;
    }
    .owner::placeholder {
      text-transform: none;
    }
  }
  .success_buy {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 16px;
    color: #00cb07;
  }
}
</style>
