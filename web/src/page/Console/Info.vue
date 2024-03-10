<script setup lang="ts">
import { useConsoleInfo } from '@/hook/console/useConsoleInfo'

import ConsoleTitleComponent from '@/components/console/Title.vue'
import ConsoleListComponent from '@/components/console/List.vue'

defineOptions({
  name: 'ConsoleInfoPage'
})

const { listData } = useConsoleInfo()
</script>

<template>
  <console-title-component title="个人信息" desc="您在 Nya Account 中的个人信息" />
  <console-list-component :data="listData" />
</template>
