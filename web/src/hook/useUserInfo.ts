import { ref } from 'vue'
import { message } from 'ant-design-vue'
import validator from 'validator'
import getCaptacha from 'nia-captcha'
import { getEmailCode as getEmailCodeApi, updateUserInfo } from '@/api/user'

export const useUserInfo = () => {
  const open = ref(false)

  const getEmailCode1 = ref(false)
  const getEmailCode2 = ref(false)

  const getEmailCode = async (type: 1 | 2, email?: string) => {
    if (type === 2 && !validator.isEmail(email || '')) {
      message.error('请正确填写邮箱')
      return false
    }
    const captcha = await getCaptacha('2046626881')
    if (type === 1) {
      getEmailCode1.value = true
    } else {
      getEmailCode2.value = true
    }

    const { data: result } = await getEmailCodeApi({
      randstr: captcha.randstr,
      ticket: captcha.ticket,
      email
    })

    getEmailCode1.value = false
    getEmailCode2.value = false

    if (result.status !== 200) {
      message.error(result.msg)
      return false
    }
    message.success('验证码发送成功')
  }

  const editNickname = async (nickname: string) => {
    if (!nickname) {
      message.error('昵称不能为空')
      return false
    }
    const { data: result } = await updateUserInfo({
      nickname: nickname
    })
    if (result.status !== 200) {
      message.error(result.msg)
      return false
    }
    message.success('修改成功')
    return true
  }

  const editEmail = async (email: string, code: string, code2: string) => {
    if (!email || !code || !code2) {
      message.error('请正确填写表单')
      return false
    }
    if (!validator.isEmail(email)) {
      message.error('邮箱格式错误')
      return false
    }

    const { data: result } = await updateUserInfo({
      email,
      code,
      code2
    })

    if (result.status !== 200) {
      message.error(result.msg)
      return false
    }
    message.success('修改成功')
    return true
  }

  const editPassword = async (password: string, password2: string, code: string) => {
    if (!password || !password2 || !code) {
      message.error('请正确填写表单')
      return false
    }
    if (password !== password2) {
      message.error('密码不一致')
      return false
    }
    if (!validator.isByteLength(password, { min: 6, max: 30 })) {
      message.error('密码需要在 6 到 30 个字符之间')
      return false
    }
    const { data: result } = await updateUserInfo({
      password,
      code
    })
    if (result.status !== 200) {
      message.error(result.msg)
      return false
    }
    message.success('修改成功')
    return true
  }

  return {
    open,
    editNickname,
    getEmailCode,
    editEmail,
    editPassword,
    getEmailCode1,
    getEmailCode2
  }
}
