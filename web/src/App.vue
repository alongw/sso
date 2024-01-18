<script setup lang="ts">
import NavComponent from './components/Nav.vue'

defineOptions({
  name: 'AppComponent'
})
</script>

<template>
  <div class="base">
    <nav-component />
    <router-view />
  </div>
</template>

<style scoped lang="less">
.base {
  max-width: 2500px;
  margin: 0 auto;
  height: 100vh;
  background-color: #fcfcfc;
}
</style>
