<script setup lang="ts">
import BannerComponents from '@/components/Banner.vue'
import DescComponents from '@/components/Desc.vue'
import SolutionComponents from '@/components/Solution.vue'
import UnderComponents from '@/components/Under.vue'

import { DatabaseNetwork } from '@icon-park/vue-next'

defineOptions({
  name: 'HomePage'
})

const apiDesc = [
  {
    title: '数据云端存储',
    desc: '提供免费的云端存储空间，用户数据自动存储至云端，使用时可随时获取，数据永久存储',
    icon: DatabaseNetwork
  },
  {
    title: '数据云端存储',
    desc: '提供免费的云端存储空间，用户数据自动存储至云端，使用时可随时获取，数据永久存储',
    icon: DatabaseNetwork
  },
  {
    title: '数据云端存储',
    desc: '提供免费的云端存储空间，用户数据自动存储至云端，使用时可随时获取，数据永久存储',
    icon: DatabaseNetwork
  },
  {
    title: '数据云端存储',
    desc: '提供免费的云端存储空间，用户数据自动存储至云端，使用时可随时获取，数据永久存储',
    icon: DatabaseNetwork
  }
]
</script>

<template>
  <banner-components />
  <desc-components :list="apiDesc" title="可自由接入第三方登录工具" />
  <desc-components :list="apiDesc" title="可自由接入第三方登录工具" />
  <solution-components />
  <under-components />
</template>
