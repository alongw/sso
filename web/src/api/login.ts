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
    }>
  >('/user/getAccountStatus', data)
}
