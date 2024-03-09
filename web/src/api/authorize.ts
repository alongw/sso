import axios, { type Response } from '@/utils/axios'

export const getApplicationInfo = (data: { appid: string }) => {
  return axios.post<
    Response<{
      appid: string
      name: string
      description: string
      status: number
      approve: number
      permissionList: {
        name: string
        apppid: number
        defaultCheck: boolean
        lock: boolean
        priority: number
        desc: string
      }[]
      user: {
        email: string
      }
      redirect: string
    }>
  >('/auth/get', data)
}

export const getApplicationCode = (data: {
  appid: string
  permissionList: number[]
  state: string
}) => {
  return axios.post<
    Response<{
      code: string
      exp: number
      state: string
      appid: string
      redirect: string
    }>
  >('/auth/code', data)
}
