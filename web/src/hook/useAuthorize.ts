import { ref } from 'vue'
import { Modal, message } from 'ant-design-vue'

import { type LocationQuery } from 'vue-router'

import {
  getApplicationCode as getApplicationCodeApi,
  getApplicationInfo as getApplicationInfoApi
} from '@/api/authorize'

import { IdcardFilled } from '@ant-design/icons-vue'

export const permissionIcon: {
  [key: number]: any
} = {
  1: IdcardFilled
}

export enum Approve {
  'default' = 0,
  'agree' = 5,
  'master' = 10
}

export const useAuthorize = (query: LocationQuery) => {
  if (!query?.client_id) {
    Modal.error({
      title: '笨蛋！',
      content: '你还没有提供 client_id ！！',
      onOk: () => {
        window.location.reload()
      }
    })
  }

  const loading = ref(true)
  const userEmail = ref('')
  const appName = ref('')
  const approve = ref<Approve>()
  const permissionList = ref<
    {
      name: string
      apppid: number
      defaultCheck: boolean
      lock: boolean
      priority: number
    }[]
  >([])

  const redirect = ref('')

  const getApplicationInfo = async () => {
    const { data: result } = await getApplicationInfoApi({
      appid: query.client_id?.toString() || ''
    })
    if (result.status !== 200) {
      return Modal.error({
        title: '笨蛋！',
        content: result.msg + ' ！！！',
        onOk: () => {
          window.location.reload()
        }
      })
    }
    userEmail.value = result.data.user.email
    appName.value = result.data.name
    approve.value = result.data.approve
    permissionList.value = result.data.permissionList
    redirect.value = result.data.redirect

    loading.value = false
  }

  const agree = async (userPermission: Record<number, boolean>) => {
    loading.value = true
    // 将 userPermission 值为 true 的 key 转换为数组
    const permissionList = Object.keys(userPermission).filter((key) => userPermission[Number(key)])
    // 发送请求
    const { data: result } = await getApplicationCodeApi({
      appid: query.client_id?.toString() || '',
      permissionList: permissionList.map(Number),
      state: query.state?.toString() || ''
    })
    loading.value = false
    if (result.status !== 200) {
      return message.error(result.msg)
    }
    window.location.href = `${result.data.redirect}?code=${result.data.code}&state=${result.data.state}`
  }

  const deny = () => {
    window.location.href = `${redirect.value}?code=deny&state=${query.state}`
  }

  return {
    getApplicationInfo,
    agree,
    deny,
    userEmail,
    appName,
    approve,
    permissionList,
    permissionIcon,
    loading
  }
}
