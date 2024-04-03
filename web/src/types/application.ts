export interface ApplicationList {
  appid: string
  name: string
  description: string
  status: number
  createTime: number
  approve: number
}

export interface ApplicationInfo {
  appid: string
  name: string
  description: string
  secret: string
  status: number
  owner: string
  redirect: string
  approve: number
  createTime: number
}
