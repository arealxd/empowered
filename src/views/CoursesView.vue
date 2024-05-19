<script setup lang="ts">
import HeaderC from '@/components/HeaderC.vue'
import FooterC from '@/components/FooterC.vue'
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGlobalStore } from '@/stores/globalStore'

window.scrollTo(0, 0)

const globalStore = useGlobalStore()
const router = useRouter()
const route = useRoute()
const sort = ref()
const rating = ref()
const hours = ref()
const searchResult = ref<any>([])
globalStore.loader = true
setTimeout(() => {
  globalStore.loader = false
}, 1000)

const applyFilter = async () => {
  await globalStore.getCourses()
  if (sort.value) {
    globalStore.coursesList = globalStore.coursesList.sort((a: any, b: any) => {
      if (sort.value === 'ASC') {
        return a.price - b.price
      } else {
        return b.price - a.price
      }
    })
  }
  if (rating.value) {
    globalStore.coursesList = globalStore.coursesList.filter((course: any) => course.rating == rating.value)
  }
  if (hours.value) {
    globalStore.coursesList = globalStore.coursesList.filter((course: any) => {
      if (hours.value === 'ONE_TO_SIX') {
        return course.totalHours >= 1 && course.totalHours <= 6
      } else if (hours.value === 'SIX_TO_TEN') {
        return course.totalHours >= 6 && course.totalHours <= 10
      } else {
        return course.totalHours >= 10
      }
    })
  }
  if (route.query.find) {
    const filteredCourses = globalStore.coursesList.filter((course: any) =>
      course.title.toLowerCase().includes(route.query.find?.toString().toLowerCase())
    );
    searchResult.value = filteredCourses;
    globalStore.coursesList = filteredCourses;
  }
}

const setSearchResult = async () => {
  await globalStore.getCourses()
  if (route.query.find && route.query.find.toString().length > 0) {
    const filteredCourses = globalStore.coursesList.filter((course: any) =>
      course.title.toLowerCase().includes(route.query.find?.toString().toLowerCase())
    );
    searchResult.value = filteredCourses;
    globalStore.coursesList = filteredCourses;
  } else {
    searchResult.value = [];
    await globalStore.getCourses()
  }
}

const querySearch = computed(() => {
  return route.query.find
})

watch(querySearch, () => {
  if (route.query.find) {
    setSearchResult()
  } else {
    globalStore.getCourses()
    router.push('/courses')
  }
}, { immediate: true })


const resetFilter = () => {
  sort.value = undefined
  rating.value = undefined
  hours.value = undefined
  if (route.query.find) {
    router.push('/courses')
  } else {
    globalStore.getCourses()
  }
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<template>
  <HeaderC />
  <div class="container">
    <div class="courses">
      <p class="courses-title">{{ route.query.find ? `Results for «${route.query.find}»` : "All courses"  }}</p>
      <div class="courses__content">
        <div class="courses__filter">
          <div class="courses__filter-title">
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 15.2031H13V13.2031H9V15.2031ZM2 3.20312V5.20312H20V3.20312H2ZM5 10.2031H17V8.20312H5V10.2031Z"
                fill="#E0E1E3"
              />
            </svg>
            <p>Filter</p>
          </div>
          <hr />
          <form @submit.prevent="applyFilter">
            <select class="courses__filter-sort" v-model="sort">
              <option :value="undefined" selected hidden>Sort by</option>
              <option value=DESC>Descending price</option>
              <option value="ASC">Ascending price</option>
            </select>
            <select class="courses__filter-sort" v-model="rating">
              <option :value="undefined" selected hidden>Rating</option>
              <option :value="5">5</option>
              <option :value="4">4</option>
              <option :value="3">3</option>
              <option :value="2">2</option>
              <option :value="1">1</option>
            </select>
            <select class="courses__filter-sort" v-model="hours">
              <option :value="undefined" selected hidden>Duration</option>
              <option value="ONE_TO_SIX">1-6 hours</option>
              <option value="SIX_TO_TEN">6-10 hours</option>
              <option value="MORE_TEN">10+ hours</option>
            </select>
            <button type="submit" class="courses__filter-apply">Apply</button>
            <button type="button" @click="resetFilter" class="courses__filter-apply">Reset</button>
          </form>
        </div>
        <div class="not-found" v-if="route.query.find && searchResult.length === 0">
          <h1>{{ `Oops! We couldn't find any courses matching your search for «${route.query.find}»` }}</h1>
        </div>
        <div class="not-found" v-else-if="!globalStore.coursesList && !globalStore.isLoading">
          <h1>The list of courses is currently empty. Please try again later.</h1>
        </div>
        <div class="not-found" v-else-if="(sort || rating || hours) && globalStore.coursesList?.length === 0">
          <h1>No courses were found based on your filter, try changing or resetting the filter.</h1>
        </div>
        <div class="courses__list" v-else>
          <div
            class="courses__list-course"
            v-for="i in globalStore.coursesList"
            :key="i?.id"
            @click="router.push('/details/' + i.id + '/' + 2)"
          >
            <img :src="i?.image" alt="course" class="course-img" />
            <div class="course__info">
              <div class="course__info-title">
                <p class="course__info-name">{{ i?.title }}</p>
                <p class="course__info-price">{{ i?.price }} $</p>
              </div>
              <p class="course__info-description">{{ i?.description }}</p>
              <p class="course__info-author">{{ i?.author }}</p>
              <div class="course__info-rating" v-if="i?.rating">
                <img src="/img/star.png" alt="" />
                <p>{{ i?.rating }}</p>
              </div>
              <div class="course__info-hours">
                <p>{{ i?.totalHours }} total hours</p>
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
                <p>{{ i?.lecturesQuantity }} lectures</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <FooterC />
</template>

<style scoped lang="scss">
form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
hr {
  border: 1px solid #F2C94C;
  margin: 5px 0;
}
.courses__content {
  display: flex;
  margin-top: 40px;
  gap: 40px;
}
.courses__filter {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 250px;
  select {
    cursor: pointer;
  }
  .courses__filter-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 0px;
    border: 1px solid #F2C94C;
    width: 100%;
    svg {
      filter: brightness(0) saturate(100%) invert(33%) sepia(0%) saturate(753%) hue-rotate(151deg) brightness(100%) contrast(85%);
    }
    p {
      font-weight: 700;
      font-size: 20px;
      color: #5b5b5b;
    }
  }
  .courses__filter-sort {
    padding: 10px 15px;
    border: 1px solid #ffffff;
    width: 100%;
    background: #1a1a1a;
    color: #e0e1e3;
    font-weight: 500;
    font-size: 14px;
    outline: none;
    border-radius: 10px;
    option {
      background: #934f00;
      color: #e0e1e3;
      font-weight: 500;
      font-size: 14px;
    }
  }
  .courses__filter-apply {
    padding: 10px 20px;
    border: 1px solid #F2C94C;
    width: 100%;
    background: #1a1a1a;
    color: #F2C94C;
    font-weight: 600;
    font-size: 14px;
    outline: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .courses__filter-apply:hover {
    background: #F2C94C;
    color: #1a1a1a;
  }
}
.courses {
  padding: 20px 0 100px 0;
  display: flex;
  flex-direction: column;
  .courses-title {
    font-weight: 700;
    font-size: 35px;
    color: #030303;
  }
}
.courses__list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;

  .courses__list-course {
    cursor: pointer;
    display: flex;
    gap: 15px;
    transition: all 0.3s ease;
    &:hover {
      transform: scale(1.03);
    }
    .course-img {
      width: 260px;
      height: 170px;
      border-radius: 10px;
      border: 1px solid #F2C94C;
    }
    .course__info {
      display: flex;
      flex-direction: column;
      gap: 5px;
      width: 100%;
      .course__info-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .course__info-name {
        font-weight: 700;
        font-size: 20px;
        color: #000;
      }
      .course__info-description {
        font-weight: 400;
        font-size: 16px;
        color: #5b5b5b;
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
      .course__info-price {
        font-weight: 700;
        font-size: 18px;
        color: #F2C94C;
      }
    }
  }
}

.not-found {
  display: flex;
  width: 100%;
  justify-content: center;
  h1 {
    color: #696969;
    text-align: center;
    width: 70%;
  }
}
</style>
