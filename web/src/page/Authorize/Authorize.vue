<script setup lang="ts">
import { reactive, ref } from 'vue'
import ModalBoxComponents from '@/components/ModalBox.vue'
import ButtonComponents from '@/components/Button.vue'
import LogoComponents from '@/components/Logo.vue'

import { IdcardFilled } from '@ant-design/icons-vue'

defineOptions({
  name: 'AuthorizePage'
})

enum Approve {
  'default' = 0,
  'agree' = 5,
  'master' = 10
}

const approve = ref<Approve>(Approve.master)

const permissionList = reactive<
  {
    id: number
    icon: any
    title: string
  }[]
>([
  {
    id: 1,
    icon: IdcardFilled,
    title: '读取您的个人资料'
  },
  {
    id: 1,
    icon: IdcardFilled,
    title: '读取您的个人资料'
  },
  {
    id: 1,
    icon: IdcardFilled,
    title: '读取您的个人资料'
  },
  {
    id: 1,
    icon: IdcardFilled,
    title: '读取您的个人资料'
  },
  {
    id: 1,
    icon: IdcardFilled,
    title: '读取您的个人资料'
  },
  {
    id: 1,
    icon: IdcardFilled,
    title: '读取您的个人资料'
  },
  {
    id: 1,
    icon: IdcardFilled,
    title: '读取您的个人资料'
  },
  {
    id: 1,
    icon: IdcardFilled,
    title: '读取您的个人资料'
  },
  {
    id: 1,
    icon: IdcardFilled,
    title: '读取您的个人资料'
  }
])
</script>

<template>
  <modal-box-components>
    <logo-components :link="false" />
    <div class="box">
      <div class="email">110@gov.cn</div>
      <div class="title">是否允许此应用访问你的信息？</div>
      <div class="subtitle">
        <div class="application-name">NIA-IMG</div>
        <div>&nbsp;需要得到你的许可才能执行以下操作：</div>
      </div>
      <div v-if="approve === 10" class="application-status master">受信任的应用程序</div>
      <div v-else-if="approve === 5" class="application-status agree">已验证其开发者</div>
      <div v-else class="application-status unkonw">未知的应用程序</div>
      <ul>
        <li v-for="item in permissionList" :key="item.id">
          <div class="icon">
            <component :is="item.icon" style="font-size: 30px; opacity: 0.8" />
          </div>
          <div class="info">
            <div class="title">
              {{ item.title }}
            </div>
            <div class="desc">NIA-IMG 将能够{{ item.title }}</div>
          </div>
          <div class="check-box">
            <a-checkbox />
          </div>
        </li>
      </ul>
      <div class="button-group">
        <ButtonComponents type="cancel" style="width: 96px; height: 36px"> 取消 </ButtonComponents>
        <ButtonComponents type="verify" style="width: 96px; height: 36px; margin-left: 6px">
          接受
        </ButtonComponents>
      </div>
    </div>
  </modal-box-components>
</template>

<style scoped lang="less">
.box {
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
}
</style>
