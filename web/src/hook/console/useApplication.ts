import { ref } from 'vue'

import { message } from 'ant-design-vue'

import { createApp as createAppApi, getAppList as getAppListApi } from '@/api/application'

import getCaptcha from '@/utils/captcha'

import { AppStore as AppStoreIcon } from '@icon-park/vue-next'

import type { List } from '@/types/console'
import router from '@/router'

const appStatus = {
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

export const useConsoleApplication = () => {
  const itemList = ref<List[]>()
  const getAppList = async () => {
    itemList.value = undefined
    const { data: result } = await getAppListApi()
    if (result.status !== 200) {
      return message.error('获取应用列表失败')
    }
    itemList.value = result.data.applicationList.map((e) => {
      return {
        title: e.name,
        desc: e.description,
        icon: AppStoreIcon,
        action: () => {
          router.push(`/console/application/${e.appid}`)
        },
        application: e
      }
    })
  }

  const modalOpen = ref(false)
  const modalIpt = ref('')
  const modalBtnLoading = ref(false)

  const createApp = async () => {
    if (!modalIpt.value) {
      return message.error('请正确填写表单')
    }
    const captcha = await getCaptcha()
    if (captcha === null) {
      return
    }
    modalBtnLoading.value = true
    const { data: result } = await createAppApi({
      name: modalIpt.value,
      ticket: captcha.ticket,
      randstr: captcha.randstr
    })
    modalBtnLoading.value = false
    if (result.status !== 200) {
      return message.error(result.msg)
    }
    modalOpen.value = false
    modalIpt.value = ''
    message.success('创建成功')
    await getAppList()
    return
  }

  return { getAppList, appStatus, itemList, modalOpen, modalIpt, createApp, modalBtnLoading }
}
