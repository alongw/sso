<script setup lang="ts">
import MenuComponent from '@/components/console/Menu.vue'

import { useConsoleMenu } from '@/hook/useConsoleMenu'

const { show } = useConsoleMenu()

defineOptions({
  name: 'ConsolePage'
})
</script>

<template>
  <div
    class="console"
    :style="{
      flexDirection: show ? 'row' : 'column',
      height: show ? 'calc(100vh - 70px)' : 'auto'
    }"
  >
    <div class="menu">
      <menu-component style="height: 100%" />
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="less">
.console {
  display: flex;
  flex: 1;

  .menu {
    overflow: scroll;
    overflow-x: hidden;
    height: 100%;
  }

  .content {
    flex: 1;
    overflow: scroll;
    overflow-x: hidden;
    padding: 15px;
  }

  ::-webkit-scrollbar {
    height: 5px;
    width: 5px;
    padding: 0 5px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: hsla(224, 6%, 65%, 0.5) !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 10px;
    -webkit-transition: background 0.3s ease;
    transition: background 0.3s ease;
    opacity: 0.1;
  }
}
</style>
