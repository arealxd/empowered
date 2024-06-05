import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getDocs, collection, getFirestore } from 'firebase/firestore'
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
  lessons?: Content[],
  reviews?: Review[],
  buyedUsers?: string[],
  courseMaterials?: string[]
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
  const usersList = ref<any>([]);
  const enrollments = ref<any>({});

  const db = getFirestore(firebaseConfig);
  const getCourses = async () => {
    coursesList.value = []
    isLoading.value = true
    const querySnapshot = await getDocs(collection(db, "courses"));
    const enrollmentsTemp: Record<string, any> = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      if (data.buyed_users){
        data.buyed_users.forEach((email: string) => {
           if (!enrollmentsTemp[email]) enrollmentsTemp[email] = [];
           enrollmentsTemp[email].push(data.title)
        });
      }

      coursesList.value.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        price: data.price,
        author: data.teacherName,
        image: data.imageUrl,
        rating: data.rating,
        totalHours: data.totalHours,
        lecturesQuantity: data.lecturesQuantity,
        courseLanguage: data.courseLanguage,
        lessons: data.lessons,
        reviews: data.reviews,
        buyedUsers: data.buyed_users,
        courseMaterials: data.courseMaterials
      })
    });

    enrollments.value = enrollmentsTemp;
    
    isLoading.value = false
  }

  const loadUsers = async () => {
    isLoading.value = true
    await fetch('https://oi-sana.kz/empowered/user')
      .then(data => data.json())
      .then(data => {
        if (Array.isArray(data)) {
          usersList.value = data;
        }
      }).finally(() => {
        isLoading.value = false
      });
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
    getCourses,
    loadUsers,
    usersList,
    enrollments
  }
})
