<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConsoleHome } from '@/hook/console/useConsoleHome'

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
      <div class="content">
        <!-- 第一行 -->
        <div class="card">
          <a-card class="card-item" title="个人信息管理">
            <!-- <template #extra><a href="#">more</a></template> -->
            <a-space direction="vertical">
              <p>管理您在 Nya Account 中的个人信息</p>
              <p>包括用户名、昵称和头像</p>
              <a-button type="primary" class="right" @click="$router.push('/console/info')">
                进入
              </a-button>
            </a-space>
          </a-card>
          <a-card class="card-item" title="数据和隐私设置">
            <a-space direction="vertical">
              <p>管理您的隐私信息</p>
              <p>包括密码、邮箱和 api 令牌</p>
              <a-button type="primary" class="right"> 进入 </a-button>
            </a-space>
          </a-card>
        </div>

        <!-- 第二行 -->
        <div class="card">
          <a-card class="card-item" title="个人信息展示设置">
            <a-space direction="vertical">
              <p>管理您的对外授权信息</p>
              <p>包括基础信息、联系信息、隐私信息等信息的展示设置</p>
              <a-button type="primary" class="right">进入</a-button>
            </a-space>
          </a-card>
        </div>

        <!-- 第三行 -->
        <div class="card">
          <a-card class="card-item" title="应用程序管理">
            <a-space direction="vertical">
              <p>管理您接入的应用程序</p>
              <p>包括基础信息、权限信息、秘钥配置、应急下架等操作</p>
              <a-button type="primary" class="right">进入</a-button>
            </a-space>
          </a-card>
        </div>

        <!-- 第四行 -->
        <div class="card">
          <a-card class="card-item" title="实名信息管理">
            <a-space direction="vertical">
              <p>管理您的支付信息</p>
              <p>实名认证设置和支付设置</p>
              <a-button type="primary" class="right">进入</a-button>
            </a-space>
          </a-card>
          <a-card class="card-item" title="授权记录查询">
            <a-space direction="vertical">
              <p>查询近期授权记录</p>
              <p>包括应用程序名称、权重和给予权限</p>
              <a-button type="primary" class="right">进入</a-button>
            </a-space>
          </a-card>
        </div>

        <!-- 第五行 -->
        <div class="card">
          <a-card class="card-item" title="第三方账号管理">
            <a-space direction="vertical">
              <p>管理第三方应用单点登录</p>
              <p>第三方应用绑定管理</p>
              <a-button type="primary" class="right">进入</a-button>
            </a-space>
          </a-card>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<style scoped lang="less">
.console-home {
  .right {
    float: right;
  }
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

  .content {
    margin-top: 20px;

    .card {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      margin: 0 auto;

      .card-item,
      .ant-card {
        flex: 1;
        margin: 15px 10px;

        .ant-space {
          width: 100%;
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .card {
    flex-direction: column;
  }
  .right {
    float: none !important;
  }
}
</style>
@/hook/console/useConsoleHome
