<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConsoleHome } from '@/hook/useConsoleHome'

defineOptions({
  name: 'ConsoleHomePage'
})

const { userInfo, getUserInfo } = useConsoleHome()

const loading = ref(true)

onMounted(async () => {
  const result = await getUserInfo()
  if (result) {
    userInfo.value = result.data
  }
  loading.value = false
})
</script>

<template>
  <a-spin :spinning="loading" size="large">
    <div class="console-home">
      <div class="title">
        <a-skeleton :loading="loading" active>
          <div class="avatar">
            <img :src="userInfo?.avatar + '?d=blank&s=125'" alt="" />
          </div>
          <h1>你好，{{ userInfo?.nickname || userInfo?.username || '未命名用户' }}</h1>
          <p>管理自己的信息、隐私和安全，创建应用程序和探索更多玩法</p>
        </a-skeleton>
      </div>
    </div>
  </a-spin>
</template>

<style scoped lang="less">
.console-home {
  .title {
    text-align: center;
    margin-top: 60px;

    .avatar {
      margin: 0 auto;
      width: 125px;
      height: 125px;
      //   border: 1px solid #000;
      border-radius: 100%;
      background: url('@/assets/logo/500x.png') no-repeat center;
      background-size: cover;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    h1 {
      margin: 20px auto;
    }

    p {
      font-size: 18px;
      color: #484c4b;
    }
  }
}
</style>
