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

export const getCreateAuthnInfo = (data: { emailCode: string; name: string }) => {
  return axios.get<
    Response<{
      options: any
    }>
  >(`/user/authenticator?emailCode=${data.emailCode}&name=${data.name}`)
}

export const createAuthn = (data: { options: any; name: string }) => {
  return axios.post<Response>('/user/authenticator', data)
}

export const getAuthnList = () => {
  return axios.get<
    Response<{
      authenticatorList: {
        credentialID: string
        name: string
        createTime: string
      }[]
    }>
  >(`/user/authenticator/all`)
}

export const deleteAuthn = (data: { id: string }) => {
  return axios.delete<Response>('/user/authenticator', { data })
}
