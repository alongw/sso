import { ref } from 'vue'

import { message } from 'ant-design-vue'

import { createApp, getAppList as getAppListApi } from '@/api/application'

import getCaptcha from 'nia-captcha'

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

  return { getAppList, appStatus, itemList }
}
