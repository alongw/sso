<script setup lang="ts">
import { onMounted, reactive } from 'vue'

import { EditOutlined } from '@ant-design/icons-vue'

import { getUserInfo } from '@/api/user'

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
  password: false
})

onMounted(async () => {
  const res = await getUserInfo()
  userInfo.uid = res.data.data.uid
  userInfo.username = res.data.data.username
  userInfo.email = res.data.data.email
  userInfo.status = res.data.data.status
  userInfo.nickname = res.data.data.nickname
  userInfo.group = res.data.data.group
  userInfo.createTime = res.data.data.createTime
  userInfo.password = res.data.data.password
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
            <template #extra><a href="#">修改</a></template>
            <p v-if="userInfo.nickname">{{ userInfo.nickname }}</p>
            <p v-else><a-tag color="orange">未设置昵称</a-tag></p>
          </a-card>
        </div>

        <div class="item">
          <a-card title="邮箱" style="width: 100%">
            <template #extra><a href="#">修改</a></template>
            <p>{{ userInfo.email }}</p>
          </a-card>
        </div>

        <div class="item">
          <a-card title="密码" style="width: 100%">
            <template #extra><a href="#">修改</a></template>
            <p v-if="userInfo.password"><a-tag color="green">已设置密码</a-tag></p>
            <p v-else><a-tag color="orange">未设置密码</a-tag></p>
          </a-card>
        </div>
      </a-form-item>
    </div>
  </a-spin>
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
