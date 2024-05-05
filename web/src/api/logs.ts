import axios, { type Response } from '@/utils/axios'

export const getLoginLogs = (data: { max_number?: number }) => {
  return axios.post<
    Response<
      {
        login_id: number
        login_ip: string
        login_time: number
        login_type: string
        login_result: boolean
        login_ua: string
        login_use_captcha: boolean
      }[]
    >
  >('/user/logs/login', data)
}

export const getAuthLogs = (data: { max_number?: number }) => {
  return axios.post<
    Response<
      {
        auth_id: number
        auth_appid: string
        auth_ip: string
        auth_time: number
        auth_exp: number
        auth_ua: string
        auth_use: boolean
        auth_expire: number
      }[]
    >
  >('/user/logs/auth', data)
}
