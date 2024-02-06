<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

import ApplicationModalComponent from '@/components/ApplicationModal.vue'

import { getAppList, status, onClose, open, onOpen, type StatusType } from '@/hook/useApplication'

import { createApp as createAppApi } from '@/api/application'

import getCaptcha from 'nia-captcha'

defineProps({
  title: String
})

defineOptions({
  name: 'ApplicationComponent'
})

const columns = [
  {
    title: 'Appid',
    dataIndex: 'appid',
    key: 'appid'
  },
  {
    title: '应用名称',
    dataIndex: 'name',
    key: 'name',
    customRender: (e: { text: string }) => {
      return e.text || '-'
    }
  },
  {
    title: '应用描述',
    dataIndex: 'description',
    key: 'description',
    customRender: (e: { text: string }) => {
      return e.text || '-'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    customRender: (e: { text: string }) => {
      return e.text ? dayjs(e.text).format('YYYY-MM-DD') : '-'
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation'
  }
]

const dataSource = ref([])

const selectAppid = ref('')

const handleOpen = (appid: string) => {
  selectAppid.value = appid
  onOpen()
}

const btnloading = ref(false)

const handleClose = async () => {
  onClose()
  await fetch()
}

const handleSave = async () => {
  btnloading.value = true
  await editRef.value?.update()
  btnloading.value = false
  await fetch()
}

const loading = ref(false)

const editRef = ref()

const fetch = async () => {
  loading.value = true
  const data = await getAppList()
  dataSource.value = data
  loading.value = false
}

const createOpen = ref(false)
const createInput = ref('')
const create = async () => {
  if (createInput.value === '') return message.error('请输入应用名称')
  const captcha = await getCaptcha('2046626881')
  btnloading.value = true
  const { data: result } = await createAppApi({
    name: createInput.value,
    ticket: captcha.ticket,
    randstr: captcha.randstr
  })
  btnloading.value = false
  if (result.status !== 200) return message.error(result.msg)
  await fetch()
  createOpen.value = false
  return message.success(result.msg)
}

onMounted(async () => {
  await fetch()
})
</script>

<template>
  <a-typography-title :level="2">接入管理</a-typography-title>
  <a-typography-text>
    由于本页配置较为复杂，为确保使用体验，强烈推荐使用电脑操作本页</a-typography-text
  >
  <a-typography-title :level="3">我的应用</a-typography-title>
  <a-button type="primary" @click="createOpen = true">创建应用</a-button>
  <a-table
    :dataSource="dataSource"
    :pagination="false"
    :columns="columns"
    :loading="loading"
    :scroll="{
      x: true
    }"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
        <a-tag :color="status[record.status as StatusType].color || 'cyan'">
          {{ status[record.status as StatusType].text || '未知' }}
        </a-tag>
      </template>
      <template v-else-if="column.key === 'operation'">
        <a @click="handleOpen(record.appid)">查看详细</a>
      </template>
    </template>
  </a-table>

  <a-drawer :width="500" title="详细信息" placement="bottom" :open="open" @close="onClose">
    <template #extra>
      <a-button style="margin-right: 8px" @click="handleClose">关闭</a-button>
      <a-button type="primary" @click="handleSave" :loading="btnloading">保存</a-button>
    </template>
    <application-modal-component v-if="open" ref="editRef" :appid="selectAppid" />
  </a-drawer>

  <a-modal v-model:open="createOpen" title="创建应用" @ok="create" :confirmLoading="btnloading">
    <a-input v-model:value="createInput" placeholder="请输入应用程序名称" />
  </a-modal>
</template>
