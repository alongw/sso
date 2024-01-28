import axios from 'axios'
import { message } from 'ant-design-vue'
// import type { AxiosResponse } from 'axios'
import router from '@/router/index'

axios.defaults.baseURL = import.meta.env.VITE_HTTP_BASE_URL

// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      // 将token设置成请求头
      // 需要在客户端拼接 Bearer 的前缀
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  (config) => {
    // 身份认证失败，跳转登录
    if (config.data.status == 401) {
      // 清除已过期的 token
      try {
        localStorage.removeItem('token')
      } catch {
        //
      }
      router.push('/login')
    }

    if (config.data.status === 418) {
      if (config?.data?.type == 'success') message.success(config.data.msg)
      if (config?.data?.type == 'error') message.error(config.data.msg)
      if (config?.data?.type == 'warn') message.warn(config.data.msg)
    }

    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

export type Response<T = any> = { status: number; msg: string; data: T }

export default axios
