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

export const updateUserInfo = (data: {
  code?: string
  password?: string
  email?: string
  nickname?: string
  code2?: string
}) => {
  return axios.put<Response>('/user/info', data)
}

export const getEmailCode = (data: { randstr: string; ticket: string; email?: string }) => {
  return axios.post<Response>('/user/info/getCode', data)
}
