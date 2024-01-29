import dayjs from 'dayjs'
import fingerprintjs from '@fingerprintjs/fingerprintjs'

export const isLogin = (): boolean => {
  if (window.localStorage.getItem('token') && window.localStorage.getItem('expire')) {
    const expire = Number(window.localStorage.getItem('expire'))
    if (expire > dayjs().valueOf()) {
      return true
    }
  }
  return false
}

export const getFingerprint = async (): Promise<string> => {
  const fp = await fingerprintjs.load()
  const result = await fp.get()
  return result.visitorId
}
