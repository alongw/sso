<script setup lang="ts">
import Text from './text.md?raw'
import { parse } from 'marked'

defineOptions({
  name: 'SolutionPage'
})
</script>

<template>
  <div class="box">
    <h1>解决方案</h1>
    <div class="item" v-html="parse(Text)"></div>
  </div>
</template>

<style scoped lang="less">
.box {
  width: 100%;
  max-width: 1200px;
  padding: 15px;
  margin: 0 auto;
  .item {
    margin: 0 auto;
    padding: 15px;
  }
}
</style>
