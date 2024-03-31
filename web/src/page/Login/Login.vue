<!-- 这谁写的啊，这么勾史。没见过这么勾史的代码！！ -->

<script setup lang="ts">
// import { h } from 'vue'
import ModalBoxComponents from '@/components/ModalBox.vue'
import { ArrowCircleRight, LoadingOne } from '@icon-park/vue-next'
import { browserSupportsWebAuthn, startAuthentication } from '@simplewebauthn/browser'
import getCaptcha from 'nia-captcha'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
// import { QqOutlined, WechatOutlined } from '@ant-design/icons-vue'
import _ from 'lodash'
import { useLogin } from '@/hook/useLogin'
import { getAccountStatus, register as registerApi, login as loginApi } from '@/api/login'
defineOptions({
  name: 'LoginPage'
})

const router = useRouter()
const route = useRoute()

const {
  AuthenticationType,
  userInfo,
  showPasswordInput,
  startAnimation,
  title,
  loading,
  form,
  captcha,
  avatarUrl,
  showAuthnActionButton,
  authnButtingLoading
} = useLogin()

const submit = async (notUseAuthn?: boolean) => {
  if (!form.user || form.user === '') return message.error('请正确填写表单')
  authnButtingLoading.value = true
  loading.user = true

  const res = await getAccountStatus({
    email: _.trim(form.user),
    captcha: captcha,
    notUseAuthn: notUseAuthn || false
  })

  if (res.data.status === 418) {
    return (loading.user = false)
  }

  // 需要验证码
  if (res.data.status === 422) {
    loading.user = false
    authnButtingLoading.value = false
    const captchaCallback = await getCaptcha('2046626881')
    captcha.randstr = captchaCallback.randstr
    captcha.ticket = captchaCallback.ticket
    submit(notUseAuthn)
  }

  captcha.randstr = ''
  captcha.ticket = ''

  if (res.data.status !== 200) {
    if (res.data.status === 422) return
    loading.user = false
    return message.error(res.data.msg)
  }

  avatarUrl.value = res.data.data.avatar || 'logo'
  userInfo.username = res.data.data.username || ''
  userInfo.authenticationType = res.data.data.authenticationType || AuthenticationType.Null
  userInfo.captcha = res.data.data.captcha || false
  userInfo.isRegister = res.data.data.isRegister || false
  userInfo.tips = res.data.data.tips || ''
  userInfo.options = res.data.data.options || {}

  // 仅当需要输入第二个输入框时
  if (
    userInfo.authenticationType === AuthenticationType.Password ||
    userInfo.authenticationType === AuthenticationType.Email
  ) {
    showPasswordInput()
    showAuthnActionButton.value = false

    // 获取焦点
    setTimeout(() => {
      if (userInfo.authenticationType === AuthenticationType.Password) {
        const passwordInput = document.querySelector('#password-input')
        if (passwordInput instanceof HTMLElement) passwordInput.focus()
      } else if (userInfo.authenticationType === AuthenticationType.Email) {
        const emailCodeInput = document.querySelector('#emailCode-input')
        if (emailCodeInput instanceof HTMLElement) emailCodeInput.focus()
      }
    }, 500)
  }

  // 处理使用外部验证器登录
  if (userInfo.authenticationType === AuthenticationType.Authn) {
    // 判断浏览器是否支持使用外部验证器登录
    if (!browserSupportsWebAuthn()) {
      submit(true)
    }

    showAuthnActionButton.value = true

    // 开始使用外部验证器登录
    let asseResp
    try {
      asseResp = await startAuthentication((userInfo as any).options)
    } catch (error: any) {
      console.error(`外部验证器登录失败，详细信息：${error}`)
      authnButtingLoading.value = false
      return message.warning('授权失败')
    }
    // 获取登录结果
    const { data: resultAuthn } = await loginApi({
      type: 'authenticator',
      userinput: _.trim(form.user),
      codeinput: _.trim(form.password),
      keep: form.keepLogin,
      authn: asseResp
    })

    if (resultAuthn.status !== 200) {
      authnButtingLoading.value = false
      return message.error(resultAuthn.msg)
    }
    message.success('登录成功')
    showAuthnActionButton.value = false
    window.localStorage.setItem('token', resultAuthn.data.token)
    window.localStorage.setItem('expire', resultAuthn.data.expire.toString())
    setTimeout(() => {
      router.push({
        path: route.query.client_id ? '/authorize' : '/console',
        query: {
          ...route.query,
          form: 'login.page.login'
        }
      })
    }, 500)
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
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
      path: route.query.client_id ? '/authorize' : '/console',
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
          :autofocus="true"
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

      <!-- 外部验证器选项 -->
      <div v-if="showAuthnActionButton" class="authn-acti">
        <a-spin :spinning="authnButtingLoading">
          <a-space>
            <a-button type="link" @click="submit()"> 再次尝试 </a-button>
            <a-button type="link" @click="submit(true)"> 使用其他验证方式 </a-button>
          </a-space>
        </a-spin>
      </div>

      <!-- 第三方登录 -->
      <!-- <div
        v-if="userInfo.authenticationType === AuthenticationType.Null"
        class="oauth-button-group"
      >
        <a-space direction="vertical">
          <p>或使用以下第三方登录方式</p>
          <ul>
            <a-button
              type="text"
              shape="circle"
              class="oauth-button"
              :icon="
                h(QqOutlined, {
                  style: {
                    fontSize: '14px'
                  }
                })
              "
            />

            <a-button
              type="text"
              shape="circle"
              class="oauth-button"
              :icon="
                h(WechatOutlined, {
                  style: {
                    fontSize: '14px'
                  }
                })
              "
            />
          </ul>
        </a-space>
      </div> -->

      <div class="password" :style="startAnimation">
        <input
          v-if="userInfo.authenticationType == AuthenticationType.Password"
          v-model="form.password"
          type="password"
          maxlength="32"
          placeholder="密码"
          autofocus
          id="password-input"
          @keydown="handleKeyDown"
        />
        <input
          v-if="userInfo.authenticationType == AuthenticationType.Email"
          v-model="form.password"
          type="text"
          maxlength="6"
          autofocus
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
  align-items: center;
  height: 100px;

  input {
    padding: 0 50px 0 22px;
    width: 100%;
    max-width: 400px;
    height: 45px;
    border: 1px solid #86868b;
  }

  .oauth-button-group {
    margin: 10px auto 0;
    text-align: center;
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
