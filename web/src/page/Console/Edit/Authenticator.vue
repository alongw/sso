<script setup lang="ts">
import { ref } from 'vue'

import { useAuthn } from '@/hook/console/useAuthn'
import { onMounted } from 'vue'

defineOptions({
  name: 'ConsoleEditAuthenticatorPage'
})

const {
  authData,
  getAuthnList,
  columns,
  handleCreateAuthn,
  createMailCode,
  createName,
  getEmailCode,
  createBtnLoading,
  emailBtnLoading,
  open
} = useAuthn()

onMounted(async () => {
  await getAuthnList()
})
</script>

<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="外部验证器"
    sub-title="编辑外部验证器"
    @back="$router.push('/console/secrecy')"
  />

  <a-card class="console-card">
    <a-skeleton :loading="!authData">
      <h2>WebAuthn 验证器</h2>

      <a-typography-paragraph>
        使用外部验证器可以减少登录时间，提高安全性。每位用户最多添加 20 个外部验证器。
      </a-typography-paragraph>

      <a-typography-paragraph>
        WebAuthn 是万维网联盟（W3C）发布的一项网络标准。WebAuthn 是 FIDO 联盟指导下的 FIDO2
        项目的核心组成部分。
        该项目旨在使用公钥加密技术将用户认证网络应用程序和服务的接口标准化。WebAuthn 凭证（本身就是
        FIDO 凭证）有时也被称为通行密钥。
        <a-typography-link href="https://en.wikipedia.org/wiki/WebAuthn" target="_blank">
          维基百科
        </a-typography-link>
      </a-typography-paragraph>
    </a-skeleton>
  </a-card>

  <a-card class="console-card">
    <a-skeleton :loading="!authData">
      <h2>我的外部验证器</h2>
      <a-button type="primary" @click="open = !open">添加新验证器</a-button>

      <a-table :data-source="authData" :columns="columns" :pagination="false" />
    </a-skeleton>
  </a-card>

  <a-modal
    v-model:open="open"
    title="创建验证器"
    :confirmLoading="createBtnLoading"
    @ok="handleCreateAuthn"
  >
    <a-space direction="vertical">
      <a-form-item label="验证器名称">
        <a-input v-model:value="createName" :maxlength="16" autofocus />
        <p>验证器名称不得超过16个字符</p>
      </a-form-item>
      <a-typography-paragraph> 由于涉及敏感参照，本次操作需要验证码 </a-typography-paragraph>
      <a-form-item label="邮件验证码">
        <a-space>
          <a-input v-model:value="createMailCode" />
          <a-button type="primary" :loading="emailBtnLoading" @click="getEmailCode">
            获取验证码
          </a-button>
        </a-space>
      </a-form-item>
    </a-space>
  </a-modal>
</template>
