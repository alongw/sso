import { ref } from 'vue'

import { message } from 'ant-design-vue'

import { getUserInfo as getUserInfoApi } from '@/api/user'

interface UserInfoType {
  uid: string
  username: string
  email: string
  avatar: string
  status: number
  nickname: string
  group: string
  createTime: string
  password: boolean
}

export const useConsoleHome = () => {
  // 获取用户信息
  const userInfo = ref<UserInfoType | undefined>()

  const getUserInfo = async () => {
    const { data: result } = await getUserInfoApi()
    if (result.status !== 200) {
      message.error(result.msg)
      return false
    }
    return result
  }

  return {
    userInfo,
    getUserInfo
  }
}
