import { ref } from 'vue'

import { message } from 'ant-design-vue'

import {
  getUserInfo as getUserInfoApi,
  getEmailCode as getEmailCodeApi,
  updateUserInfo as updateUserInfoApi
} from '@/api/user'

import type { User } from '@/types/user'

export const useEditEmail = () => {
  const userInfo = ref<User>()

  const getUserInfo = async () => {
    const { data: result } = await getUserInfoApi()
    if (result.status !== 200) {
      message.error(result.msg)
      return
    }
    userInfo.value = result.data
  }

  const getEmailCode = async (data: { randstr: string; ticket: string; email?: string }) => {
    const { data: result } = await getEmailCodeApi(data)
    if (result.status !== 200) {
      message.error(result.msg)
      return
    }
    message.success('验证码发送成功')
  }

  const updateUserInfo = async (data: {
    code?: string | undefined
    email?: string | undefined
    code2?: string | undefined
    public_email?: string | undefined
  }) => {
    const { data: result } = await updateUserInfoApi(data)
    if (result.status !== 200) {
      return message.error('修改失败：' + result.msg)
    }
    message.success('修改成功')
    publicStep.value++
  }

  const publicStep = ref(0)

  const accountStep = ref(0)

  const publicCodeButtonLoading = ref(false)
  const publicSubmitButtonLoading = ref(false)
  const accountCodeButtonLoading = ref(false)
  const accountSubmitButtonLoading = ref(false)

  const publicForm = ref<{
    email: string
    code: string
  }>({
    email: '',
    code: ''
  })

  const accountForm = ref<{
    email: string
    code: string
    code2: string
  }>({
    email: '',
    code: '',
    code2: ''
  })

  return {
    getUserInfo,
    getEmailCode,
    updateUserInfo,
    userInfo,
    publicStep,
    publicForm,
    publicCodeButtonLoading,
    publicSubmitButtonLoading,

    accountStep,
    accountCodeButtonLoading,
    accountSubmitButtonLoading,
    accountForm
  }
}
