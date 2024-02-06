import { ref } from 'vue'
import {
  getAppList as getAppListApi,
  getAppInfo as getAppInfoApi,
  updateApp as updateAppApi,
  refreshSecret as refreshSecretApi,
  deleteApp as deleteAppApi
} from '@/api/application'
import { message, Modal } from 'ant-design-vue'

export const getAppList = async () => {
  const { data: result } = await getAppListApi()
  if (result.status !== 200) {
    return message.error(result.msg)
  }
  return result.data.applicationList
}

export type StatusType = '-1' | '0' | '1' | '-114514'

export const open = ref(false)

export const onClose = () => {
  open.value = false
}

export const onOpen = () => {
  open.value = true
}

export const status = {
  '-114514': {
    text: '未知',
    color: 'gray'
  },
  '-1': {
    text: '已删除',
    color: 'purple'
  },
  0: {
    text: '待审核',
    color: 'orange'
  },
  1: {
    text: '正常',
    color: 'green'
  }
}

export const approve = {
  0: {
    text: '未知应用',
    color: 'red'
  },
  5: {
    text: '已验证',
    color: 'green'
  },
  10: {
    text: '受信任的',
    color: 'green'
  }
}

export const useApplication = (appid: string) => {
  const getAppInfo = async () => {
    const { data: result } = await getAppInfoApi({ appid })
    if (result.status !== 200) {
      return message.error(result.msg)
    }
    return result.data
  }

  const updateApp = async (data: { name?: string; description?: string; redirect?: string }) => {
    const { data: result } = await updateAppApi({ appid, ...data })
    if (result.status !== 200) {
      message.error(result.msg)
      return false
    }
    return true
  }

  const refreshSecret = async () => {
    Modal.confirm({
      title: '警告',
      content: '这可能会造成一些不可逆的后果，你确定要重置密钥吗？',
      okText: '我知道我在做什么',
      cancelText: '我再想想',
      async onOk() {
        const { data: result } = await refreshSecretApi({ appid })
        if (result.status !== 200) {
          return message.error(result.msg)
        }
        return message.success('重置密钥成功，请刷新查看')
      }
    })
  }

  const deleteApp = async () => {
    Modal.confirm({
      title: '警告',
      content: '你确定要删除应用程序吗？',
      okText: '我知道我在做什么',
      cancelText: '我再想想',
      async onOk() {
        Modal.confirm({
          title: '二次确认',
          content: '你确定真的要删除该应用程序吗？',
          okText: '取消',
          cancelText: '确认',
          async onCancel() {
            const { data: result } = await deleteAppApi({ appid })
            if (result.status !== 200) {
              return message.error(result.msg)
            }
            message.success('删除应用程序成功')
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          }
        })
      }
    })
  }

  return {
    getAppInfo,
    updateApp,
    refreshSecret,
    deleteApp
  }
}
