<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import { EditOutlined } from '@ant-design/icons-vue'

import { getUserInfo } from '@/api/user'

import { useUserInfo } from '@/hook/useUserInfo'

const prop = defineProps({
  title: {
    type: String,
    default: ''
  }
})

defineOptions({
  name: 'InfoComponent'
})

const userInfo = reactive({
  uid: '',
  username: '',
  email: '',
  status: 0,
  nickname: '',
  group: '',
  createTime: '',
  password: false,
  avatar: ''
})

const { open, editEmail, editNickname, editPassword, getEmailCode, getEmailCode1, getEmailCode2 } =
  useUserInfo()

enum dialogType {
  nickname = 'nickname',
  email = 'email',
  password = 'password'
}

const inputValue = reactive({
  nickname: '',
  email: '',
  password: '',
  code: '',
  password2: '',
  code2: ''
})

const dialog = ref<dialogType>(dialogType.nickname)

const handleOpen = (type: dialogType) => {
  dialog.value = type
  open.value = true
}

const loading = ref(false)

const clear = () => {
  inputValue.nickname = ''
  inputValue.email = ''
  inputValue.password = ''
  inputValue.code = ''
  inputValue.password2 = ''
  inputValue.code2 = ''
}

const handleOk = async () => {
  loading.value = true
  if (dialog.value === dialogType.nickname) {
    const result = await editNickname(inputValue.nickname)
    if (result) {
      open.value = false
      clear()
      await fetch()
    }
  }
  if (dialog.value === dialogType.email) {
    const result = await editEmail(inputValue.email, inputValue.code, inputValue.code2)
    if (result) {
      open.value = false
      clear()
      await fetch()
    }
  }
  if (dialog.value === dialogType.password) {
    const result = await editPassword(inputValue.password, inputValue.password2, inputValue.code)
    if (result) {
      open.value = false
      clear()
      await fetch()
    }
  }
  loading.value = false
}

const fetch = async () => {
  const res = await getUserInfo()
  userInfo.uid = res.data.data.uid
  userInfo.username = res.data.data.username
  userInfo.email = res.data.data.email
  userInfo.status = res.data.data.status
  userInfo.nickname = res.data.data.nickname
  userInfo.group = res.data.data.group
  userInfo.createTime = res.data.data.createTime
  userInfo.password = res.data.data.password
  userInfo.avatar = res.data.data.avatar
}

const handleCancel = () => {
  open.value = false
  clear()
}

onMounted(async () => {
  await fetch()
})
</script>

<template>
  <a-typography-title :level="2">{{ prop.title }}</a-typography-title>
  <a-spin :spinning="!userInfo.createTime" size="large">
    <div class="box">
      <a-form-item>
        <a-typography-title :level="3">用户身份标识</a-typography-title>
        <a-typography-paragraph type="secondary"> 用户身份标识信息 </a-typography-paragraph>

        <div class="item">
          用户名：
          <a-typography-text copyable>
            {{ userInfo.username ? userInfo.username : '未设置用户名' }}

            <a-tooltip placement="top">
              <template #title>
                <span>Edit</span>
              </template>
              <a-button
                type="link"
                size="small"
                @click="
                  $router.push({
                    path: '/user/perfect',
                    query: {
                      from: 'user.info.uid.edit.button'
                    }
                  })
                "
                ><EditOutlined
              /></a-button>
            </a-tooltip>
          </a-typography-text>
        </div>

        <div class="item">
          UID：
          <a-typography-text copyable>
            {{ userInfo.uid }}
          </a-typography-text>
        </div>

        <div class="item">
          账号状态：
          <a-typography-text copyable>
            {{ userInfo.status }}
          </a-typography-text>
        </div>

        <div class="item">
          用户组：
          <a-typography-text copyable>
            {{ userInfo.group }}
          </a-typography-text>
        </div>

        <div class="item">
          创建时间：
          <a-typography-text copyable>
            {{ userInfo.createTime }}
          </a-typography-text>
        </div>

        <a-typography-title :level="3">基本信息</a-typography-title>
        <a-typography-paragraph type="secondary"> 用户信息 </a-typography-paragraph>
        <div class="item">
          <a-card title="昵称" style="width: 100%">
            <template #extra>
              <a-button @click="handleOpen(dialogType.nickname)" type="link"> 修改 </a-button>
            </template>
            <p v-if="userInfo.nickname">{{ userInfo.nickname }}</p>
            <p v-else><a-tag color="orange">未设置昵称</a-tag></p>
          </a-card>
        </div>

        <div class="item">
          <a-card title="邮箱" style="width: 100%">
            <template #extra>
              <a-button @click="handleOpen(dialogType.email)" type="link">修改</a-button>
            </template>
            <p>{{ userInfo.email }}</p>
          </a-card>
        </div>

        <div class="item">
          <a-card title="密码" style="width: 100%">
            <template #extra>
              <a-button @click="handleOpen(dialogType.password)" type="link">修改</a-button>
            </template>
            <p v-if="userInfo.password"><a-tag color="green">已设置密码</a-tag></p>
            <p v-else><a-tag color="orange">未设置密码</a-tag></p>
          </a-card>
        </div>

        <div class="item">
          <a-card title="头像" style="width: 100%">
            <template #extra>
              <a-button type="link" href="https://cn.gravatar.com/" target="_black">修改</a-button>
            </template>
            <span>您当前的头像：</span><a-avatar :src="userInfo.avatar" />
            <p>我们使用的是 Cravatar 的头像源，您可以直接在相应站点进行设置</p>
            <p>但是我们仍建议您直接设置 Gravatar 的头像，因为 Cravatar 可以直接同步</p>
          </a-card>
        </div>
      </a-form-item>
    </div>
  </a-spin>
  <a-modal
    v-model:open="open"
    title="修改信息"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="loading"
  >
    <div v-if="dialog === dialogType.nickname">
      <h1>修改昵称</h1>
      <a-input v-model:value="inputValue.nickname" placeholder="新的用户名" />
    </div>
    <div v-if="dialog === dialogType.email">
      <h1>修改邮箱</h1>
      <a-space direction="vertical" style="width: 100%">
        <p>由于涉及敏感操作，本次操作需要验证码</p>
        <a-input v-model:value="inputValue.code" placeholder="旧邮箱验证码" />
        <a-button type="primary" @click="getEmailCode(1)" :loading="getEmailCode1"
          >获取验证码</a-button
        >
        <a-input v-model:value="inputValue.email" placeholder="新的邮箱" />
        <a-input
          v-model:value="inputValue.code2"
          placeholder="新邮箱验证码"
          :loading="getEmailCode2"
        />
        <a-button type="primary" @click="getEmailCode(2, inputValue.email)">获取验证码</a-button>
      </a-space>
    </div>

    <div v-if="dialog === dialogType.password">
      <a-space direction="vertical" style="width: 100%">
        <p>由于涉及敏感操作，本次操作需要验证码</p>
        <a-input v-model:value="inputValue.code" placeholder="邮箱验证码" />
        <a-button type="primary" @click="getEmailCode(1)" :loading="getEmailCode1">
          获取验证码
        </a-button>
        <a-input-password v-model:value="inputValue.password" placeholder="新密码（6-30位）" />
        <a-input-password v-model:value="inputValue.password2" placeholder="请再次输入" />
      </a-space>
    </div>
  </a-modal>
</template>

<style scoped lang="less">
.box {
  .item {
    display: flex;
    align-items: center;
    margin: 3px 0;
  }
}
</style>
