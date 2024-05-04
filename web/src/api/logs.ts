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
