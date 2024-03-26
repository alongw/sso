import getCaptcha from 'nia-captcha'

const appid = import.meta.env.VITE_CAPTCHA_APPID

export default async () => {
  const captcha = await getCaptcha(appid)
  return captcha
}
