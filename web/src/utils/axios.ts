import axios from 'axios'
// import type { AxiosResponse } from 'axios'
import requestEvent from '@/event/request'
import { getFingerprint } from '@/hook/useUser'
import { useUptimeBot } from '@/hook/useUptimeBot'

const { getAppStatus } = useUptimeBot()

axios.defaults.baseURL = import.meta.env.VITE_HTTP_BASE_URL

// http request 拦截器
axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      // 将token设置成请求头
      // 需要在客户端拼接 Bearer 的前缀
      config.headers.Authorization = 'Bearer ' + token
    }
    if (config.headers) {
      config.headers.fingerprint = await getFingerprint()
    }

    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  (e) => {
    if (e.data?.status >= 500 && e.data?.status <= 599) {
      requestEvent.emit('UnknownError')
    }

    if (e.data?.status == 401) {
      requestEvent.emit('Unauthorized')
    }

    if (e.data?.status === 418) {
      requestEvent.emit('Unauthorized', e.data?.type, e.data?.msg)
    }

    return e
  },
  // 错误状态处理
  async (err) => {
    console.log('request 异常', err)
    if (err.code === 'ERR_NETWORK') {
      // 网络异常
      const statusResult = await getAppStatus()
      requestEvent.emit('NetworkError', statusResult)
    } else {
      requestEvent.emit('UnknownError')
    }
    return Promise.reject(err)
  }
)

export type Response<T = any> = { status: number; msg: string; data: T }

export default axios
