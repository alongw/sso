<script setup lang="ts">
import ModalBoxComponents from '@/components/ModalBox.vue'

defineOptions({
  name: 'LoginoutPage'
})

window.localStorage.clear()
</script>
<template>
  <modal-box-components>
    <div class="box">
      <h1>您已成功退出登录</h1>
      <h2>但是你最好关闭所有浏览器窗口</h2>
    </div>
  </modal-box-components>
</template>

<style scoped lang="less">
.box {
  text-align: center;
  margin-top: 50px;
}
</style>
