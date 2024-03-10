<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { message } from 'ant-design-vue'

import { getUserInfo, updateUserInfo } from '@/api/user'

import type { User } from '@/types/user'

defineOptions({
  name: 'EditUsernamePage'
})

const form = ref({
  username: ''
})

const userInfo = ref<User>()

const updateButtonLoading = ref(false)

const handleSubmit = async () => {
  if (!form.value.username) {
    return message.error('请正确填写表单')
  }
  updateButtonLoading.value = true
  const { data: result } = await updateUserInfo({
    nickname: form.value.username
  })
  updateButtonLoading.value = false
  if (result.status !== 200) {
    return message.error(result.msg)
  }
  form.value.username = ''
  message.success('更新成功')
  await fetch()
}

const fetch = async () => {
  userInfo.value = undefined
  const { data: result } = await getUserInfo()
  if (result.status !== 200) {
    return message.error('获取用户信息失败')
  }
  userInfo.value = result.data
}

onMounted(async () => {
  await fetch()
})
</script>

<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="编辑昵称"
    sub-title="编辑用户信息"
    @back="$router.push('/console/info')"
  />
  <a-card class="console-card">
    <a-skeleton :loading="!userInfo?.uid">
      <h1>
        您当前的昵称：{{ userInfo?.nickname }}
        <a-tag v-if="!userInfo?.nickname" color="warning">未设置昵称</a-tag>
      </h1>

      <a-typography-paragraph>
        您的显示昵称将作为授权第三方程序时的用户名使用，强烈建议设置。在您授权登录第三方程序时，会将昵称作为用户名传递给第三方程序。因此您在第三方程序看到的用户名应该为此昵称。修改后，需要重新授权第三方程序才能使第三方程序看到新的昵称。但是如果第三方程序在重新授权后不会更新您的个人信息（昵称），那么您在第三方程序看到的用户名将不会改变
      </a-typography-paragraph>

      <a-typography-paragraph>
        该昵称无论如何都会在您同意授权后传递给第三方应用程序，因此在设置时请注意安全，不要将隐私信息（如姓名、个人纳税识别号等）设置为昵称
      </a-typography-paragraph>

      <a-space direction="vertical">
        <p>更新昵称</p>
        <a-space wrap>
          <a-input v-model:value="form.username" placeholder="请输入新的昵称" />
          <a-button type="primary" @click="handleSubmit" :loading="updateButtonLoading">
            更新
          </a-button>
        </a-space>
      </a-space>
    </a-skeleton>
  </a-card>
</template>
