<script setup lang="ts">
defineOptions({
  name: 'LogoComponent'
})

defineProps({
  showLogo: {
    type: Boolean,
    default: true
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  link: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <router-link v-if="link === true" to="/" class="logo">
    <img v-if="showLogo" src="@/assets/logo/48x.png" alt="" />
    <p v-if="showTitle">Nya Account</p>
  </router-link>
  <a v-else class="logo">
    <img v-if="showLogo" src="@/assets/logo/48x.png" alt="" />
    <p v-if="showTitle">Nya Account</p>
  </a>
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
