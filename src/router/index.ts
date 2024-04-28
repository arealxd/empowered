import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/courses/:from?',
      name: 'courses',
      component: () => import('../views/CoursesView.vue')
    },
    {
      path: '/my-courses',
      name: 'my-courses',
      component: () => import('../views/MyCoursesView.vue')
    },
    {
      path: '/edit-profile',
      name: 'edit-profile',
      component: () => import('../views/EditProfileView.vue')
    },
    {
      path: '/details/:id/:from?',
      name: 'details',
      component: () => import('../views/DetailsView.vue')
    },
    {
      path: '/panel',
      name: 'panel',
      component: () => import('../views/PanelView.vue')
    }
  ]
})

export default router
