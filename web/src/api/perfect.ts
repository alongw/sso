import axios, { type Response } from '@/utils/axios'

export const getNeedPerfect = () =>
  axios.get<
    Response<{
      need: boolean
    }>
  >('/user/perfect')

export const checkUserName = (data: { username: string }) => {
  return axios.post<
    Response<{
      available: boolean
    }>
  >('/user/perfect', data)
}

export const setUserName = (data: { username: string }) => {
  return axios.put<Response>('/user/perfect', data)
}
