<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { reactive } from 'vue'

const router = useRouter()

const admin = ref(true)

if (localStorage.getItem('user') === 'TEACHER') {
  admin.value = false
}

const activeAdminNav = ref(0)
const activeTeacherNav = ref(0)
const successCreated = ref(false)

const fullName = ref('')
const dateOfBirth = ref('')
const email = ref('')
const password = ref('')

const caterogyName = ref('')

const caterogyId = ref('')
const tagName = ref('')

const createTeacher = () => {
  axios
    .post(
      'http://localhost:8080/api/admin/teacher/create',
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
    .then(
      (response) => {
        console.log(response)
        successCreated.value = true
        setTimeout(() => {
          successCreated.value = false
          fullName.value = ''
          dateOfBirth.value = ''
          email.value = ''
          password.value = ''
          window.scrollTo(0, 0)
        }, 3000)
      },
      (error) => {
        console.log(error)
      }
    )
}

const onDateInput = (event: any) => {
  const cleanedInput = event.target.value.replace(/\D/g, '')
  if (cleanedInput.length <= 2) {
    dateOfBirth.value = cleanedInput
  } else if (cleanedInput.length <= 4) {
    dateOfBirth.value = cleanedInput.slice(0, 2) + '/' + cleanedInput.slice(2)
  } else {
    dateOfBirth.value =
      cleanedInput.slice(0, 2) + '/' + cleanedInput.slice(2, 4) + '/' + cleanedInput.slice(4, 8)
  }
}

const createCategory = () => {
  axios
    .post(
      'http://localhost:8080/api/admin/category/create',
      {
        name: caterogyName.value
      },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
    .then(
      (response) => {
        console.log(response)
        successCreated.value = true
        setTimeout(() => {
          successCreated.value = false
          caterogyName.value = ''
        }, 3000)
      },
      (error) => {
        console.log(error)
      }
    )
}

const createTag = () => {
  axios
    .post(
      'http://localhost:8080/api/admin/category/tag/create',
      {
        name: tagName.value,
        categoryId: caterogyId.value
      },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
    .then(
      (response) => {
        console.log(response)
        successCreated.value = true
        setTimeout(() => {
          successCreated.value = false
          caterogyId.value = ''
          tagName.value = ''
        }, 3000)
      },
      (error) => {
        console.log(error)
      }
    )
}

const doLogout = () => {
  localStorage.clear()
  router.push('/')
}

const allTeachers = ref()

const getAllTeachers = () => {
  activeAdminNav.value = 1
  axios
    .get('http://localhost:8080/api/admin/teacher/all', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(
      (response) => {
        allTeachers.value = response.data?.content
        console.log(allTeachers.value)
      },
      (error) => {
        console.log(error)
      }
    )
}

const deleteCourseId = ref()
const errorRequest = ref(false)

const deleteCourse = () => {
  axios
    .delete(`http://localhost:8080/api/teacher/course/${deleteCourseId.value}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(
      (response) => {
        console.log(response)
        successCreated.value = true
        setTimeout(() => {
          successCreated.value = false
          deleteCourseId.value = ''
        }, 3000)
      },
      (error) => {
        console.log(error)
        errorRequest.value = true
        setTimeout(() => {
          errorRequest.value = false
          deleteCourseId.value = ''
        }, 3000)
      }
    )
}

interface Course {
  image?: File
  model: {
    title: string
    description: string
    price: number
    language: string
    totalHours: number
    categoryId: number
    objectiveDtos: {
      title: string
    }[]
    sectionDtos: {
      title: string
      moduleDtos: {
        title: string
        videoLink: string
        duration: number
      }[]
    }[]
  }
}

const course = ref<Course>({
  image: undefined,
  model: {
    title: '',
    description: '',
    price: 0,
    language: '',
    totalHours: 0,
    categoryId: 0,
    objectiveDtos: [
      {
        title: ''
      }
    ],
    sectionDtos: [
      {
        title: '',
        moduleDtos: [
          {
            title: '',
            videoLink: '',
            duration: 0
          }
        ]
      }
    ]
  }
})

const categories = ref([
  // Your category options here
])

const addSection = () => {
  course.value.model.sectionDtos.push({
    title: '',
    moduleDtos: [
      {
        title: '',
        videoLink: '',
        duration: 0
      }
    ]
  })
}

const deleteSection = (index: number) => {
  course.value.model.sectionDtos.splice(index, 1)
}

const addModule = (sectionIndex: number) => {
  course.value.model.sectionDtos[sectionIndex].moduleDtos.push({
    title: '',
    videoLink: '',
    duration: 0
  })
}

const deleteModule = (sectionIndex: number, moduleIndex: number) => {
  course.value.model.sectionDtos[sectionIndex].moduleDtos.splice(moduleIndex, 1)
}

const objectiveDtos = ref([
  {
    title: 'Web development'
  },
  {
    title: 'Frontend development'
  }
])

const submitForm = () => {
  window.scrollTo(0, 0)
  const mainFormData = new FormData()

  // Create the formData object
  const formData = new FormData()
  formData.append('title', course.value.model.title)
  formData.append('description', course.value.model.description)
  formData.append('price', course.value.model.price.toString())
  formData.append('language', course.value.model.language)
  formData.append('totalHours', course.value.model.totalHours.toString())
  formData.append('categoryId', course.value.model.categoryId.toString())

  course.value.model.objectiveDtos.forEach((objective, index) => {
    formData.append(`objectiveDtos[${index}].title`, objective.title)
  })

  course.value.model.sectionDtos.forEach((section, sectionIndex) => {
    formData.append(`sectionDtos[${sectionIndex}].title`, section.title)

    section.moduleDtos.forEach((module, moduleIndex) => {
      formData.append(`sectionDtos[${sectionIndex}].moduleDtos[${moduleIndex}].title`, module.title)
      formData.append(
        `sectionDtos[${sectionIndex}].moduleDtos[${moduleIndex}].videoLink`,
        module.videoLink
      )
      formData.append(
        `sectionDtos[${sectionIndex}].moduleDtos[${moduleIndex}].duration`,
        module.duration.toString()
      )
    })
  })

  // Append the formData to the mainFormData
  mainFormData.append('model', formData)

  // Append the image to the mainFormData
  if (course.value.image) {
    mainFormData.append('image', course.value.image)
  }

  axios
    .post('http://localhost:8080/api/teacher/course/create', mainFormData, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(
      (response) => {
        console.log(response)
        successCreated.value = true
        setTimeout(() => {
          successCreated.value = false
          course.value.image = undefined
          course.value.model = {
            title: '',
            description: '',
            price: 0,
            language: '',
            totalHours: 0,
            categoryId: 0,
            sectionDtos: [
              {
                title: '',
                moduleDtos: [
                  {
                    title: '',
                    videoLink: '',
                    duration: 0
                  }
                ]
              }
            ]
          }
          window.scrollTo(0, 0)
        }, 3000)
      },
      (error) => {
        console.log(error)
      }
    )
}
</script>

<template>
  <div class="background">
    <div class="header-out">
      <div class="container">
        <div class="header-in">
          <img src="/img/logo.png" alt="" />
          <div class="header__role" v-if="!admin">
            <img src="/img/teacher.png" alt="" />
            <p>Teacher panel</p>
          </div>
          <div class="header__role" v-else>
            <img src="/img/admin.png" alt="" />
            <p>Admin panel</p>
          </div>
        </div>
      </div>
    </div>
    <div class="container create">
      <div class="create__nav" v-if="admin">
        <button :class="{ active: activeAdminNav === -2 }" @click="activeAdminNav = -2">
          Create course
        </button>
        <button :class="{ active: activeAdminNav === -1 }" @click="activeAdminNav = -1">
          Get all courses
        </button>
        <button :class="{ active: activeAdminNav === 0 }" @click="activeAdminNav = 0">
          Create teacher
        </button>
        <button :class="{ active: activeAdminNav === 1 }" @click="getAllTeachers">
          Get all teachers
        </button>
        <button :class="{ active: activeAdminNav === 2 }" @click="activeAdminNav = 2">
          Create category
        </button>
        <button :class="{ active: activeAdminNav === 3 }" @click="activeAdminNav = 3">
          Get all categories
        </button>
        <!-- <button :class="{ active: activeAdminNav === 3 }" @click="activeAdminNav = 3">
          Create tag
        </button> -->
        <button class="logout" @click="doLogout">Logout</button>
      </div>
      <div class="create__nav" v-else>
        <button :class="{ active: activeTeacherNav === 0 }" @click="activeTeacherNav = 0">
          Create course
        </button>
        <!-- <button :class="{ active: activeTeacherNav === 1 }" @click="activeTeacherNav = 1">
          Update course
        </button> -->
        <button :class="{ active: activeTeacherNav === 2 }" @click="activeTeacherNav = 2">
          Delete course by ID
        </button>
        <button class="logout" @click="doLogout">Logout</button>
      </div>
      <form
        @submit.prevent="createTeacher"
        class="create__create-teacher"
        v-if="activeAdminNav === 0 && admin"
      >
        <input v-model="fullName" type="text" placeholder="Full name" required />
        <input
          v-model="dateOfBirth"
          @input="onDateInput"
          type="text"
          placeholder="Date of birth"
          required
        />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Create</button>
        <p class="success-created" v-if="successCreated">Teacher created</p>
      </form>
      <div class="create__get-teachers" v-if="activeAdminNav === 1 && admin">
        <div class="create__get-teachers__teacher header-teacher">
          <p class="create__get-teachers__teacher__name">ID</p>
          <p class="create__get-teachers__teacher__email">Full name</p>
          <p class="create__get-teachers__teacher__date">Email</p>
          <p class="create__get-teachers__teacher__date">Date of birth</p>
        </div>
        <div class="teachers-table" v-if="allTeachers?.length > 0">
          <div
            class="create__get-teachers__teacher"
            v-for="(teacher, index) in allTeachers"
            :key="index"
          >
            <p class="create__get-teachers__teacher__name">{{ teacher?.id }}</p>
            <p class="create__get-teachers__teacher__email">{{ teacher?.fullName }}</p>
            <p class="create__get-teachers__teacher__date">{{ teacher?.email }}</p>
            <p class="create__get-teachers__teacher__date" v-if="index % 2 === 0">07.10.1999</p>
            <p class="create__get-teachers__teacher__date" v-else>11.05.1997</p>
          </div>
        </div>
        <div v-else>
          <p class="not-exist">List of teachers is empty</p>
        </div>
      </div>
      <form
        @submit.prevent="createCategory"
        class="create__create-teacher"
        v-if="activeAdminNav === 2 && admin"
      >
        <input v-model="caterogyName" type="text" placeholder="Category name" required />
        <button type="submit">Create</button>
        <p class="success-created" v-if="successCreated">Category created</p>
      </form>
      <form
        @submit.prevent="createTag"
        class="create__create-teacher"
        v-if="activeAdminNav === 3 && admin"
      >
        <input v-model="caterogyId" type="text" placeholder="Category ID" required />
        <input v-model="tagName" type="text" placeholder="Tag name" required />
        <button type="submit">Create</button>
        <p class="success-created" v-if="successCreated">Tag created</p>
      </form>
      <!-- <form
        @submit.prevent="createCourse"
        class="create__create-teacher"
        v-if="activeTeacherNav === 0 && !admin"
      >
        <input type="file" placeholder="Course image" required />
        <input v-model="courseTitle" type="text" placeholder="Course name" required />
        <input v-model="courseDescription" type="text" placeholder="Course description" required />
        <input v-model="coursePrice" type="text" placeholder="Course price" required />
        <input v-model="courseLanguage" type="text" placeholder="Course language" required />
        <input v-model="courseHours" type="text" placeholder="Course duration in hours" required />
        <input v-model="courseCategoryId" type="text" placeholder="Course category ID" required />
        <button type="submit">Create</button>
        <p class="success-created" v-if="successCreated">Course created</p>
      </form> -->
      <div class="form-container" v-if="activeTeacherNav === 0 && !admin">
        <form @submit.prevent="submitForm">
          <h2>Create Course</h2>
          <div class="form-group">
            <label for="title">Title</label>
            <input id="title" v-model="course.model.title" type="text" required />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="course.model.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="price">Price</label>
            <input id="price" v-model.number="course.model.price" type="number" required />
          </div>
          <div class="form-group">
            <label for="language">Language</label>
            <select id="language" v-model="course.model.language" required>
              <option value="">--Select Language--</option>
              <option value="EN">English</option>
              <option value="ES">Spanish</option>
              <option value="FR">French</option>
            </select>
          </div>
          <div class="form-group">
            <label for="totalHours">Total Hours</label>
            <input
              id="totalHours"
              v-model.number="course.model.totalHours"
              type="number"
              required
            />
          </div>
          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" v-model.number="course.model.categoryId" required>
              <option value="">--Select Category--</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
              <option value="2">JS2</option>
            </select>
          </div>
          <div class="form-group">
            <label for="image">Image</label>
            <input id="image" ref="image" type="file" accept="image/*" />
          </div>
          <div class="form-group">
            <label>Sections</label>
            <div v-for="(section, index) in course.model.sectionDtos" :key="index" class="section">
              <div class="form-group">
                <label>Section Title</label>
                <input v-model="section.title" type="text" required />
              </div>
              <div class="form-group">
                <label>Modules</label>
                <div
                  v-for="(module, moduleIndex) in section.moduleDtos"
                  :key="moduleIndex"
                  class="module"
                >
                  <div class="form-group">
                    <label>Module Title</label>
                    <input v-model="module.title" type="text" required />
                  </div>
                  <div class="form-group">
                    <label>Video Link</label>
                    <input v-model="module.videoLink" type="text" required />
                  </div>
                  <div class="form-group">
                    <label>Duration</label>
                    <input v-model.number="module.duration" type="number" required />
                  </div>
                  <button
                    type="button"
                    @click="deleteModule(index, moduleIndex)"
                    class="delete-button"
                  >
                    Delete Module
                  </button>
                </div>
                <button type="button" @click="addModule(index)" class="add-button">
                  Add Module
                </button>
              </div>
              <button type="button" @click="deleteSection(index)" class="delete-button">
                Delete Section
              </button>
            </div>
            <button type="button" @click="addSection" class="add-button">Add Section</button>
          </div>
          <button type="submit" class="submit-button">Create Course</button>
        </form>
      </div>

      <form
        @submit.prevent="deleteCourse"
        class="create__create-teacher"
        v-if="activeTeacherNav === 1 && !admin"
      >
        <input v-model="deleteCourseId" type="text" placeholder="Course ID" required />
        <button type="submit">Delete</button>
        <p class="success-created" v-if="successCreated">Course deleted</p>
        <p class="error-text" v-if="errorRequest">Course with this ID does not exist</p>
      </form>
      <form
        @submit.prevent="deleteCourse"
        class="create__create-teacher"
        v-if="activeTeacherNav === 2 && !admin"
      >
        <input v-model="deleteCourseId" type="text" placeholder="Course ID" required />
        <button type="submit">Delete</button>
        <p class="success-created" v-if="successCreated">Course deleted</p>
        <p class="error-text" v-if="errorRequest">Course with this ID does not exist</p>
      </form>
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
  height: 100%;
}

form {
  width: 400px;
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

.submit-button {
  display: block;
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  background-color: #333;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #222;
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
  height: 100vh;
  width: 100vw;
  background-color: #ffffff;
}
.header-out {
  width: 100%;
  background: #000f65;
}
.header-in {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  padding: 30px 0px;
  gap: 30px;
  .header__role {
    display: flex;
    align-items: center;
    gap: 15px;
    img {
      width: 30px;
      height: 30px;
    }
    p {
      font-weight: 700;
      font-size: 20px;
      color: #fff;
    }
  }
}
.create {
  padding-bottom: 200px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
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
  max-width: 700px;
  .teachers-table {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    width: 100%;
    max-width: 700px;
    // overflow-y: auto;
    // height: 100%;
    // max-height: 300px;
  }
  .create__get-teachers__teacher {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 700px;
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
