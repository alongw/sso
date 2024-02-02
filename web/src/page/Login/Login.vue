<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import ModalBoxComponents from '@/components/ModalBox.vue'
import { ArrowCircleRight, LoadingOne } from '@icon-park/vue-next'
import getCaptcha from 'nia-captcha'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import _ from 'lodash'
import { getAccountStatus, register as registerApi, login as loginApi } from '@/api/login'
defineOptions({
  name: 'LoginPage'
})

const router = useRouter()
const route = useRoute()

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
  tips: ''
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

const avatarUrl = ref('logo')

const submit = async () => {
  if (!form.user || form.user === '') return message.error('请正确填写表单')

  loading.user = true
  const res = await getAccountStatus({
    email: _.trim(form.user),
    captcha: captcha
  })

  if (res.data.status === 418) {
    return (loading.user = false)
  }

  // 需要验证码
  if (res.data.status === 422) {
    loading.user = false
    const captchaCallback = await getCaptcha('2046626881')
    captcha.randstr = captchaCallback.randstr
    captcha.ticket = captchaCallback.ticket
    submit()
  }

  captcha.randstr = ''
  captcha.ticket = ''

  if (res.data.status !== 200) {
    if (res.data.status === 422) return
    loading.user = false
    return message.error(res.data.msg)
  }

  showPasswordInput()

  avatarUrl.value = res.data.data.avatar || 'logo'
  userInfo.username = res.data.data.username || ''
  userInfo.authenticationType = res.data.data.authenticationType || AuthenticationType.Null
  userInfo.captcha = res.data.data.captcha || false
  userInfo.isRegister = res.data.data.isRegister || false
  userInfo.tips = res.data.data.tips || ''
  setTimeout(() => {
    if (userInfo.authenticationType === AuthenticationType.Password) {
      const passwordInput = document.querySelector('#password-input')
      if (passwordInput instanceof HTMLElement) passwordInput.focus()
    } else {
      const emailCodeInput = document.querySelector('#emailCode-input')
      if (emailCodeInput instanceof HTMLElement) emailCodeInput.focus()
    }
  }, 500)
}

const handleKeyDown = (e: KeyboardEvent) => {
  // 检查是否按下的是Enter键（keyCode为13）
  if (e.key === 'Enter') {
    sure()
  }
}

const register = async () => {
  if (!form.user || !form.password) return message.error('请正确填写表单')
  const captchaCallback = await getCaptcha('2046626881')
  captcha.randstr = captchaCallback.randstr
  captcha.ticket = captchaCallback.ticket
  loading.password = true
  const res = await registerApi({
    email: _.trim(form.user),
    code: _.trim(form.password),
    captcha: captcha
  })
  loading.password = false
  if (res.data.status !== 200) return message.error(res.data.msg)
  message.success('注册成功')
  window.localStorage.setItem('token', res.data.data.token)
  window.localStorage.setItem('expire', res.data.data.expire.toString())
  setTimeout(() => {
    router.push({
      path: '/user/perfect',
      query: {
        form: 'login.page.register',
        ...route.query
      }
    })
  }, 500)
}

const login = async () => {
  if (!form.user || !form.password) return message.error('请正确填写表单')
  loading.password = true
  const res = await loginApi({
    type: userInfo.authenticationType === AuthenticationType.Email ? 'mail' : 'password',
    userinput: _.trim(form.user),
    codeinput: _.trim(form.password),
    keep: form.keepLogin,
    captcha: captcha
  })
  loading.password = false
  if (res.data.status === 400) {
    const captchaCallback = await getCaptcha('2046626881')
    loading.password = false
    captcha.randstr = captchaCallback.randstr
    captcha.ticket = captchaCallback.ticket
    login()
  }
  captcha.randstr = ''
  captcha.ticket = ''

  if (res.data.status !== 200) {
    if (res.data.status === 400) return
    loading.password = false
    return message.error(res.data.msg)
  }
  message.success(res.data.msg)
  window.localStorage.setItem('token', res.data.data.token)
  window.localStorage.setItem('expire', res.data.data.expire.toString())
  setTimeout(() => {
    router.push({
      path: route.query.appid ? '/authorize' : '/user',
      query: {
        ...route.query,
        form: 'login.page.login'
      }
    })
  }, 500)
}

const sure = () => {
  if (userInfo.isRegister) {
    register()
  } else {
    login()
  }
}
</script>

<template>
  <modal-box-components :avatar="avatarUrl" :title="title">
    <form action="javascript:;" @submit.prevent="submit()">
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
            @click="submit()"
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
          id="password-input"
          @keydown="handleKeyDown"
        />
        <input
          v-if="userInfo.authenticationType == AuthenticationType.Email"
          v-model="form.password"
          type="text"
          maxlength="6"
          placeholder="邮件验证码"
          id="emailCode-input"
          @keydown="handleKeyDown"
        />
        <div
          class="user-icon"
          @click="sure()"
          v-if="userInfo.authenticationType !== AuthenticationType.Null"
        >
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
  // justify-content: center;
  align-items: center;
  height: 100px;

  input {
    padding: 0 50px 0 22px;
    width: 100%;
    max-width: 400px;
    height: 45px;
    border: 1px solid #86868b;
  }

  .user-icon {
    user-select: none;
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
    user-select: none;
    cursor: not-allowed;
    animation: rotate 3s linear infinite;
  }

  .icon-button {
    user-select: none;
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
      animation: user 2s forwards;
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
