import { h } from 'vue'

import { useRouter } from 'vue-router'

import {
  User as UserIcon,
  DataUser as DataUserIcon,
  EditName as EditNameIcon,
  Avatar as AvatarIcon,
  SwitchButton as SwitchButtonIcon,
  Shield as ShieldIcon,
  Mail as MailIcon,
  Key as KeyIcon,
  InternalData as InternalDataIcon,
  ApplicationTwo as ApplicationTwoIcon,
  AllApplication as AllApplicationIcon,
  FingerprintThree as FingerprintThreeIcon,
  ColorFilter as ColorFilterIcon,
  Log as LogIcon,
  Time as TimeIcon,
  FileDateOne as FileDateOneIcon,
  Seal as SealIcon
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
          label: '隐私设置',
          key: 'ConsoleSecrecy',
          onClick: () => router.push('/console/secrecy'),
          icon: () => h(SwitchButtonIcon)
        },
        {
          label: '展示设置',
          key: 'ConsoleShow',
          onClick: () => router.push('/console/show'),
          icon: () => h(InternalDataIcon)
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
        },
        {
          label: '修改密码',
          key: 'ConsoleEditPassword',
          onClick: () => router.push('/console/edit/password'),
          icon: () => h(ShieldIcon)
        },
        {
          label: '编辑邮箱',
          key: 'ConsoleEditEmail',
          onClick: () => router.push('/console/edit/email'),
          icon: () => h(MailIcon)
        },
        {
          label: '外部验证器',
          key: 'ConsoleEditAuthenticator',
          onClick: () => router.push('/console/edit/authenticator'),
          icon: () => h(FingerprintThreeIcon)
        },
        {
          label: '配置令牌',
          key: 'ConsoleEditEmail',
          onClick: () => router.push('/console/edit/key'),
          icon: () => h(KeyIcon),
          disabled: true
        }
      ]
    },
    {
      label: '应用程序',
      key: '2',
      icon: () => h(ApplicationTwoIcon),
      children: [
        {
          label: '应用程序相关',
          key: '2-0',
          type: 'group'
        },
        {
          label: '接入管理',
          key: 'ConsoleApplication',
          onClick: () => router.push('/console/application'),
          icon: () => h(AllApplicationIcon)
        },
        {
          label: '应用管理',
          key: 'ConsoleApplicationManagement',
          onClick: () => router.push('/console/application/0'),
          icon: () => h(ColorFilterIcon)
        }
      ]
    },
    {
      label: '操作日志',
      key: '3',
      icon: () => h(LogIcon),
      children: [
        {
          label: '日志相关',
          key: '3-0',
          type: 'group'
        },
        {
          label: '操作日志',
          key: 'ConsoleLogs',
          onClick: () => router.push('/console/logs'),
          icon: () => h(FileDateOneIcon)
        },
        {
          label: '登录日志',
          key: 'ConsoleLogsLogin',
          onClick: () => router.push('/console/logs/login'),
          icon: () => h(TimeIcon)
        },
        {
          label: '授权日志',
          key: 'ConsoleLogsAuth',
          onClick: () => router.push('/console/logs/auth'),
          icon: () => h(SealIcon)
        }
        // {
        //   label: '操作日志',
        //   key: 'ConsoleOperationLogs',
        //   onClick: () => router.push('/console/logs/operation'),
        //   icon: () => h(SwitchButtonIcon)
        // }
      ]
    }
  ]

  const show = screenWidth >= 800

  return {
    items,
    show
  }
}
