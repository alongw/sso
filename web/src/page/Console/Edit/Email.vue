<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useEditEmail } from '@/hook/console/useEditEmail'
import validator from 'validator'
import { message } from 'ant-design-vue'
import getCaptcha from 'nia-captcha'

defineOptions({
  name: 'ConsoleEditEmail'
})

const {
  getUserInfo,
  getEmailCode,
  updateUserInfo,
  userInfo,
  publicStep,
  publicForm,
  publicCodeButtonLoading,
  publicSubmitButtonLoading,

  accountStep,
  accountCodeButtonLoading,
  accountSubmitButtonLoading,
  accountForm
} = useEditEmail()

const public_carousel = ref()

const account_carousel = ref()

const handlePublicNext = () => {
  if (!validator.isEmail(publicForm.value.email)) {
    return message.error('请输入正确的邮箱地址')
  }
  publicStep.value++
}

const handlePublicGetCode = async () => {
  const captcha = await getCaptcha('2046626881')
  if (!captcha) {
    return
  }
  publicCodeButtonLoading.value = true
  await getEmailCode({
    email: publicForm.value.email,
    ticket: captcha.ticket,
    randstr: captcha.randstr
  })
  publicCodeButtonLoading.value = false
}

const handlePublicSubmit = async () => {
  if (!publicForm.value.code) {
    return message.error('请输入验证码')
  }
  publicSubmitButtonLoading.value = true
  await updateUserInfo({
    public_email: publicForm.value.email,
    code: publicForm.value.code
  })
  publicSubmitButtonLoading.value = false
}

const handleAccountGetCode = async () => {
  const captcha = await getCaptcha('2046626881')
  if (!captcha) {
    return
  }
  accountCodeButtonLoading.value = true
  await getEmailCode({
    ticket: captcha.ticket,
    randstr: captcha.randstr
  })
  accountCodeButtonLoading.value = false
}

const handleAccountNext = () => {
  if (!accountForm.value.code) {
    return message.error('请输入验证码')
  }
  accountStep.value++
}

const handleAccountEmailNext = () => {
  if (!validator.isEmail(accountForm.value.email)) {
    return message.error('请输入正确的邮箱地址')
  }
  accountStep.value++
}

const handleAccountNewMailCode = async () => {
  const captcha = await getCaptcha('2046626881')
  if (!captcha) {
    return
  }
  accountCodeButtonLoading.value = true
  await getEmailCode({
    email: accountForm.value.email,
    ticket: captcha.ticket,
    randstr: captcha.randstr
  })
  accountCodeButtonLoading.value = false
}

const handleAccountSubmit = async () => {
  if (!accountForm.value.code2) {
    return message.error('请输入验证码')
  }
  accountSubmitButtonLoading.value = true
  await updateUserInfo({
    email: accountForm.value.email,
    code: accountForm.value.code,
    code2: accountForm.value.code2
  })
  accountSubmitButtonLoading.value = false
  accountStep.value++
}

const handlePublicBack = async () => {
  public_carousel?.value.prev()
  await fetch()
}
const fetch = async () => {
  userInfo.value = undefined
  await getUserInfo()
}

onMounted(async () => {
  await fetch()
})
</script>

<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="编辑邮箱 "
    sub-title="编辑隐私信息"
    @back="$router.push('/console/secrecy')"
  />

  <a-card class="console-card">
    <a-skeleton :loading="!userInfo?.uid">
      <h2>概念须知</h2>

      <a-typography-paragraph>
        个人电子邮箱是您在本站的重要凭证之一，它将作为您的登录凭证之一，或者说是证明您本人身份的唯一凭证。这份凭证不但拥有者极强的重要性，并且也拥有着极强的隐私性。因此您在授权登录第三方应用程序时应当慎重对待您的邮箱信息，虽然我们默认勾选了该项，但是也请您核实开发者身份后再进行授权操作。
      </a-typography-paragraph>

      <a-typography-paragraph>
        正因如此，我们也提供了多邮箱的功能。您可以在此处自行设置登录时用于证明身份的邮箱，也可以设置授权时用于传递给第三方应用程序的邮箱。但是请注意，第三方应用处的邮箱仅当重新授权时才会更新。因此如果您在授权第三方应用后修改了邮箱，那么您需要重新授权第三方应用程序才能使第三方应用程序看到新的邮箱。如果第三方应用在重新授权后不会更新您的个人信息如名字、邮箱等，那么您在第三方应用看到的邮箱将不会改变。
      </a-typography-paragraph>
    </a-skeleton>
  </a-card>

  <a-card class="console-card">
    <a-skeleton :loading="!userInfo?.uid">
      <h2>对外邮箱设置</h2>

      <a-carousel ref="public_carousel" :dots="false">
        <!-- 第一页 -->
        <li>
          <a-typography-paragraph>
            您的对外邮箱将作为授权第三方程序时的邮箱使用，强烈建议设置。在您授权登录第三方程序时，会将此项作为邮箱传递给第三方程序。如果您没有设置，那么第三方应用获取到的邮箱将为您的登录邮箱。修改后，需要重新授权第三方程序才能使第三方程序看到新的邮箱。但是如果第三方程序在重新授权后不会更新您的个人信息，那么您在第三方程序看到的邮箱将不会改变。
          </a-typography-paragraph>

          <h2>你当前的对外邮箱：{{ userInfo?.public_email || userInfo?.email || '未知' }}</h2>

          <a-typography-paragraph>
            <p v-if="!userInfo?.public_email">
              你还没有设置对外专用的电子邮件地址，因此你当前设置的对外邮箱就是账户的主要电子邮件地址
            </p>
          </a-typography-paragraph>

          <a-button type="primary" @click="public_carousel?.next()"> 修改对外邮箱 </a-button>
        </li>

        <!-- 第二页 -->
        <li>
          <a-typography-paragraph>
            为确保邮箱为你本人在使用，因此在设置时，需要对其进行身份验证
          </a-typography-paragraph>
          <a-steps :current="publicStep">
            <a-step title="键入新邮箱" />
            <a-step title="接收验证码" />
            <a-step title="完成修改" />
          </a-steps>

          <div class="item" style="margin-top: 25px">
            <!-- 键入新邮箱 -->
            <li v-show="publicStep === 0">
              <a-space direction="vertical" style="width: 100%">
                <a-input v-model:value="publicForm.email" placeholder="请输入新的对外邮箱" />
                <a-button type="primary" @click="handlePublicNext">下一步</a-button>
              </a-space>
            </li>

            <!-- 接收验证码 -->
            <li v-show="publicStep === 1">
              <a-space direction="vertical" style="width: 100%">
                <a-input v-model:value="publicForm.code" placeholder="请输入验证码" />
                <a-space>
                  <a-button @click="handlePublicGetCode" :loading="publicCodeButtonLoading"
                    >获取验证码</a-button
                  >
                  <a-button
                    type="primary"
                    @click="handlePublicSubmit"
                    :loading="publicSubmitButtonLoading"
                    >下一步</a-button
                  >
                </a-space>
              </a-space>
            </li>

            <!-- 完成修改 -->
            <li v-show="publicStep === 2">
              <a-result
                style="margin: 0 auto"
                status="success"
                title="对外邮箱修改成功"
                sub-title="当您重新授权第三方应用程序时，第三方应用程序将得到新的对外邮箱"
              >
                <template #extra>
                  <a-button type="primary" @click="handlePublicBack"> 确定 </a-button>
                  <a-button @click="$router.push('/console/secrecy')">返回控制台</a-button>
                </template>
              </a-result>
            </li>
          </div>
        </li>
      </a-carousel>
    </a-skeleton>
  </a-card>

  <a-card class="console-card">
    <a-skeleton :loading="!userInfo?.uid" :dots="false" :dotPosition="null">
      <h2>账号绑定邮箱设置</h2>
      <a-carousel ref="account_carousel" :dots="false">
        <!-- 第一页 -->
        <li>
          <a-typography-paragraph>
            账号绑定邮箱是您身份的唯一证明，如更换，请及时修改
          </a-typography-paragraph>

          <a-typography-paragraph>
            <p>您当前的绑定邮箱：{{ userInfo?.email || '未知' }}</p>
          </a-typography-paragraph>

          <a-button type="primary" @click="account_carousel?.next()"> 修改邮箱 </a-button>
        </li>

        <!-- 第二页 -->
        <li>
          <a-steps :current="accountStep" style="margin-bottom: 25px">
            <a-step title="接收邮件验证码" />
            <a-step title="键入新邮箱" />
            <a-step title="效验新邮箱" />
            <a-step title="完成修改" />
          </a-steps>

          <div class="item">
            <!-- 接收邮件验证码 -->
            <li v-show="accountStep === 0">
              <a-typography-paragraph>
                为了确保您的安全，本次操作需要身份验证
              </a-typography-paragraph>

              <a-space direction="vertical" style="width: 100%; max-width: 300px">
                <a-input v-model:value="accountForm.code" placeholder="请输入邮件验证码" />
                <a-space>
                  <a-button @click="handleAccountGetCode" :loading="accountCodeButtonLoading">
                    获取验证码
                  </a-button>
                  <a-button type="primary" @click="handleAccountNext" :disabled="!accountForm.code">
                    下一步
                  </a-button>
                </a-space>
              </a-space>
            </li>

            <!-- 键入新邮箱 -->
            <li v-show="accountStep === 1">
              <a-space direction="vertical" style="width: 100%">
                <a-input v-model:value="accountForm.email" placeholder="请输入新的邮箱" />
                <a-space>
                  <a-button @click="accountStep--"> 上一步 </a-button>
                  <a-button
                    type="primary"
                    @click="handleAccountEmailNext"
                    :disabled="!accountForm.email"
                  >
                    下一步
                  </a-button>
                </a-space>
              </a-space>
            </li>

            <!-- 效验新邮箱 -->
            <li v-show="accountStep === 2">
              <a-typography-paragraph>
                为了确保新的邮箱属于您，我们需要对其进行身份验证
              </a-typography-paragraph>

              <a-space direction="vertical" style="width: 100%; max-width: 300px">
                <a-input v-model:value="accountForm.code2" placeholder="请输入新邮件验证码" />
                <a-space>
                  <a-button @click="accountStep--"> 上一步 </a-button>
                  <a-button @click="handleAccountNewMailCode" :loading="accountCodeButtonLoading">
                    获取验证码
                  </a-button>
                  <a-button
                    type="primary"
                    @click="handleAccountSubmit"
                    :disabled="!accountForm.code2"
                  >
                    确认修改
                  </a-button>
                </a-space>
              </a-space>
            </li>

            <!-- 完成修改 -->
            <li v-show="accountStep === 3">
              <a-result
                style="margin: 0 auto"
                status="success"
                title="邮箱修改成功"
                sub-title="当您重新授权第三方应用程序时，第三方应用程序将得到新的对外邮箱"
              >
                <template #extra>
                  <a-button type="primary" @click="$router.push('/console/secrecy')">
                    返回控制台
                  </a-button>
                  <a-button @click="$router.push('/loginout')">退出登录</a-button>
                </template>
              </a-result>
            </li>
          </div>
        </li>
      </a-carousel>
    </a-skeleton>
  </a-card>
</template>
