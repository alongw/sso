import { useRouter } from 'vue-router'

import { Shield, Mail, Key } from '@icon-park/vue-next'

import type { List } from '@/types/console'

export const useSecrecyInfo = () => {
  const router = useRouter()

  const listData: List[] = [
    {
      title: '密码',
      desc: '修改和设置您的登录密码',
      icon: Shield,
      action: () =>
        router.push({
          name: 'ConsoleEditPassword'
        })
    },
    {
      title: '邮箱',
      desc: '修改和设置您的电子邮箱地址',
      icon: Mail,
      action: () =>
        router.push({
          name: 'ConsoleEditEmail'
        })
    },
    {
      title: '令牌',
      desc: '修改和设置您的 Api 令牌',
      icon: Key,
      action: () =>
        router.push({
          name: ''
        })
    }
  ]

  return {
    listData
  }
}
