<script setup lang="ts">
import NavComponent from './components/Nav.vue'

defineOptions({
  name: 'AppComponent'
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
