<script setup lang="ts">
import { h } from 'vue'

import { RightOutlined } from '@ant-design/icons-vue'

import type { List } from '@/types/console'

defineOptions({
  name: 'ConsoleList'
})

const props = defineProps<{
  data: List[]
}>()
</script>

<template>
  <a-list item-layout="horizontal" :data-source="props.data">
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <a-button
            type="primary"
            shape="circle"
            @click="item.action(item)"
            :icon="h(RightOutlined)"
          />
          <solt name="actions" :item="item" />
        </template>
        <a-list-item-meta :description="item.desc">
          <template #title>
            {{ item.title }}
            <solt name="title" :item="item" />
          </template>
          <template #avatar>
            <component class="icon" :is="item.icon" />
            <solt name="avatar" :item="item" />
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>

<style scoped lang="less">
.icon {
  font-size: 20px;
  //   border: 1px solid #585858;
  background-color: #dddddd;
  border-radius: 100%;
  padding: 7px;
}
</style>
