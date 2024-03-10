import { h } from 'vue'

import { useRouter } from 'vue-router'

import {
  User as UserIcon,
  DataUser as DataUserIcon,
  EditName as EditNameIcon,
  Avatar as AvatarIcon
} from '@icon-park/vue-next'
import { HomeOutlined } from '@ant-design/icons-vue'

import { useScreen } from '@/hook/useScreen'

import type { ItemType } from 'ant-design-vue'

const { screenWidth } = useScreen()

export const useConsoleMenu = () => {
  const router = useRouter()

  const items: ItemType[] = [
    {
      label: '首页',
      key: 'ConsoleHome',
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
          key: 'ConsoleInfo',
          onClick: () => router.push('/console/info'),
          icon: () => h(DataUserIcon)
        },
        {
          label: '编辑用户信息',
          key: '1-1',
          type: 'group'
        },
        {
          label: '编辑昵称',
          key: 'ConsoleEditUsername',
          onClick: () => router.push('/console/edit/username'),
          icon: () => h(EditNameIcon)
        },
        {
          label: '编辑头像',
          key: 'ConsoleEditAvatar',
          onClick: () => router.push('/console/edit/avatar'),
          icon: () => h(AvatarIcon)
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
