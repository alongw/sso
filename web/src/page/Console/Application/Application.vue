<script setup lang="ts">
import ConsoleTitleComponent from '@/components/console/Title.vue'
import ConsoleListComponent from '@/components/console/List.vue'

import { useConsoleApplication } from '@/hook/console/useApplication'
import { onMounted } from 'vue'
import { useScreen } from '@/hook/useScreen'

import type { ApplicationList } from '@/types/application'
import type { List as MenuListType } from '@/types/console'

defineOptions({
  name: 'ConsoleApplicationPage'
})

const { isPhone } = useScreen()

const { getAppList, itemList, appStatus, modalOpen, createApp, modalBtnLoading, modalIpt } =
  useConsoleApplication()

onMounted(async () => {
  getAppList()
})
</script>

<template>
  <console-title-component title="接入管理" desc="您在 Nya Account 中接入的应用程序" />

  <a-card class="console-card">
    <a-skeleton :loading="!itemList">
      <h2>应用管理</h2>

      <a-typography-paragraph>
        您创建的应用将显示在此处，创建应用后需审核才能正常使用。
      </a-typography-paragraph>

      <a-typography-paragraph>
        除此此外，强烈建议您在创建前查看我们的
        <a-typography-link href="https://account.lolinya.net/docs/" target="_blank">
          说明文档
        </a-typography-link>
        以确保使您的应用程序更顺利的接入。
      </a-typography-paragraph>
    </a-skeleton>
  </a-card>

  <a-card title="应用列表" class="console-card">
    <a-typography-paragraph>
      该页面较为复杂，建议使用大屏查看及操作。使用手机屏幕可能导致内容显示不完整。
    </a-typography-paragraph>
    <template #extra>
      <a-button @click="modalOpen = !modalOpen" type="primary">创建应用</a-button>
    </template>
    <a-skeleton :loading="!itemList">
      <console-list-component :data="itemList">
        <template #title="{ item }: { item: ApplicationList & MenuListType }">
          {{ item.title }}
          <a-tag
            v-if="!isPhone"
            :color="appStatus[item.application?.status as 0].color || 'cyan'"
            style="margin-left: 5px"
          >
            {{ appStatus[item.application?.status as 0].text || '未知' }}
          </a-tag></template
        >

        <template #desc="{ item }: { item: ApplicationList & MenuListType }">
          <a-typography-paragraph :content="item.desc || '-'" :ellipsis="true" />
        </template>
      </console-list-component>
    </a-skeleton>
  </a-card>

  <!-- Modal -->
  <a-modal
    v-model:open="modalOpen"
    title="创建新应用"
    @ok="createApp"
    :confirmLoading="modalBtnLoading"
  >
    <a-input v-model:value="modalIpt" placeholder="应用名称" />
  </a-modal>
</template>
