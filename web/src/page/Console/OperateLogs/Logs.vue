<script setup lang="ts">
import ConsoleTitleComponent from '@/components/console/Title.vue'
import ConsoleListComponent from '@/components/console/List.vue'

import router from '@/router'

import { Time as TimeIcon, Seal as SealIcon } from '@icon-park/vue-next'

import type { List } from '@/types/console'

defineOptions({
  name: 'ConsoleLogsPage'
})

const listData: List[] = [
  {
    title: '登录日志',
    desc: '查询您的账号登录日志',
    icon: TimeIcon,
    action: () =>
      router.push({
        name: 'ConsoleLogsLogin'
      })
  },
  {
    title: '授权日志',
    desc: '查询您对其他应用的授权日志',
    icon: SealIcon,
    action: () =>
      router.push({
        name: 'ConsoleLogsAuth'
      })
  }
]
</script>

<template>
  <console-title-component title="操作日志" desc="您在 Nya Account 中的操作日志" />
  <console-list-component :data="listData" />
</template>
