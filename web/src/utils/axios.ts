import axios from 'axios'
import { message, Modal, notification } from 'ant-design-vue'
// import type { AxiosResponse } from 'axios'
import router from '@/router/index'
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

// 捕获全局异常
axios.interceptors.response.use(
  (e) => {
    if (e.data?.status >= 500 && e.data?.status <= 599) {
      notification.error({
        message: '后端服务器发生错误',
        description: `请刷新页面重试，若无法解决，请联系技术人员`
      })
    }
    return e
  },

  async (err) => {
    console.log('异常', err)
    if (err.code === 'ERR_NETWORK') {
      // 网络异常
      const statusResult = await getAppStatus()
      if (!statusResult) {
        Modal.error({
          title: '连接已丢失',
          content: '请确保您已经正确连接互联网'
        })
      }
      if (statusResult === 'browser') {
        Modal.error({
          title: '无法连接至服务器',
          content: '请确保您的网络环境可以正常与中国大陆服务器进行通信'
        })
      }
      if (statusResult === 'service') {
        Modal.error({
          title: '服务器错误',
          content: '服务器暂时发生故障，请稍后再试，若无法解决，请联系技术人员'
        })
      }
    } else {
      notification.error({
        message: '后端服务器出错',
        description: `请刷新页面重试，若无法解决，请联系技术人员`
      })
    }
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  (config) => {
    // 身份认证失败，跳转登录
    if (config?.data?.status == 401) {
      // 清除已过期的 token
      try {
        localStorage.removeItem('token')
      } catch {
        //
      }
      router.push('/login')
    }

    if (config?.data?.status === 418) {
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
