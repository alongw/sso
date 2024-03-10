import { h } from 'vue'

import { useRouter } from 'vue-router'

import { User as UserIcon } from '@icon-park/vue-next'
import { HomeOutlined } from '@ant-design/icons-vue'

import { useScreen } from '@/hook/useScreen'

import type { ItemType } from 'ant-design-vue'

const { screenWidth } = useScreen()

export const useConsoleMenu = () => {
  const router = useRouter()

  const items: ItemType[] = [
    {
      label: '首页',
      key: '0',
      icon: () => h(HomeOutlined),
      onClick: () => router.push('/console')
    },
    {
      label: '个人信息',
      key: '1',
      icon: () => h(UserIcon),
      children: [
        {
          label: '用户信息相关',
          key: '1-0',
          type: 'group'
        },
        {
          label: '个人信息',
          key: '1-1',
          onClick: () => router.push('/console/info')
        }
      ]
    }
  ]

  const show = screenWidth >= 800

  return {
    items,
    show
  }
}
