<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useAuthorize } from '@/hook/useAuthorize'
import { useRoute, useRouter } from 'vue-router'

import { More } from '@icon-park/vue-next'
import { isLogin } from '@/hook/useUser'
import ModalBoxComponents from '@/components/ModalBox.vue'
import ButtonComponents from '@/components/Button.vue'
import LogoComponents from '@/components/Logo.vue'

defineOptions({
  name: 'AuthorizePage'
})

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '80px'
  },
  spin: true
})

const route = useRoute()
const router = useRouter()

const {
  getApplicationInfo,
  agree,
  deny,
  userEmail,
  appName,
  approve,
  appStatus,
  permissionList,
  permissionIcon,
  loading
} = useAuthorize(route.query)

const userPermissionList = ref<{
  [key: number]: boolean
}>({})

onMounted(async () => {
  if (!isLogin()) {
    return router.push({
      path: '/login',
      query: {
        ...route.query,
        from: 'authorize.noLogin'
      }
    })
  }

  await getApplicationInfo()
  permissionList.value.forEach((e) => {
    userPermissionList.value[e.apppid] = e.defaultCheck
  })
})
</script>

<template>
  <modal-box-components>
    <logo-components :link="false" />
    <div class="box">
      <div class="email">{{ userEmail }}</div>
      <div class="title">是否允许此应用访问你的信息？</div>
      <div class="subtitle">
        <div>{{ appName }}&nbsp;需要得到你的许可才能执行以下操作：</div>
      </div>
      <div class="appType">
        <div v-if="appStatus === 0">
          <div class="application-status unkonw">应用尚未审核，仅供调试</div>
        </div>
        <div v-else>
          <div v-if="approve === 10" class="application-status master">受信任的应用程序</div>
          <div v-else-if="approve === 5" class="application-status agree">已验证其开发者</div>
          <div v-else class="application-status unkonw">未知的应用程序</div>
        </div>
      </div>
      <ul>
        <li v-for="item in permissionList" :key="item.apppid">
          <div class="icon">
            <component
              :is="permissionIcon[item.apppid] || More"
              style="font-size: 30px; opacity: 0.8"
            />
          </div>
          <div class="info">
            <div class="title">
              {{ item.name }}
            </div>
            <div class="desc">{{ appName }} 将能够{{ item.desc }}</div>
          </div>
          <div class="check-box">
            <a-checkbox v-model:checked="userPermissionList[item.apppid]" :disabled="item.lock" />
          </div>
        </li>
      </ul>
      <div class="button-group">
        <ButtonComponents @click="deny" type="cancel" style="width: 96px; height: 36px">
          取消
        </ButtonComponents>
        <ButtonComponents
          @click="agree(userPermissionList)"
          type="verify"
          style="width: 96px; height: 36px; margin-left: 6px"
        >
          接受
        </ButtonComponents>
      </div>
      <div v-show="loading" class="loading">
        <a-spin :indicator="indicator" />
        <h2>正在授权</h2>
      </div>
    </div>
  </modal-box-components>
</template>

<style scoped lang="less">
.box {
  position: relative;
  width: 100%;
  max-width: 460px;
  margin: 0 auto;

  .email {
    margin-top: 17px;
    color: #383838;
    font-size: 16px;
    font-weight: 400;
  }

  .title {
    margin-top: 20px;
    color: #000;
    font-size: 24px;
    font-weight: 400;
  }

  .subtitle {
    display: flex;
    align-items: center;
    margin-top: 23px;
    font-size: 18px;
    font-weight: 400;
  }

  .application-status {
    margin-top: 10px;
    font-size: 18px;
    font-weight: 400;
  }

  .master {
    color: #0abf5b;
  }

  .agree {
    color: #0abf5b;
  }

  .unkonw {
    color: #ff4d4f;
  }

  ul {
    margin-top: 23px !important;
    max-height: 200px;
    min-height: 170px;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      height: 5px;
      width: 5px;
      padding: 0 5px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: hsla(224, 6%, 65%, 0.5) !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 10px;
      -webkit-transition: background 0.3s ease;
      transition: background 0.3s ease;
      opacity: 0.1;
    }

    li {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;

      &:nth-child(1) {
        margin-top: 0;
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
      }

      .info {
        flex: 1;
        padding: 0 20px;
        .title {
          margin: 0;
          font-size: 18px;
          font-weight: 400;
          color: #000;
        }

        .desc {
          font-size: 16px;
          font-weight: 400;
          color: #808080;
        }
      }

      .check-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
      }
    }
  }

  .button-group {
    width: 100%;
    max-width: 430px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: right;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fffffff0;

    h2 {
      margin-top: 30px;
    }
  }
}
</style>
