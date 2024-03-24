import axios, { type Response } from '@/utils/axios'

import type { ApplicationList } from '@/types/application'

export const getAppList = () => {
  return axios.get<
    Response<{
      applicationList: ApplicationList[]
    }>
  >('/application/all')
}

export const getAppInfo = (data: { appid: string }) => {
  return axios.get<
    Response<{
      appid: string
      name: string
      description: string
      secret: string
      status: number
      owner: string
      redirect: string
      approve: number
      createTime: number
    }>
  >(`/application?appid=${data.appid}`)
}

export const refreshSecret = (data: { appid: string }) => {
  return axios.put<Response>('/application/refreshSecret', data)
}

export const createApp = (data: { name: string; ticket: string; randstr: string }) => {
  return axios.post<Response>('/application', data)
}

export const deleteApp = (data: { appid: string }) => {
  return axios.delete<Response>('/application', { data: data })
}

export const removeReview = (data: { appid: string }) => {
  return axios.post<Response>('/application/removeReview', data)
}

export const updateApp = (data: {
  appid: string
  name?: string
  description?: string
  redirect?: string
}) => {
  return axios.put<Response>('/application', data)
}

export const getAllPermission = (data: { appid: string }) => {
  return axios.get<
    Response<{
      permissionList: {
        apppid: number
        name: string
        description: string
        typeRequire: number
        priority: number
      }[]
    }>
  >(`/application/permission?appid=${data.appid}`)
}

export const getUsePermission = (data: { appid: string }) => {
  return axios.get<
    Response<{
      usePermissionList: {
        apppid: number
        name: string
        description: string
        typeRequire: number
        priority: number
      }[]
    }>
  >(`/application/permission/using?appid=${data.appid}`)
}

export const addPermission = (data: { appid: string; apppid: number[] }) => {
  return axios.post<Response>('/application/permission', data)
}

export const deletePermission = (data: { appid: string; apppid: number[] }) => {
  return axios.delete<Response>('/application/permission', { data: data })
}
