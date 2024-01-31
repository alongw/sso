import axios, { type Response } from '@/utils/axios'

export const getUserInfo = () =>
  axios.get<
    Response<{
      uid: string
      username: string
      email: string
      avatar: string
      status: number
      nickname: string
      group: string
      createTime: string
      password: boolean
    }>
  >('/user/info')
