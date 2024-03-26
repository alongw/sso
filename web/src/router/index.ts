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
    },
    {
      path: '/console',
      name: 'Console',
      component: () => import('@/page/Console/Console.vue'),
      children: [
        {
          path: '/console',
          name: 'ConsoleHome',
          component: () => import('@/page/Console/Home.vue')
        },

        // 个人信息相关
        {
          path: '/console/info',
          name: 'ConsoleInfo',
          component: () => import('@/page/Console/Info.vue')
        },
        {
          path: '/console/secrecy',
          name: 'ConsoleSecrecy',
          component: () => import('@/page/Console/Secrecy.vue')
        },
        {
          path: '/console/show',
          name: 'ConsoleShow',
          component: () => import('@/page/Console/Show.vue')
        },

        // 编辑个人信息
        {
          path: '/console/edit/username',
          name: 'ConsoleEditUsername',
          component: () => import('@/page/Console/Edit/Username.vue')
        },
        {
          path: '/console/edit/avatar',
          name: 'ConsoleEditAvatar',
          component: () => import('@/page/Console/Edit/Avatar.vue')
        },
        {
          path: '/console/edit/password',
          name: 'ConsoleEditPassword',
          component: () => import('@/page/Console/Edit/Password.vue')
        },
        {
          path: '/console/edit/email',
          name: 'ConsoleEditEmail',
          component: () => import('@/page/Console/Edit/Email.vue')
        },

        // 应用程序相关
        {
          path: '/console/application',
          name: 'ConsoleApplication',
          component: () => import('@/page/Console/Application/Application.vue')
        },
        {
          path: '/console/application/:appid',
          name: 'ConsoleApplicationManagement',
          component: () => import('@/page/Console/Application/Management.vue')
        },
        // {
        //   path: '/console/edit/email',
        //   name: 'ConsoleEditEmail',
        //   component: () => import('@/page/Console/Edit/Email.vue')
        // },
        // 404
        {
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          component: () => import('@/page/Console/Home.vue')
        }
      ]
    }
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'NotFound',
    //   component: () => import()
    // }
  ]
})

export default router
