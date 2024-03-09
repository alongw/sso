<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'

import { useApplication, status, approve, type StatusType } from '@/hook/useApplication'

import {
  getAllPermission,
  getUsePermission,
  addPermission,
  deletePermission
} from '@/api/application'

defineOptions({
  name: 'ApplicationModalComponent'
})

const prop = defineProps({
  appid: String
})

const { getAppInfo, updateApp, refreshSecret, deleteApp, removeReview } = useApplication(
  prop.appid || ''
)

let appInfo = ref<{
  appid: string
  name: string
  description: string
  secret: string
  status: number
  owner: string
  redirect: string
  approve: number
  createTime: number
}>()

const contentInfo = reactive({
  name: '',
  description: '',
  redirect: ''
})

const fetch = async () => {
  appInfo.value = await getAppInfo()
  contentInfo.name = appInfo.value?.name || '-'
  contentInfo.description = appInfo.value?.description || '-'
  contentInfo.redirect = appInfo.value?.redirect || '-'
}

const update = async () => {
  const res = await updateApp({
    name: contentInfo.name,
    description: contentInfo.description,
    redirect: contentInfo.redirect
  })
  if (res) {
    message.success('保存成功')
  }
}

const mockData = ref()

const targetKeys = ref<string[]>()

defineExpose({
  update
})

const permissionLoading = ref(false)

const handleChange = async (nextTargetKeys: string[], direction: string, moveKeys: string[]) => {
  if (direction === 'right') {
    // add
    permissionLoading.value = true
    const { data: result } = await addPermission({
      appid: prop.appid || '0',
      apppid: moveKeys.map((e) => +e)
    })
    permissionLoading.value = false
    if (result.status !== 200) return message.error(result.msg)
    return message.success(result.msg)
  } else {
    // delete
    permissionLoading.value = true
    const { data: result } = await deletePermission({
      appid: prop.appid || '0',
      apppid: moveKeys.map((e) => +e)
    })
    permissionLoading.value = false
    if (result.status !== 200) return message.error(result.msg)
    return message.success(result.msg)
  }
}

const handleSubmitReview = () => {
  Modal.confirm({
    title: '提审',
    content: '当前暂不支持自动提审，如需提审，请点击导航栏中的获取支持，再选择一种联系方式联系我们'
  })
}

const handleRemoveReview = async () => {
  Modal.confirm({
    title: '你确定要应急下架此应用程序吗？',
    content:
      '应急下架后，应用将恢复未审核状态，如需使用，需要重新提审（拥有调用未审核应用权限的用户仍然可以调用）',
    async onOk() {
      await removeReview()
      await fetch()
    }
  })
}

onMounted(async () => {
  await fetch()
  const { data: result1 } = await getAllPermission({ appid: prop.appid || '0' })
  mockData.value = result1.data.permissionList.map((e) => {
    return {
      key: e.apppid.toString(),
      title: `${e.apppid} - ${e.name}`,
      description: e.description
    }
  })

  const { data: result2 } = await getUsePermission({ appid: prop.appid || '0' })
  mockData.value = mockData.value.concat(
    result2.data.usePermissionList.map((e) => {
      return {
        key: e.apppid.toString(),
        title: `${e.apppid} - ${e.description}`,
        description: e.description
      }
    })
  )
  targetKeys.value = result2.data.usePermissionList.map((e) => e.apppid.toString())
})
</script>

<template>
  <a-spin size="large" :spinning="!appInfo?.appid">
    <a-descriptions :title="appInfo?.name" :column="3" bordered>
      <a-descriptions-item label="应用名称">
        <a-typography-paragraph v-model:content="contentInfo.name" copyable editable>
          {{ appInfo?.name }}
        </a-typography-paragraph>
      </a-descriptions-item>
      <a-descriptions-item label="应用状态">
        <a-tag :color="status[(appInfo?.status.toString() || '-114514') as StatusType].color">
          {{ status[(appInfo?.status.toString() || '-114514') as StatusType].text }}
        </a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="应用权重">
        <a-badge
          :color="approve[(appInfo?.approve as 0) || 0].color"
          :text="approve[(appInfo?.approve as 0) || 0].text"
        />
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        <a-typography-paragraph copyable>
          {{ dayjs(appInfo?.createTime || 0).format('YYYY-MM-DD HH:mm:ss') }}
        </a-typography-paragraph>
      </a-descriptions-item>
      <a-descriptions-item label="重定向 url" :span="2">
        <a-typography-paragraph v-model:content="contentInfo.redirect" copyable editable />
      </a-descriptions-item>
      <a-descriptions-item label="应用简介" :span="3">
        <a-typography-paragraph v-model:content="contentInfo.description" copyable editable />
      </a-descriptions-item>
      <a-descriptions-item label="客户端 ID">
        <a-typography-paragraph copyable>
          {{ appInfo?.appid }}
        </a-typography-paragraph>
      </a-descriptions-item>
      <a-descriptions-item label="客户端秘钥">
        <a-typography-paragraph copyable>
          {{ appInfo?.secret }}
        </a-typography-paragraph>
      </a-descriptions-item>
    </a-descriptions>
    <a-typography-title :level="4">权限配置</a-typography-title>

    <a-spin :spinning="permissionLoading">
      <a-transfer
        v-model:target-keys="targetKeys"
        :data-source="mockData"
        :titles="['可用权限', '已用权限']"
        :render="(item: any) => item.title"
        @change="handleChange"
      />
    </a-spin>

    <a-space style="margin-top: 15px">
      <a-button v-if="appInfo?.status === 0" type="primary" @click="handleSubmitReview">
        提审
      </a-button>
      <a-button v-else type="primary" danger @click="handleRemoveReview">应急下架</a-button>
      <a-button type="primary" danger @click="refreshSecret">重置秘钥</a-button>
      <a-button danger @click="deleteApp">删除应用</a-button>
    </a-space>
  </a-spin>
</template>

<style scoped lang="less">
.ant-typography {
  margin: 0;
}
</style>
