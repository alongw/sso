<script setup lang="ts">
import { onMounted, h } from 'vue'
import dayjs from 'dayjs'
import { useManagement, approve } from '@/hook/console/useManagement'
import { useConsoleApplication } from '@/hook/console/useApplication'
import { useRoute, useRouter } from 'vue-router'
import { Refresh } from '@icon-park/vue-next'
import { Modal } from 'ant-design-vue'

defineOptions({
  name: 'ConsoleApplicationManagementPage'
})

const route = useRoute()
const router = useRouter()

const {
  getAppInfo,
  handleSelectChange,
  handleSave,
  handleChangePermission,
  getPermission,
  deleteApp,
  refreshSecret,
  removeReview,
  selectedKeys,
  selectedOptions,
  appInfo,
  contentInfo,
  saveLoading,
  mockData,
  targetKeys,
  permissionLoading
} = useManagement(route.params?.appid.toString() || '0')
const { appStatus } = useConsoleApplication()

onMounted(async () => {
  if (route.params?.appid.toString() === '0') return router.push('/console/application')
  await getPermission()
  await getAppInfo()
})

const handleRemoveReview = async () => {
  Modal.confirm({
    title: '你确定要应急下架此应用程序吗？',
    content:
      '应急下架后，应用将恢复未审核状态，如需使用，需要重新提审（拥有调用未审核应用权限的用户仍然可以调用）',
    async onOk() {
      await removeReview()
      router.push({
        path: '/redirect',
        query: {
          path: `/console/application/${route.params.appid}`
        }
      })
    }
  })
}

const handleSubmitReview = () => {
  Modal.confirm({
    title: '提审',
    content: '当前暂不支持自动提审，如需提审，请点击导航栏中的获取支持，再选择一种联系方式联系我们'
  })
}
</script>

<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="应用管理"
    sub-title="管理应用程序"
    @back="$router.push('/console/application')"
  />

  <a-card class="console-card">
    <a-skeleton :loading="!selectedKeys">
      <div class="app-select">
        <a-space>
          <a-select
            ref="select"
            v-model:value="selectedKeys"
            :options="selectedOptions"
            style="width: 100%"
            @change="handleSelectChange"
          />
          <a-button
            type="primary"
            shape="circle"
            :icon="h(Refresh)"
            @click="
              router.push({
                path: '/redirect',
                query: {
                  path: `/console/application/${$route.params.appid}`
                }
              })
            "
          />
        </a-space>
      </div>

      <div class="app-info">
        <a-descriptions :title="appInfo?.name" :column="1" bordered>
          <a-descriptions-item label="名称">
            <a-typography-paragraph v-model:content="contentInfo.name" copyable editable>
              {{ appInfo?.name }}
            </a-typography-paragraph>
          </a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-tag :color="appStatus[appInfo?.status as 0].color || 'cyan'">
              {{ appStatus[appInfo?.status as 0].text || '未知' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="权重">
            <a-badge
              :color="approve[(appInfo?.approve as 0) || 0].color"
              :text="approve[(appInfo?.approve as 0) || 0].text"
            />
          </a-descriptions-item>
          <a-descriptions-item label="重定向 url">
            <a-typography-paragraph v-model:content="contentInfo.redirect" copyable editable />
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">
            <a-typography-paragraph copyable>
              {{ dayjs(appInfo?.createTime || 0).format('YYYY-MM-DD HH:mm:ss') }}
            </a-typography-paragraph>
          </a-descriptions-item>
          <a-descriptions-item label="应用简介">
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

        <div class="button-group">
          <a-space>
            <a-button type="primary" @click="handleSave" :loading="saveLoading"> 保存 </a-button>
          </a-space>
        </div>

        <div class="permission">
          <h2>权限配置</h2>
          <div class="permission-transfer">
            <a-spin :spinning="permissionLoading">
              <a-transfer
                v-model:target-keys="targetKeys"
                :data-source="mockData"
                :titles="['可用权限', '已用权限']"
                :render="(item: any) => item.title"
                @change="handleChangePermission"
              />
            </a-spin>
          </div>
        </div>
      </div>
      <a-space class="submit-group">
        <a-button v-if="appInfo?.status === 0" type="primary" @click="handleSubmitReview">
          提审
        </a-button>
        <a-button v-else danger type="primary" @click="handleRemoveReview"> 紧急下架 </a-button>
        <a-button danger type="primary" @click="deleteApp"> 删除应用 </a-button>
        <a-button danger @click="refreshSecret"> 重置秘钥 </a-button>
      </a-space>
    </a-skeleton>
  </a-card>
</template>

<style scoped lang="less">
.app-select {
  width: 100%;
  max-width: 200px;
}

.app-info {
  margin-top: 20px;

  .button-group {
    margin-top: 20px;
  }

  .permission {
    margin-top: 20px;

    .permission-transfer {
      overflow-x: scroll;
    }
  }
}

.submit-group {
  margin-top: 20px;
}

@media screen and (max-width: 450px) {
}
</style>
