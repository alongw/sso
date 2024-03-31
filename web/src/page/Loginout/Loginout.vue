<script setup lang="ts">
import ModalBoxComponents from '@/components/ModalBox.vue'
import { onMounted, ref, onUnmounted } from 'vue'

import router from '@/router'

defineOptions({
  name: 'LoginoutPage'
})

window.localStorage.clear()

const number = ref(5)

let timer: number | undefined

onMounted(() => {
  timer = setInterval(() => {
    number.value--
    if (number.value <= 0) {
      router.push({ name: 'Home' })
    }
  }, 1000)
})

onUnmounted(() => {
  timer && clearInterval(timer)
})
</script>
<template>
  <modal-box-components>
    <div class="box">
      <h1>您已成功退出登录</h1>
      <h2>但是你最好关闭所有浏览器窗口</h2>
      <div class="button-group">
        <a-button type="link" @click="router.push({ name: 'Home' })">
          返回首页（{{ number }}）
        </a-button>
      </div>
    </div>
  </modal-box-components>
</template>

<style scoped lang="less">
.box {
  text-align: center;
  margin-top: 50px;

  .button-group {
    margin-top: 25px;
  }
}
</style>
