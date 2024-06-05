<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/globalStore'
import { getFirestore, doc, deleteDoc, setDoc } from "firebase/firestore";
import AModal from '@/components/AModal.vue'
import { useToast } from 'vue-toastification'

const router = useRouter()
const admin = ref(true)
const activeAdminNav = ref(1)
const toast = useToast()
const isModalOpened = ref(false)
const deleteCourseId = ref(0)
const deleteUserId = ref(0)
const isUserModalOpened = ref(false)
const sectionCount = ref(1)
const subSectionCount = ref(1)
const title = ref('')
const description = ref('')
const price = ref()
const language = ref('')
const image = ref('')
const courseMaterial1 = ref('')
const courseMaterial2 = ref('')
const courseMaterial3 = ref('')


interface Section {
  title: string;
  content: SubSection[];
}

interface SubSection {
  title: string;
  videoUrl: string;
  duration: number;
}

const formData = ref({
  multiples: [] as Section[],
})

const addSection = () => {
  formData.value.multiples.push({
    title: '',
    content: [
      {
        title: '',
        videoUrl: '',
        duration: 1,
      },
    ],
  });
};

addSection()

function generateRandomId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0x0f) | 0x40;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

watch(sectionCount, () => {
  formData.value.multiples = []
  const subSectionsArray = ref<SubSection[]>([])
  for (let i = 0; i < subSectionCount.value; i++) {
    subSectionsArray.value.push({
      title: '',
      videoUrl: '',
      duration: 1,
    });
  }
  for (let i = 0; i < sectionCount.value; i++) {
    formData.value.multiples.push({
      title: '',
      content: subSectionsArray.value,
    });
  }
})

watch(subSectionCount, () => {
  formData.value.multiples.forEach((item) => {
    item.content = []
    for (let i = 0; i < subSectionCount.value; i++) {
      item.content.push({
        title: '',
        videoUrl: '',
        duration: 1,
      });
    }
  })
})

const globalStore = useGlobalStore()
globalStore.getCourses()
globalStore.loadUsers()

const openModal = (id: any) => {
  isModalOpened.value = true;
  deleteCourseId.value = id;
};

const openUserModal = (id: any) => {
  isUserModalOpened.value = true;
  deleteUserId.value = id;
};

const closeModal = () => {
  isModalOpened.value = false;
  isUserModalOpened.value = false;
};

const deleteCourse = async () => {
  globalStore.loader = true
  isModalOpened.value = false
  const db = getFirestore();
  const docRef = doc(db, "courses", deleteCourseId.value.toString());
  deleteDoc(docRef)
    .then(() => {
      globalStore.getCourses()
      toast.clear()
      toast.success('Course deleted successfully')
    })
    .catch(() => {
      toast.clear()
      toast.error('Error deleting course')
    }).finally(() => {
      globalStore.loader = false
  })
}

const deleteUser = async () => {
  globalStore.loader = true
  isUserModalOpened.value = false
  fetch(`https://oi-sana.kz/empowered/user/${deleteUserId.value}`, {method: "DELETE"})
    .then(() => {
      toast.clear()
      toast.success('User deleted successfully')
    })
    .catch(() => {
      toast.clear()
      toast.error('Error deleting course')
    }).finally(() => {
      globalStore.loadUsers();
      globalStore.loader = false
  })
}

const doLogout = async () => {
  localStorage.clear()
  globalStore.isAdmin = false
  await router.push('/')
}

if (!globalStore.isAdmin || localStorage.getItem('isAdmin') !== 'true') {
  router.push('/')
}

const getLecturesCount = () => {
  let count = 0
  formData.value.multiples.forEach((section) => {
    count += section.content.length
  })
  return count
}

const getTotalHours = () => {
  let count = 0
  formData.value.multiples.forEach((section) => {
    section.content.forEach((subSection) => {
      count += subSection.duration
    })
  })
  return count
}

const createCourse = async () => {
  globalStore.loader = true
  const db = getFirestore();
  const randomId = generateRandomId()
  const courseMaterialLinks = [courseMaterial1.value, courseMaterial2.value, courseMaterial3.value].filter(Boolean)
  await setDoc(doc(db, "courses", randomId), {
    title: title.value,
    description: description.value,
    id: randomId,
    imageUrl: image.value,
    lecturesQuantity: getLecturesCount(),
    price: price.value,
    teacherName: 'EmpowerEd',
    totalHours: getTotalHours(),
    courseLanguage: language.value,
    lessons: formData.value.multiples,
    courseMaterials: courseMaterialLinks,
  });
  await globalStore.getCourses()
  activeAdminNav.value = -1
  window.scrollTo({ top: 0, behavior: 'smooth' })
  globalStore.loader = false
  toast.clear()
  toast.success('Course created successfully')
}
</script>

<template>
  <div class="background">
    <div class="header-out">
      <div class="container">
        <div class="header-in">
          <img src="/img/logo.png" alt="admin" />
<!--          <div class="header__role">-->
<!--            <img src="/img/admin.png" alt="" />-->
<!--            <p>Admin panel</p>-->
<!--          </div>-->
          <div class="header-in__options">
            <div class="header-in__options--item"
                 :class="{ 'header-in__options--active': activeAdminNav === 1 }"
                 @click="activeAdminNav = 1"
            >
              <img src="/img/show.png" alt="icon">
              <p class="title">Get all courses</p>
            </div>
            <div class="header-in__options--item"
                 :class="{ 'header-in__options--active': activeAdminNav === 2 }"
                 @click="activeAdminNav = 2"
            >
              <img src="/img/create.png" alt="icon">
              <p class="title">Create course</p>
            </div>
            <div class="header-in__options--item"
                 :class="{ 'header-in__options--active': activeAdminNav === 3 }"
                 @click="activeAdminNav = 3"
            >
              <img src="/img/users.png" alt="icon">
              <p class="title">Users</p>
            </div>
            <div class="header-in__options--item"
                 :class="{ 'header-in__options--active': activeAdminNav === 4 }"
                 @click="activeAdminNav = 4"
            >
              <img src="/img/list.png" alt="icon">
              <p class="title">Enrollments</p>
            </div>
            <div class="header-in__options--item"
                 @click="doLogout"
            >
              <img src="/img/logout.png" alt="icon">
              <p class="title">Logout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container create">
      <TransitionGroup>
        <div class="create__get-teachers" v-if="activeAdminNav === 1 && admin">
          <div class="create__get-teachers__teacher header-teacher" style="cursor: default">
            <p class="create__get-teachers__teacher__name">#</p>
            <p class="create__get-teachers__teacher__email">Title</p>
            <p class="create__get-teachers__teacher__date" style="padding-right: 45px">Price</p>
          </div>
          <div v-if="globalStore.coursesList?.length > 0" class="teachers-table">
            <div
              v-for="(course, index) in globalStore.coursesList"
              :key="course.id"
              class="create__get-teachers__teacher list-courses"
            >
              <p class="create__get-teachers__teacher__name" style="max-width: 50px">{{ ++index }}</p>
              <p class="create__get-teachers__teacher__email">{{ course.title }}</p>
              <p class="create__get-teachers__teacher__date" style="white-space: nowrap; display: flex; align-items: center;">
                {{ course.price }} $
                <span>
                  <img @click="openModal(course.id)" src="/img/delete.png" alt="delete" class="delete-course">
                </span>
              </p>
            </div>
          </div>
          <div v-else>
            <p class="not-exist">List of courses is empty</p>
          </div>
        </div>
        <div class="form-container" v-if="activeAdminNav === 2 && admin">
          <form @submit.prevent="createCourse">
            <h2>Create Course</h2>
            <div class="form-group">
              <label for="section">Section quantity</label>
              <input v-model="sectionCount" id="section" type="number" required />
            </div>
            <div class="form-group">
              <label for="subsection">Subsection quantity</label>
              <input v-model="subSectionCount" id="subsection" type="number" required />
            </div>
            <div class="form-group">
              <label for="title">Title</label>
              <input v-model="title" id="title" type="text" required />
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <textarea v-model="description" id="description" required></textarea>
            </div>
            <div class="form-group">
              <label for="price">Price $</label>
              <input v-model="price" id="price" type="number" required />
            </div>
            <div class="form-group">
              <label for="language">Language</label>
              <select v-model="language" id="language" required>
                <option value="">Select language</option>
                <option value="Kazakh">Kazakh</option>
                <option value="Russian">Russian</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Portuguese">Portuguese</option>
              </select>
            </div>
            <div class="form-group">
              <label for="image">Image URL for title</label>
              <input v-model="image" id="image" type="text" required />
            </div>
            <div class="form-group">
              <label for="image">Course material link #1 (optional)</label>
              <input v-model="courseMaterial1" id="image" type="text" />
            </div>
            <div class="form-group">
              <label for="image">Course material link #2 (optional)</label>
              <input v-model="courseMaterial2" id="image" type="text" />
            </div>
            <div class="form-group">
              <label for="image">Course material link #3 (optional)</label>
              <input v-model="courseMaterial3" id="image" type="text" />
            </div>
            <div class="form-group">
              <label>Sections</label>
              <div v-for="(item, index) in formData.multiples" :key="index" class="section">
                <div class="form-group">
                  <label>{{ ++index }}) Section Title</label>
                  <input v-model="item.title" type="text" required />
                </div>
                <div class="form-group">
                  <label>Subsections</label>
                  <div v-for="j in item.content" :key="j" class="module">
                    <div class="form-group">
                      <label>Subsection Title</label>
                      <input v-model="j.title" type="text" required />
                    </div>
                    <div class="form-group">
                      <label>Video Link (embed)</label>
                      <input v-model="j.videoUrl" type="text" required />
                    </div>
                    <div class="form-group">
                      <label>Duration (in hours)</label>
                      <input v-model="j.duration" type="number" required />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" class="submit-button">Create Course</button>
          </form>
        </div>
        <div class="create__get-teachers" v-if="activeAdminNav === 3 && admin">
          <div class="create__get-teachers__teacher header-teacher" style="cursor: default">
            <p class="create__get-teachers__teacher__name" >#</p>
            <p class="create__get-teachers__teacher__name">Email</p>
            <p class="create__get-teachers__teacher__email" style="margin-right: 10px;">Created at</p>
            <p class="create__get-teachers__teacher__date" style="margin-right: 90px;">
              Last login time
            </p>
          </div>
          <div v-if="globalStore.usersList?.length > 0" class="teachers-table">
            <div
              v-for="(user, index) in globalStore.usersList"
              :key="user.id"
              class="create__get-teachers__teacher list-courses"
            >
              <p class="create__get-teachers__teacher__name" style="max-width: 1px">{{ index + 1 }}</p>
              <p class="create__get-teachers__teacher__name" style="max-width: 50px">{{ user?.email }}</p>
              <p class="create__get-teachers__teacher__email">{{ new Date(user?.createdAt).toLocaleDateString("ru-RU") }}</p>
              <p class="create__get-teachers__teacher__date" style="white-space: nowrap; display: flex; align-items: center;">
                {{ new Date(user?.lastSignIn).toLocaleString("ru-RU") }}
                <span>
                <img @click="openUserModal(user.id)" src="/img/delete.png" alt="delete" class="delete-course">
              </span>
              </p>
            </div>
          </div>
          <div v-else>
            <p class="not-exist">List of users is empty</p>
          </div>
        </div>
        <div class="create__get-teachers" v-if="activeAdminNav === 4 && admin">
          <div class="create__get-teachers__teacher header-teacher" style="cursor: default">
            <p class="create__get-teachers__teacher__name" style="margin-left: 23px;">Email</p>
            <p class="create__get-teachers__teacher__email" style="margin-right: 335px;">Courses</p>
          </div>
          <div v-if="globalStore.enrollments && Object.keys(globalStore.enrollments).length > 0" class="teachers-table">
            <div
              v-for="(courses, email) in globalStore.enrollments"
              :key="email"
              class="create__get-teachers__teacher list-courses"
            >
              <p class="create__get-teachers__teacher__name" style="margin-left: 20px;">{{ email }}</p>
              <div
                style="display: flex; flex-direction: column; margin-right: 200px">
                <p v-for="(course, index) in courses"
                    :key="course + '-' + email"
                >{{index + 1 }}. {{ course }}</p>
              </div>
            </div>
          </div>
          <div v-else>
            <p class="not-exist">List of enrollments is empty</p>
          </div>
        </div>
      </TransitionGroup>
      <AModal :isOpen="isModalOpened" @modal-close="closeModal" name="first-modal">
        <template #header>
          <p style="color: #0d0d0d; text-align: center; font-size: 20px">
            Are you sure you want to delete the course?
          </p>
        </template>
        <template #content>
          <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px">
            <button @click="closeModal" style="background: #007bff; color: #ffffff; padding: 10px 30px; border-radius: 30px; font-weight: 700; font-size: 16px; border: none; cursor: pointer; transition: all 0.3s ease;">
              No
            </button>
            <button @click="deleteCourse" style="background: #e70000; color: #ffffff; padding: 10px 30px; border-radius: 30px; font-weight: 700; font-size: 16px; border: none; cursor: pointer; transition: all 0.3s ease;">
              Yes
            </button>
          </div>
        </template>
      </AModal>
      <AModal :isOpen="isUserModalOpened" @modal-close="closeModal" name="first-modal">
        <template #header>
          <p style="color: #0d0d0d; text-align: center; font-size: 20px">
            Are you sure you want to delete the user?
          </p>
        </template>
        <template #content>
          <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px">
            <button @click="closeModal" style="background: #007bff; color: #ffffff; padding: 10px 30px; border-radius: 30px; font-weight: 700; font-size: 16px; border: none; cursor: pointer; transition: all 0.3s ease;">
              No
            </button>
            <button @click="deleteUser" style="background: #e70000; color: #ffffff; padding: 10px 30px; border-radius: 30px; font-weight: 700; font-size: 16px; border: none; cursor: pointer; transition: all 0.3s ease;">
              Yes
            </button>
          </div>
        </template>
      </AModal>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: unset;
}
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
}

form {
  width: 100%;
  padding: 30px;
  background-color: #f2f2f2;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
}

input,
textarea,
select {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;
}

input[type='file'] {
  padding: 6px;
}

select {
  appearance: none;
  background-color: white;
  background-image: url("data:image/svg+xml;utf8,<svg fill='gray' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18'><path d='M7 10l5 5 5-5z' /></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
}

textarea {
  resize: vertical;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #7c7cff;
}

.add-button,
.delete-button {
  display: block;
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background-color: #7c7cff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-button:hover,
.delete-button:hover {
  background-color: #6363ff;
}

.delete-course {
  width: 25px;
  cursor: pointer;
  margin-top: 7px;
  margin-left: 20px;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.2);
  }
}

.submit-button {
  display: block;
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  background-color: #009114;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #008038;
}

.section,
.module {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
}

.delete-button {
  margin-top: 5px;
  background-color: #cc4545;
}

.delete-button:hover {
  background-color: #b63b3b;
}
.not-exist {
  color: #818181;
  font-weight: 700;
  font-size: 25px;
}
.background {
  display: flex;
  height: 100%;
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  margin-bottom: -258px;
}
.header-out {
  width: 100%;
  background: #363636;
  max-width: 300px;
}
.header-in {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 30px 0px;
  gap: 40px;
  &__options {
    display: flex;
    flex-direction: column;
    gap: 16px;
    &--item {
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s ease;
      cursor: pointer;
      img {
        width: 20px;
        height: 20px;
      }
      .title {
        font-weight: 500;
        font-size: 16px;
        color: #dedede;
      }
      &:hover {
        opacity: 0.8;
      }
    }
    &--active {
      border-bottom: 1px solid #dedede;
      padding-bottom: 5px;
    }
  }
  .header__role {
    display: flex;
    align-items: center;
    gap: 15px;
    img {
      width: 24px;
      height: 24px;
    }
    p {
      font-weight: 700;
      font-size: 16px;
      color: #fff;
    }
  }
}
.create {
  width: 100%;
  padding-bottom: 200px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  .create__nav {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 35px;
    button {
      padding: 10px 30px;
      background: #007bff;
      border-radius: 30px;
      font-weight: 700;
      font-size: 16px;
      color: #ffffff;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        background: #005bbc;
      }
    }
    .active {
      background: #1bb600;
      &:hover {
        background: #1bb600;
      }
    }
    .logout {
      padding: 10px 30px;
      background: #e70000;
      border-radius: 30px;
      font-weight: 700;
      font-size: 16px;
      color: #ffffff;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        background: #c50000;
      }
    }
  }
}
.create__create-teacher {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  input {
    width: 300px;
    height: 40px;
    border: 1px solid #c3c0c0;
    border-radius: 30px;
    padding: 0px 20px;
    font-weight: 700;
    font-size: 16px;
    color: #383838;
    outline: none;
    transition: all 0.3s ease;
    &:focus {
      border: 1px solid #007bff;
    }
  }
  button {
    width: 100%;
    max-width: 300px;
    padding: 10px 30px;
    border: none;
    border-radius: 30px;
    background: #007bff;
    font-weight: 700;
    font-size: 16px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      background: #005bbc;
    }
  }
}
.create__get-teachers {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 100%;
  .teachers-table {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    width: 100%;
  }
  .create__get-teachers__teacher {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
    padding: 10px 30px;
    border: 1px solid #c3c0c0;
    border-radius: 10px;
    background: #ffffff;
    font-weight: 700;
    font-size: 16px;
    color: #383838;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      background: #f2f2f2;
    }
    .create__get-teachers__teacher__name {
      font-weight: 700;
      font-size: 16px;
      color: #383838;
    }
    .create__get-teachers__teacher__email {
      font-weight: 400;
      font-size: 16px;
      color: #383838;
    }
    .create__get-teachers__teacher__date {
      font-weight: 400;
      font-size: 16px;
      color: #383838;
    }
  }
  .list-courses {
    &:hover {
      background: #fff;
      cursor: default;
    }
  }
  .header-teacher {
    background: #2a3042;
    border: 1px solid #2a3042;
    .create__get-teachers__teacher__name {
      color: #ffffff;
    }
    .create__get-teachers__teacher__email {
      color: #ffffff;
    }
    .create__get-teachers__teacher__date {
      color: #ffffff;
    }
    &:hover {
      background: #2a3042;
    }
  }
}

.success-created {
  color: #1bb600;
  font-weight: 700;
  font-size: 16px;
  margin-top: -5px;
}
.error-text {
  color: #e70000;
  font-weight: 700;
  font-size: 16px;
  margin-top: -5px;
}
</style>
