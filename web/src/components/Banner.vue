<script setup lang="ts">
import nyaButton from '@/components/Button.vue'

defineOptions({
  name: 'BannerComponent'
})
</script>

<template>
  <div class="banner">
    <div class="banner-item">
      <h1>Nya Account</h1>
      <h2>让登录更高效，接入更轻松</h2>
      <p>
        Nya Account 允许用户提供一个令牌，而不是用户名和密码来访问他们存放在特定服务提供者的数据
      </p>
      <div class="button-group">
        <nya-button type="sub">使用文档</nya-button>
        <nya-button type="main">立即使用</nya-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.banner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 410px;
  background: url('@/assets/banner.jpg') no-repeat center;
  background-size: cover;
  .banner-item {
    margin: -60px 0 0 10vw;
    h1 {
      font-size: 48px;
      font-weight: 400;
      color: #1f1f1f;
    }
    h2 {
      font-size: 36px;
      font-weight: 400;
      color: #1f1f1f;
    }
    p {
      margin-top: 8px;
      font-size: 16px;
      font-weight: 400;
      color: #595b5c;
    }
    .button-group {
      margin-top: 45px;
      display: flex;
      button {
        margin-right: 18px;
      }
    }
  }
}

@media screen and (max-width: 900px) {
  .banner {
    .banner-item {
      margin: -60px 0 0 5vw;
    }
  }
}

@media screen and (max-width: 790px) {
  .banner {
    .banner-item {
      margin: -60px 0 0 3vw;
    }
  }
}

@media screen and (max-width: 750px) {
  .banner {
    .banner-item {
      margin: -60px 5vw 0 5vw;
    }
  }
}

@media screen and (max-width: 460px) {
  .banner {
    .banner-item {
      margin-top: 0;
      .button-group {
        flex-direction: column;
        button {
          margin-right: 0;
          margin-bottom: 10px;
        }
      }
    }
  }
}

@media screen and (max-width: 425px) {
  .banner {
    .banner-item {
      margin: 0 3vw 0 3vw;
    }
    h1 {
      font-size: 36px !important;
    }
    h2 {
      font-size: 24px !important;
    }
    p {
      font-size: 14px !important;
    }

    .button-group {
      margin-top: 20px !important;
    }
  }
}
</style>
