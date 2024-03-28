import axios, { type Response } from '@/utils/axios'
import type { AuthenticationType } from '@/hook/useLogin'

export const getAccountStatus = (data: {
  email: string
  captcha?: {
    randstr: string
    ticket: string
  }
  notUseAuthn?: boolean
}) => {
  return axios.post<
    Response<{
      captcha?: boolean
      isRegister?: boolean
      authenticationType?:
        | AuthenticationType.Email
        | AuthenticationType.Password
        | AuthenticationType.Authn
      tips?: string
      username?: string
      avatar?: string
      options?: any
    }>
  >('/user/getAccountStatus', data)
}

export const register = (data: {
  email: string
  captcha: {
    randstr: string
    ticket: string
  }
  code: string
}) => {
  return axios.post<
    Response<{
      token: string
      expire: number
    }>
  >('/user/register', data)
}

export const login = (data: {
  type: 'mail' | 'password' | 'authenticator'
  userinput: string
  codeinput: string
  captcha?: {
    randstr: string
    ticket: string
  }
  keep?: boolean
  authn?: any
}) => {
  return axios.post<
    Response<{
      token: string
      expire: number
    }>
  >('/user/login', data)
}
