<script setup lang="ts">
defineOptions({
  name: 'LogoComponent'
})
</script>

<template>
  <router-link to="/" class="logo">
    <img src="@/assets/logo/48x.png" alt="" />
    <p>Nya Account</p>
  </router-link>
</template>

<style scoped lang="less">
.logo {
  display: flex;
  align-items: center;
  text-decoration: none;

  p {
    color: #000;
    font-size: 20px;
    font-weight: 400;
  }

  img {
    margin-right: 15px;
    width: 35px;
    height: 35px;
  }
}
</style>
