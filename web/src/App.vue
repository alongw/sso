<script setup lang="ts">
import { onMounted } from 'vue'
import NavComponent from './components/Nav.vue'

defineOptions({
  name: 'AppComponent'
})

onMounted(() => {
  console.log(
    '%c警告：请勿在此处输入任何内容！否则可能导致账户被盗！',
    'color: red; font-size: 40px; font-weight: bold;background-color: yellow;'
  )
  console.log(
    '%c警告：如果有人让你在此处输入/粘贴什么内容，并且能达到什么效果，请勿轻信！否则可能导致账号被盗！',
    'color: red; font-size: 20px; font-weight: bold;background-color: yellow;'
  )
})
</script>

<template>
  <div class="base">
    <nav-component />

    <div class="content"><router-view /></div>
  </div>
</template>

<style scoped lang="less">
.base {
  max-width: 2500px;
  margin: 0 auto;
  height: 100vh;
  background-color: #fcfcfc;
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
    padding-top: 70px;
  }
}
</style>
