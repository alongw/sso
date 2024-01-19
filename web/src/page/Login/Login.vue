<script setup lang="ts">
import { computed, reactive } from 'vue'
import ModalBoxComponents from '@/components/ModalBox.vue'
import { ArrowCircleRight, LoadingOne } from '@icon-park/vue-next'
defineOptions({
  name: 'LoginPage'
})

enum AuthenticationType {
  Email = 'email',
  Password = 'password',
  Null = ''
}

const userInfo = reactive({
  username: '',
  authenticationType: AuthenticationType.Null,
  captcha: false,
  isRegister: false,
  tips: '我们已经向 **0@***.cn 发送了一条含有验证码的邮件'
})

const title = computed(() => {
  return userInfo.isRegister ? '注册 Lolinya Account 账号' : '通过 Lolinya Account 登录'
})

const showPasswordInput = () => {
  startAnimation.animationPlayState = 'running'
}

const startAnimation = reactive({
  animationPlayState: 'paused'
})

const loading = reactive<{
  user: boolean
  password: boolean
}>({
  user: false,
  password: false
})

const form = reactive({
  user: '',
  password: '',
  keepLogin: false
})

const captcha = reactive({
  randstr: '',
  ticket: ''
})
</script>

<template>
  <modal-box-components :title="title" avatar="logo">
    <form action="javascript:;">
      <div class="user">
        <input
          v-model="form.user"
          type="text"
          placeholder="电子邮箱或用户名"
          maxlength="32"
          :style="startAnimation"
          :disabled="loading.user"
        />
        <div v-if="userInfo.authenticationType == AuthenticationType.Null" class="user-icon">
          <arrow-circle-right
            v-if="!loading.user"
            class="icon-button"
            theme="filled"
            size="24"
            :strokeWidth="2"
          />
          <loading-one
            v-else
            class="loading-icon"
            theme="filled"
            size="24"
            fill="#333"
            :strokeWidth="2"
          />
        </div>
      </div>
      <div class="password" :style="startAnimation">
        <input
          v-if="userInfo.authenticationType == AuthenticationType.Password"
          v-model="form.password"
          type="password"
          maxlength="32"
          placeholder="密码"
        />
        <input
          v-if="userInfo.authenticationType == AuthenticationType.Email"
          v-model="form.password"
          type="text"
          maxlength="6"
          placeholder="邮件验证码"
        />
        <div class="user-icon" v-if="userInfo.authenticationType !== AuthenticationType.Null">
          <arrow-circle-right
            v-if="!loading.password"
            class="icon-button"
            theme="filled"
            size="24"
            :strokeWidth="2"
          />
          <loading-one
            v-else
            class="loading-icon"
            theme="filled"
            size="24"
            fill="#333"
            :strokeWidth="2"
          />
        </div>
      </div>
    </form>
    <div class="tips">
      <p>{{ userInfo.tips }}</p>
    </div>
    <div class="under">
      <a-checkbox v-model:checked="form.keepLogin">保持我的登录状态</a-checkbox>
      <div class="reg-tips">
        <p v-if="!userInfo.isRegister">未注册用户输入邮箱将自动注册</p>
        <p v-else>
          如果您继续，则代表您已放弃自己的一切权利阅读并同意
          <a-button type="link">用户协议</a-button>
        </p>
      </div>
    </div>
  </modal-box-components>
</template>

<style scoped lang="less">
form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  input {
    padding: 0 50px 0 22px;
    width: 100%;
    max-width: 400px;
    height: 45px;
    border: 1px solid #86868b;
  }

  .user-icon {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 45px;
    top: 0;
    right: 15px;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .loading-icon {
    cursor: not-allowed;
    animation: rotate 3s linear infinite;
  }

  .icon-button {
    cursor: pointer;
    color: #333;
    transition: all 0.2s ease;
    &:hover {
      color: #111;
    }
  }

  .user,
  .password {
    position: relative;
    width: 100%;
    max-width: 400px;
  }

  @keyframes user {
    50% {
      border-radius: 12px 12px 0 0;
    }
    100% {
      border-radius: 12px 12px 0 0;
    }
  }

  .user {
    z-index: 3;
    input {
      animation: user 1s forwards;
      animation-play-state: paused;
      border-radius: 12px;
    }
  }

  @keyframes password {
    form {
      margin-top: -45px;
    }
    to {
      margin-top: -1px;
      opacity: 1;
    }
  }
  .password {
    margin-top: -45px;
    opacity: 0;
    animation: password 0.5s forwards;
    animation-play-state: paused;
    z-index: 2;
    input {
      // margin-top: -1px;
      border-radius: 0 0 12px 12px;
    }
  }
}

.tips {
  width: 100%;
  max-width: 400px;
  margin: 3px auto 0 auto;
  p {
    color: #494949;
    font-size: 12px;
    font-weight: 400;
  }
}

.under {
  margin-top: 37px;
  text-align: center;

  .reg-tips {
    margin: 10px auto 0 auto;
    width: 100%;
    max-width: 400px;
    font-size: 16px;
    font-weight: 400;
    color: #494949;
  }
}

// @media screen and (max-width: 560px) {
//   .under {
//     margin-top: 20px;
//   }
// }

// @media screen and (max-width: 350px) {
//   .under {
//     margin-top: 5px;
//   }
// }
</style>
