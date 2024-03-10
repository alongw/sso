<script setup lang="ts">
import { ref } from 'vue'
import { useConsoleMenu } from '@/hook/useConsoleMenu'

defineOptions({
  name: 'ConsoleMenuComponent'
})

const { items, show } = useConsoleMenu()

const selectedKeys = ref<string[]>(['0'])
const openKeys = ref<string[]>(show ? ['1'] : [])
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
