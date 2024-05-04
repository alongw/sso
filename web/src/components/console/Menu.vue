<script setup lang="ts">
import { ref, watch } from 'vue'
import { useConsoleMenu } from '@/hook/console/useConsoleMenu'

import { useRoute } from 'vue-router'

defineOptions({
  name: 'ConsoleMenuComponent'
})

const route = useRoute()

const { items, show } = useConsoleMenu()

const selectedKeys = ref<string[]>([route.name?.toString() || 'ConsoleHome'])
const openKeys = ref<string[]>(show ? ['1'] : [])

watch(
  () => route.name,
  (name) => {
    selectedKeys.value = [name?.toString() || 'ConsoleHome']
  }
)
</script>

<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    :style="{
      width: show ? '256px' : '100%'
    }"
    :mode="show ? 'inline' : 'horizontal'"
    :items="items"
  ></a-menu>
</template>
