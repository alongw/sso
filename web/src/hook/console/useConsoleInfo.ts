import { useRouter } from 'vue-router'

import { EditName, Avatar, IdCard } from '@icon-park/vue-next'

import type { List } from '@/types/console'

export const useConsoleInfo = () => {
  const router = useRouter()

  const listData: List[] = [
    {
      title: '用户名',
      desc: '管理或设置您的用户名',
      icon: IdCard,
      action: () =>
        router.push({
          name: 'Perfect'
        })
    },
    {
      title: '显示昵称',
      desc: '修改您的显示昵称以及在授权应用时的用户名',
      icon: EditName,
      action: () =>
        router.push({
          name: 'ConsoleEditUsername'
        })
    },
    {
      title: '头像',
      desc: '修改您的头像，这将一并修改您包括但不限于授权应用以及所有场景的头像',
      icon: Avatar,
      action: () =>
        router.push({
          name: 'ConsoleEditAvatar'
        })
    }
  ]

  return {
    listData
  }
}
