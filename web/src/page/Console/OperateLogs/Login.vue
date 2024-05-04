<script setup lang="ts">
import { onMounted, ref } from 'vue'

import dayjs from 'dayjs'

import { message } from 'ant-design-vue'

import { getLoginLogs as getLoginLogsApi } from '@/api/logs'

interface LoginLog {
  login_id: number
  login_ip: string
  login_time: number
  login_type: string
  login_result: boolean
  login_ua: string
  login_use_captcha: boolean
}

defineOptions({
  name: 'ConsoleLogsLoginPage'
})
const loading = ref(true)

const dataSource = ref<LoginLog[]>()

const columns = [
  {
    title: '登录编号',
    dataIndex: 'login_id',
    key: 'login_id',
    align: 'center'
  },
  {
    title: '登录时间',
    dataIndex: 'login_time',
    key: 'login_time',
    align: 'center',
    customRender: ({ text }: { text: number }) => {
      return dayjs(text).format('YYYY-MM-DD HH:mm')
    }
  },
  {
    title: '登录 IP',
    dataIndex: 'login_ip',
    key: 'login_ip',
    align: 'center'
  },
  {
    title: '登录类型',
    dataIndex: 'login_type',
    key: 'login_type',
    align: 'center'
  },
  {
    title: '登录结果',
    dataIndex: 'login_result',
    key: 'login_result',
    align: 'center',
    customRender: ({ text }: { text: boolean }) => {
      return text ? '成功' : '失败'
    }
  },
  {
    title: '登录 User-Agent',
    dataIndex: 'login_ua',
    key: 'login_ua',
    align: 'center'
  }
]

onMounted(async () => {
  const { data: result } = await getLoginLogsApi({
    max_number: 30
  })
  if (result.status !== 200) {
    return message.error('获取登录日志失败')
  }
  dataSource.value = result.data
  loading.value = false
})
</script>

<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="登录日志"
    sub-title="您在 Nya Account 中的登录日志"
    @back="$router.push('/console/logs')"
  />

  <a-card class="console-card">
    <h2>您近期的登录日志</h2>

    <a-typography-paragraph> 该页面较为复杂，建议使用电脑端查看。 </a-typography-paragraph>

    <a-space direction="vertical" style="width: 100%">
      <a-alert message="仅支持查询最近30条的登录日志，如有需要，请联系技术支持人员。" type="info" />
      <a-alert
        message="关于早期登录日志"
        description="早期登录日志（2024.5.5 前）的登录结果显示在登录类型中，请自行分辨，更早期的登录日志（约 2024.3.29 前）没有记录登录失败的日志。"
        type="warning"
      />
    </a-space>

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
