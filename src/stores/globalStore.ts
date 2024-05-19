import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getDocs, addDoc, deleteDoc, collection, doc, getFirestore } from 'firebase/firestore'
import { firebaseConfig } from '@/plugins/firebase'

interface Course {
  id?: number | string,
  title?: string,
  description?: string,
  price?: number,
  author?: string,
  image?: string,
  rating?: number,
  totalHours?: number,
  lecturesQuantity?: number,
  courseLanguage?: string,
  content?: Content[]
  reviews?: Review[]
}

interface Content {
  title: string,
  content: ContentData[]
}

interface ContentData {
  title: string,
  duration: string,
  videoUrl: string
}

interface Review {
  id: number,
  name: string,
  rating: number,
  comment: string
}

export const useGlobalStore = defineStore('global', () => {
  const isLoading = ref<boolean>(false)
  const loader = ref<boolean>(false)
  const splashLoading = ref<boolean>(true)
  const isAuth = ref<boolean>(localStorage.getItem('isAuth') === 'true' || false)
  const isAdmin = ref<boolean>(localStorage.getItem('isAdmin') === 'true' || false)
  const fullName = ref<string>(localStorage.getItem('fullName') || '')
  const dateOfBirth = ref<string>(localStorage.getItem('dateOfBirth') || '')
  const email = ref<string>(localStorage.getItem('email') || '')
  const myCourses = ref<string[] | number[]>([])
  const videoPopup = ref<boolean>(false)
  const coursesList = ref<Course[]>([])
  const teachersList = ref<any>([])

  const db = getFirestore(firebaseConfig);
  const getCourses = async () => {
    coursesList.value = []
    isLoading.value = true
    const querySnapshot = await getDocs(collection(db, "courses"));
    querySnapshot.forEach((doc) => {
      coursesList.value.push({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        price: doc.data().price,
        author: doc.data().teacherName,
        image: doc.data().imageUrl,
        rating: doc.data().rating,
        totalHours: doc.data().totalHours,
        lecturesQuantity: doc.data().lecturesQuantity,
        courseLanguage: doc.data().courseLanguage,
      })
    });
    isLoading.value = false
    console.log(coursesList.value)
  }


  return {
    isLoading,
    loader,
    splashLoading,
    isAuth,
    isAdmin,
    fullName,
    dateOfBirth,
    email,
    myCourses,
    videoPopup,
    coursesList,
    teachersList,
    getCourses
  }
})
