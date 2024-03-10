<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import getCaptcha from 'nia-captcha'
import { message } from 'ant-design-vue'

import { getUserInfo, updateUserInfo, getEmailCode } from '@/api/user'
import type { User } from '@/types/user'
defineOptions({
  name: 'EditPasswordPage'
})

const steps = [
  {
    title: '验证身份',
    description: '接收电子邮箱验证码'
  },
  {
    title: '设置密码',
    description: '设置新的登录密码'
  },
  {
    title: '完成',
    description: '修改密码成功'
  }
]

const step = ref(0)

const form = ref({
  password: '',
  code: '',
  confirm: ''
})

const deadline = ref<number>()

const buttonLoading = ref(false)

const userInfo = ref<User>()

const fetch = async () => {
  userInfo.value = undefined
  const { data: result } = await getUserInfo()
  if (result.status !== 200) {
    return message.error('获取用户信息失败')
  }
  userInfo.value = result.data
}

const handleSubmit = async () => {
  if (!form.value.password || !form.value.confirm) {
    return message.error('请正确填写表单')
  }
  if (!form.value.code) {
    return message.error('请填写邮件验证码')
  }
  if (form.value.password !== form.value.confirm) {
    return message.error('两次密码不一致')
  }
  buttonLoading.value = true
  const { data: result } = await updateUserInfo({
    password: form.value.password,
    code: form.value.code
  })
  buttonLoading.value = false
  if (result.status !== 200) {
    return message.error(result.msg)
  }
  message.success('修改密码成功')
  step.value++
}

const handleGetCode = async () => {
  const captcha = await getCaptcha('2046626881')
  if (!captcha) {
    return
  }
  buttonLoading.value = true
  const { data: result } = await getEmailCode({
    email: userInfo.value?.email,
    randstr: captcha.randstr,
    ticket: captcha.ticket
  })
  buttonLoading.value = false
  if (result.status !== 200) {
    return message.error(result.msg)
  }
  message.success('验证码发送成功')
  deadline.value = dayjs().add(60, 'second').valueOf()
}

const onFinish = () => {
  deadline.value = undefined
}

onMounted(async () => {
  await fetch()
})
</script>

<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="修改密码"
    sub-title="编辑隐私信息"
    @back="$router.push('/console/secrecy')"
  />

  <a-card class="console-card">
    <a-skeleton :loading="!userInfo?.uid">
      <h2>{{ userInfo?.password ? '您当前已经设置密码 ' : '您尚未设置密码' }}</h2>

      <a-typography-paragraph>
        您的密码仅能用于登录 Nya
        Account，不能用于登录其他网站。当您设置密码后，在登录时系统将自动进行安全评估，安全评估达到足够分数后会自动提示使用密码登录，而不是电子邮箱验证码。（该过程无法手动干预）
      </a-typography-paragraph>
    </a-skeleton>
  </a-card>

  <a-card class="console-card">
    <a-skeleton :loading="!userInfo?.uid">
      <h2>修改密码</h2>

      <a-steps :current="step" :items="steps"></a-steps>

      <a-space direction="vertical">
        <li v-show="step === 0">
          <a-typography-paragraph style="margin-top: 25px">
            由于涉及隐私操作，本次操作需要验证码
          </a-typography-paragraph>

          <a-typography-paragraph> 您当前的主邮箱：{{ userInfo?.email }} </a-typography-paragraph>

          <a-space>
            <a-input v-model:value="form.code" placeholder="邮箱验证码" />
            <a-button
              type="primary"
              :loading="buttonLoading"
              :disabled="deadline"
              @click="handleGetCode"
            >
              获取验证码
            </a-button>
            <div class="time" v-show="deadline">
              <a-statistic-countdown :value="deadline" @finish="onFinish" format="s" />
            </div>
          </a-space>
        </li>

        <li v-show="step === 1">
          <h2>设置新的登录密码</h2>

          <a-space direction="vertical" style="margin-bottom: 15px">
            <a-input-password v-model:value="form.password" placeholder="新的登录密码" />
            <a-input v-model:value="form.confirm" placeholder="确认密码" />
            <a-button block type="primary" @click="handleSubmit" :loading="buttonLoading">
              提交
            </a-button>
          </a-space>
        </li>

        <li v-show="step === 2">
          <a-result
            style="margin: 0 auto"
            status="success"
            title="密码修改成功"
            sub-title="当您再次登录时，请使用新的密码登录"
          >
            <template #extra>
              <a-button type="primary" @click="$router.push('/console/secrecy')">
                返回控制台
              </a-button>
              <a-button @click="$router.push('/loginout')">退出登录</a-button>
            </template>
          </a-result>
        </li>

        <a-space v-show="step < 2">
          <a-button :disabled="step <= 0" @click="step--"> 上一步 </a-button>
          <a-button type="primary" :disabled="step >= steps.length - 2" @click="step++">
            下一步
          </a-button>
        </a-space>
      </a-space>
    </a-skeleton>
  </a-card>
</template>

<style scoped lang="less">
::v-deep .ant-statistic-content-value,
::v-deep .ant-statistic-content {
  font-size: 14px !important;
}

.ant-space {
  width: 100%;
}
</style>
