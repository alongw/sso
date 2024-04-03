import { ref, reactive } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'

import { permissionInfo } from '@/hook/useAppPermission'

import {
  getAppInfo as getAppInfoApi,
  getAppList as getAppListApi,
  updateApp as updateAppApi,
  deletePermission as deletePermission,
  addPermission as addPermissionApi,
  getAllPermission as getAllPermissionApi,
  getUsePermission as getUsePermissionApi,
  deleteApp as deleteAppApi,
  refreshSecret as refreshSecretApi,
  removeReview as removeReviewApi
} from '@/api/application'

import type { SelectProps } from 'ant-design-vue'
import type { ApplicationInfo } from '@/types/application'

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

export const useManagement = (appid: string) => {
  const router = useRouter()
  const appInfo = ref<ApplicationInfo | undefined>()
  const selectedKeys = ref<string>()
  const selectedOptions = ref<SelectProps['options']>()
  const contentInfo = reactive({
    name: '',
    description: '',
    redirect: ''
  })

  const getAppInfo = async () => {
    appInfo.value = undefined
    contentInfo.name = ''
    contentInfo.description = ''
    contentInfo.redirect = ''
    const { data: result } = await getAppInfoApi({ appid })
    if (result.status !== 200) {
      return message.error(result.msg)
    }
    appInfo.value = result.data
    const { data: result2 } = await getAppListApi()
    if (result2.status !== 200) {
      return message.error(result2.msg)
    }
    selectedOptions.value = result2.data.applicationList.map((item) => ({
      label: item.name,
      value: item.appid
    }))
    selectedKeys.value = appid
    contentInfo.name = appInfo.value.name
    contentInfo.description = appInfo.value.description
    contentInfo.redirect = appInfo.value.redirect
  }

  const handleSelectChange = () => {
    router.push({
      path: '/redirect',
      query: {
        path: `/console/application/${selectedKeys.value}`
      }
    })
  }

  const saveLoading = ref(false)
  const handleSave = async () => {
    saveLoading.value = true
    const { data: result } = await updateAppApi({
      appid,
      name: contentInfo.name,
      description: contentInfo.description,
      redirect: contentInfo.redirect
    })
    saveLoading.value = false
    if (result.status !== 200) {
      return message.error(result.msg)
    }
    message.success('保存成功')
  }
  const permissionLoading = ref(false)
  const mockData = ref()
  const targetKeys = ref<string[]>()
  const getPermission = async () => {
    const { data: result1 } = await getAllPermissionApi({ appid })
    mockData.value = result1.data.permissionList.map((e) => {
      return {
        key: e.apppid.toString(),
        title: `${e.apppid} - ${permissionInfo.get(e.apppid) || e.name}`,
        description: e.description
      }
    })

    const { data: result2 } = await getUsePermissionApi({ appid })
    mockData.value = mockData.value.concat(
      result2.data.usePermissionList.map((e) => {
        return {
          key: e.apppid.toString(),
          title: `${e.apppid} - ${permissionInfo.get(e.apppid) || e.name}`,
          description: e.description
        }
      })
    )
    targetKeys.value = result2.data.usePermissionList.map((e) => e.apppid.toString())
  }
  const handleChangePermission = async (
    nextTargetKeys: string[],
    direction: string,
    moveKeys: string[]
  ) => {
    if (direction === 'right') {
      // add
      permissionLoading.value = true
      const { data: result } = await addPermissionApi({
        appid,
        apppid: moveKeys.map((e) => +e)
      })
      permissionLoading.value = false
      if (result.status !== 200) return message.error(result.msg)
      return message.success(result.msg)
    } else {
      // delete
      permissionLoading.value = true
      const { data: result } = await deletePermission({
        appid,
        apppid: moveKeys.map((e) => +e)
      })
      permissionLoading.value = false
      if (result.status !== 200) return message.error(result.msg)
      return message.success(result.msg)
    }
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
              router.push('/console/application')
            }, 1000)
          }
        })
      }
    })
  }

  const removeReview = async () => {
    const { data: result } = await removeReviewApi({ appid })
    if (result.status !== 200) {
      return message.error(result.msg)
    }
    message.success('下架应用程序成功')
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
        message.success('重置密钥成功')
        return router.push({
          path: '/redirect',
          query: {
            path: `/console/application/${appid}`
          }
        })
      }
    })
  }

  return {
    getAppInfo,
    handleSelectChange,
    handleSave,
    handleChangePermission,
    getPermission,
    saveLoading,
    selectedKeys,
    selectedOptions,
    appInfo,
    contentInfo,
    permissionLoading,
    mockData,
    targetKeys,
    deleteApp,
    removeReview,
    refreshSecret
  }
}
