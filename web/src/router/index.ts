import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/page/Home/Home.vue')
    },
    {
      path: '/help',
      name: 'Help',
      component: () => import('@/page/Help/Help.vue')
    },
    {
      path: '/solution',
      name: 'Solution',
      component: () => import('@/page/Solution/Solution.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/page/Login/Login.vue')
    },
    {
      path: '/loginout',
      name: 'Loginout',
      component: () => import('@/page/Loginout/Loginout.vue')
    },
    {
      path: '/authorize',
      name: 'Authorize',
      component: () => import('@/page/Authorize/Authorize.vue')
    },
    {
      path: '/user/perfect',
      name: 'Perfect',
      component: () => import('@/page/Perfect/Perfect.vue')
    },
    {
      path: '/user',
      name: 'User',
      component: () => import('@/page/User/User.vue')
    }
  ]
})

export default router
