<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import dayjs from 'dayjs'
import { User } from '@icon-park/vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useScreen } from '@/hook/useScreen'

import UserInfoComponent from '@/components/user/Info.vue'
defineOptions({
  name: 'UserPage'
})

const route = useRoute()
const router = useRouter()

const { screenWidth } = useScreen()

enum MenuKey {
  User = '1'
}

const selectedKeys = ref<string[]>([route.query?.path ? route.query.path.toString() : '1'])

const menu = reactive<
  {
    title: string
    icon: any
    key: MenuKey
    component: any
  }[]
>([
  {
    title: '个人信息',
    icon: User,
    key: MenuKey.User,
    component: UserInfoComponent
  }
])

onMounted(() => {
  if (!route.query?.path) {
    return router.push({
      query: {
        path: '1'
      }
    })
  }
})
</script>
<template>
  <a-layout style="height: 100%; border-top: 1px solid #f0f0f0">
    <a-layout-sider breakpoint="lg" collapsed-width="0">
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item v-for="item in menu" :key="item.key">
          <component :is="item.icon" />
          <span class="nav-text" style="margin-left: 8px">{{ item.title }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header
        :style="{ background: '#fff', padding: 5 }"
        style="display: flex; align-items: center"
      >
        <h2
          style="font-size: 28px; margin: 0; font-weight: 500; text-shadow: 1px 1px 2px #cccccc6d"
        >
          {{ screenWidth >= 375 ? 'Nya Account 控制台' : '控制台' }}
        </h2>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <div class="item">
            <component
              :is="menu[+selectedKeys[0] - 1].component"
              :title="menu[+selectedKeys[0] - 1].title"
            />
          </div>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        版权所有 © {{ dayjs().year() }}
        <a href="javascript:;" style="color: inherit"> Nya Account </a>
        保留所有权利
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="less">
#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.site-layout-sub-header-background {
  background: #fff;
}

.site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout-sub-header-background {
  background: #141414;
}
</style>
