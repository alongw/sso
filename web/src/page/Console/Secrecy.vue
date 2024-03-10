<script setup lang="ts">
import { useSecrecyInfo } from '@/hook/console/useConsoleSecrecy'

import ConsoleTitleComponent from '@/components/console/Title.vue'
import ConsoleListComponent from '@/components/console/List.vue'

defineOptions({
  name: 'ConsoleInfoPage'
})

const { listData } = useSecrecyInfo()
</script>

<template>
  <console-title-component title="数据和隐私" desc="您在 Nya Account 中的隐私信息" />
  <console-list-component :data="listData" />
</template>
