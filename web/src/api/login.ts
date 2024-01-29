import axios, { type Response } from '@/utils/axios'

enum AuthenticationType {
  Email = 'email',
  Password = 'password',
  Null = ''
}

export const getAccountStatus = (data: {
  email: string
  captcha?: {
    randstr: string
    ticket: string
  }
}) => {
  return axios.post<
    Response<{
      captcha?: boolean
      isRegister?: boolean
      authenticationType?: AuthenticationType.Email | AuthenticationType.Password
      tips?: string
      username?: string
      avatar?: string
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
  type: 'mail' | 'password'
  userinput: string
  codeinput: string
  captcha?: {
    randstr: string
    ticket: string
  }
  keep?: boolean
}) => {
  return axios.post<
    Response<{
      token: string
      expire: number
    }>
  >('/user/login', data)
}
