import { h } from 'vue'
import { Spin } from 'ant-design-vue'

import { LoadingOutlined } from '@ant-design/icons-vue'

import '@/assets/style/base.less'

import '@icon-park/vue-next/styles/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

Spin.setDefaultIndicator({
  indicator: h(LoadingOutlined, { class: 'anticon anticon-loading anticon-spin ant-spin-dot' })
})

// Event
import('@/event/request')

// Global Function
import('@/utils/globalMessage')

app.mount('#app')
