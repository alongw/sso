import {
  createAuthn as createAuthnApi,
  deleteAuthn as deleteAuthnApi,
  getAuthnList as getAuthnListApi,
  getCreateAuthnInfo as getCreateAuthnInfoApi,
  getEmailCode as getEmailCodeApi
} from '@/api/user'
import { message } from 'ant-design-vue'
import { ref } from 'vue'
import dayjs from 'dayjs'

import getCaptcha from '@/utils/captcha'

import { startRegistration, browserSupportsWebAuthn } from '@simplewebauthn/browser'

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    customRender: ({ text }: { text: string }) => {
      return dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '操作',
    key: 'action',
    align: 'center'
  }
]

export const useAuthn = () => {
  const authData = ref()
  const getAuthnList = async () => {
    authData.value = undefined
    const { data: result } = await getAuthnListApi()
    if (result.status !== 200) {
      return message.error(result.msg)
    }
    authData.value = result.data.authenticatorList
  }

  const emailBtnLoading = ref(false)
  const getEmailCode = async () => {
    const { randstr, ticket } = await getCaptcha()
    emailBtnLoading.value = true
    const { data: result } = await getEmailCodeApi({
      randstr,
      ticket
    })
    emailBtnLoading.value = false
    if (result.status !== 200) {
      return message.error(result.msg)
    }
    message.success('验证码已发送')
  }

  const createName = ref('')
  const createMailCode = ref('')
  const createBtnLoading = ref(false)
  const open = ref(false)

  const handleCreateAuthn = async () => {
    // 检测是否支持 WebAuthn
    if (!browserSupportsWebAuthn()) {
      return message.error('当前浏览器不支持 WebAuthn')
    }

    if (!createName.value || !createMailCode.value) {
      return message.error('请正确填写表单')
    }

    if (createName.value.length > 16) {
      return message.error('验证器名称不得超过16个字符')
    }

    // 开始注册 请求创建验证器
    createBtnLoading.value = true
    const { data: result } = await getCreateAuthnInfoApi({
      name: createName.value,
      emailCode: createMailCode.value
    })

    if (result.status !== 200) {
      createBtnLoading.value = false
      return message.error(result.msg)
    }

    const options = result.data.options

    // 读取验证器信息
    let attResp
    try {
      attResp = await startRegistration(options)
    } catch (error: any) {
      createBtnLoading.value = false
      if (error.name === 'InvalidStateError') {
        return message.error('这个验证器已经被注册过了！！')
      } else {
        console.error(`
        读取验证器信息失败：${error.name} - ${error}
        `)
        return message.error('读取验证器失败，具体原因请查看控制台')
      }
    }

    // 提交验证器信息
    const { data: result2 } = await createAuthnApi({
      name: createName.value,
      options: attResp
    })

    if (result2.status !== 200) {
      createBtnLoading.value = false
      return message.error(`创建外部验证器出错：${result2.msg}`)
    }

    message.success('创建成功')
    createBtnLoading.value = false

    createName.value = ''
    createMailCode.value = ''

    await getAuthnList()
    open.value = false
  }

  const deleteAuthn = async (id: string) => {
    const { data: result } = await deleteAuthnApi({
      id: id
    })

    if (result.status !== 200) {
      return message.error(result.msg)
    }

    message.success('删除成功')
    await getAuthnList()
  }

  return {
    authData,
    getAuthnList,
    columns,
    handleCreateAuthn,
    getEmailCode,
    createName,
    createMailCode,
    createBtnLoading,
    emailBtnLoading,
    open,
    deleteAuthn
  }
}
