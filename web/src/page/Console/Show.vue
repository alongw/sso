<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ConsoleTitleComponent from '@/components/console/Title.vue'
import { message } from 'ant-design-vue'
import { getUserInfo } from '@/api/user'

import type { User } from '@/types/user'

defineOptions({
  name: 'ConsoleShowPage'
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
  <console-title-component title="展示设置" desc="您在 Nya Account 中的展示设置" />

  <a-card class="console-card">
    <a-skeleton :loading="!userInfo?.uid">
      <h2>关于展示</h2>

      <a-typography-paragraph>
        我们不会主动公开您的任何信息，所有展示内容由您本人在授权时进行选择，具体授权信息请前往
        <a-typography-link href="https://account.lolinya.net/docs/user.html" target="_blank">
          用户文档
        </a-typography-link>
        查看权限对照表。
      </a-typography-paragraph>

      <a-typography-paragraph>
        但是需要注意，您的基础信息无论如何，只要授权了第三方应用程序，都会公开，无法拒绝。基础信息包括您的用户唯一标识符、用户状态、用户昵称和用户头像。
      </a-typography-paragraph>

      <a-typography-paragraph>
        您的每次一次授权，都会将您授权后的信息保存，授权给第三方应用程序。因此如果在授权后修改了用户信息，必须在重新授权后才能使新的信息生效。但是若第三方应用程序不会重新获取或保存您的信息，那么您的信息将不会被更新。
      </a-typography-paragraph>

      <h2>你的账号唯一标识符</h2>
      <a-typography-paragraph copyable>{{ userInfo?.uid || '未知' }}</a-typography-paragraph>

      <a-typography-paragraph>
        正常情况下第三方应用程序获取到的 ID 可能与此不同，因为我们针对不同的应用程序生成了不同的
        ID，以保证您的隐私安全。
      </a-typography-paragraph>
    </a-skeleton>
  </a-card>
</template>
