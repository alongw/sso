<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { message } from 'ant-design-vue'

import { getUserInfo } from '@/api/user'

import type { User } from '@/types/user'

defineOptions({
  name: 'EditUsernamePage'
})

const userInfo = ref<User>()

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
    title="编辑头像"
    sub-title="编辑用户信息"
    @back="$router.push('/console/info')"
  />
  <a-card class="console-card">
    <a-skeleton :loading="!userInfo?.uid">
      <a-space direction="vertical">
        <a-avatar :src="userInfo?.avatar" :size="64" />
        <h2>这是您当前的头像</h2>
      </a-space>

      <a-typography-paragraph>
        我们正在使用 Cravatar 作为头像服务，他可以直接同步 Gravatar
        的头像，因此如果您要设置或者更换头像，我们建议您直接前往 Gravatar
        官网进行设置，同步可能存在延迟
      </a-typography-paragraph>

      <a-typography-paragraph>
        该头像无论如何都会在您同意授权后传递给第三方应用程序，因此在设置时请注意，不要上传包含敏感信息的头像。即使您不授权给第三方应用程序，Gravatar
        也会在互联网上公开此头像，除此之外 Github 、OpenAI 、Wordpress 等程序也会使用 Gravatar
        作为头像服务
      </a-typography-paragraph>

      <a-button type="primary" href="https://gravatar.com/" target="_black">前往 Gravatar</a-button>
    </a-skeleton>
  </a-card>
</template>
