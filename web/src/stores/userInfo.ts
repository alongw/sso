import { ref } from 'vue'

import { defineStore } from 'pinia'

import type { User } from '@/types/user'

export const useUserStore = defineStore('userInfo', () => {
  const userInfo = ref<User | undefined>()
  const setUserInfo = (data: User) => {
    userInfo.value = data
  }
  return {
    userInfo,
    setUserInfo
  }
})
