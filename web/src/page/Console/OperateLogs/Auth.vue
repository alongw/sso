<script setup lang="ts">
import { onMounted, ref } from 'vue'

import dayjs from 'dayjs'

import { message } from 'ant-design-vue'

import { getAuthLogs as getAuthLogsApi } from '@/api/logs'

interface AuthLog {
  auth_id: number
  auth_appid: string
  auth_ip: string
  auth_time: number
  auth_expire: number
  auth_ua: string
  auth_use: boolean
}

defineOptions({
  name: 'ConsoleLogsLoginPage'
})
const loading = ref(true)

const dataSource = ref<AuthLog[]>()

const columns = [
  {
    title: '授权时间',
    dataIndex: 'auth_time',
    key: 'auth_time',
    align: 'center',
    customRender: ({ text }: { text: number }) => {
      return dayjs(text).format('YYYY-MM-DD HH:mm')
    }
  },
  {
    title: '授权时用户 IP',
    dataIndex: 'auth_ip',
    key: 'auth_ip',
    align: 'center',
    customRender: ({ text }: { text: string }) => {
      return text.includes(',') ? text.split(',')[0] : text
    }
  },
  {
    title: '授权应用 ID',
    dataIndex: 'auth_appid',
    key: 'auth_appid',
    align: 'center'
  },
  {
    title: '授权应用实际使用情况',
    dataIndex: 'auth_use',
    key: 'auth_use',
    align: 'center',
    customRender: ({ text }: { text: boolean }) => {
      return text ? '已使用' : '未使用'
    }
  },
  {
    title: '授权时浏览器 User-Agent',
    dataIndex: 'auth_ua',
    key: 'auth_ua',
    align: 'center'
  }
]

onMounted(async () => {
  const { data: result } = await getAuthLogsApi({
    max_number: 30
  })
  if (result.status !== 200) {
    return message.error('获取授权日志失败')
  }
  dataSource.value = result.data
  loading.value = false
})
</script>

<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="授权日志"
    sub-title="您向其他应用程序授权的日志记录"
    @back="$router.push('/console/logs')"
  />

  <a-card class="console-card">
    <h2>您近期的授权日志</h2>

    <a-typography-paragraph> 该页面较为复杂，建议使用电脑端查看。 </a-typography-paragraph>

    <a-typography-paragraph>
      当您在授权界面点击确认授权，将创建授权记录。当您授权的应用使用了您的授权令牌，使用情况将变为已使用。
    </a-typography-paragraph>

    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      :scroll="{
        x: 'max-content'
      }"
      style="margin-top: 10px"
    />

    <p>最近 30 条登录记录，若需更多请联系技术人员</p>
  </a-card>
</template>
