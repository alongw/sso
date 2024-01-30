<script setup lang="ts">
defineOptions({
  name: 'ModalBoxComponent'
})

defineProps({
  avatar: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: String,
    default: '100%'
  }
})
</script>
<template>
  <div class="max">
    <div class="box">
      <!-- <div v-if="avatar">
        <div v-if="avatar === 'logo'" class="avatar logo"></div>
        <div v-else class="avatar">
          <img :src="avatar" />
        </div>
      </div> -->
      <div v-if="avatar">
        <div class="avatar logo">
          <img :src="avatar" />
        </div>
      </div>

      <div class="title" v-if="title">{{ title }}</div>
      <div
        :style="{
          maxWidth: maxWidth,
          margin: '0 auto',
          height: '100%'
        }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.max {
  background-color: #fcfcfc;
  padding-bottom: 44px;
}
.box {
  margin: 44px auto 0 auto;
  padding: 25px;
  width: 100%;
  max-width: 540px;
  min-height: 540px;
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 0px 11px 34px rgba(0, 0, 0, 0.2);

  .avatar {
    position: relative;
    margin: 58px auto 33px auto;
    width: 144px;
    height: 144px;

    img {
      position: absolute;
      width: 144px;
      height: 144px;
      display: block;
      margin: 0 auto;
      border-radius: 100%;
      // border: 1px solid #000;
    }
  }

  .logo {
    width: 144px;
    height: 144px;
    border-radius: 100%;
    border: 1px solid #000;
    background: url('@/assets/logo/500x.png') no-repeat center;
    background-size: cover;
  }

  .title {
    margin-bottom: 33px;
    font-size: 24px;
    font-weight: 400;
    text-align: center;
  }
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

@media screen and (max-width: 550px) {
  .max {
    padding: 15px;
    .box {
      margin: 5px auto 0 auto;
    }
  }
}

@media screen and (max-width: 420px) {
  .max {
    padding: 8px;
  }
}
</style>
