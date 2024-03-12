import axios, { type Response } from '@/utils/axios'

import type { User } from '@/types/user'

export const getUserInfo = () => axios.get<Response<User>>('/user/info')

export const updateUserInfo = (data: {
  code?: string
  password?: string
  email?: string
  nickname?: string
  code2?: string
  public_email?: string
}) => {
  return axios.put<Response>('/user/info', data)
}

export const getEmailCode = (data: { randstr: string; ticket: string; email?: string }) => {
  return axios.post<Response>('/user/info/getCode', data)
}
