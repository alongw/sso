<script setup lang="ts">
import BannerComponents from '@/components/Banner.vue'
import DescComponents from '@/components/Desc.vue'
import SolutionComponents from '@/components/Solution.vue'
import UnderComponents from '@/components/Under.vue'

import {
  DatabaseNetwork,
  AllApplication,
  Api,
  Permissions,
  FileCodeOne,
  Fingerprint,
  Newlybuild,
  MoreApp
} from '@icon-park/vue-next'

defineOptions({
  name: 'HomePage'
})

const apiDesc = [
  {
    title: '开放性接入',
    desc: '灵活的接入机制，登录工具能够轻松集成，为用户提供更多选择，增加登录的便捷性',
    icon: AllApplication
  },
  {
    title: '云端存储',
    desc: '提供免费的云端存储空间，用户数据自动存储至云端，使用时可随时获取，数据永久存储',
    icon: DatabaseNetwork
  },
  {
    title: '多元化 API 接口',
    desc: '提供多元化的 API 接口，用户数据可自主选择授权范围，管理系统权限，保护用户隐私',
    icon: Api
  },
  {
    title: '自由 Token 管理',
    desc: '第三方接入系统可自由管理 Token，有效期内可随时操作用户数据',
    icon: Permissions
  }
]

const openDesc = [
  {
    title: '完全开源',
    desc: '登录系统前后端完全开源，确保用户数据安全可靠，用户可自行搭建登录系统',
    icon: FileCodeOne
  },
  {
    title: '开放式身份验证',
    desc: '提供多种身份验证方式，用户可自行选择，确保用户数据安全可靠',
    icon: Fingerprint
  },
  {
    title: '小白式对接和搭建',
    desc: '提供小白式对接和搭建，零基础用户也能轻松使用，更符用户合常规使用习惯',
    icon: Newlybuild
  },
  {
    title: '多放一个好看点',
    desc: '实在编不下去了，GPT 都不愿意帮我写，多放一个好看点。嗯对。嗯...',
    icon: MoreApp
  }
]
</script>

<template>
  <banner-components />
  <desc-components :list="apiDesc" title="可自由接入第三方登录工具" />
  <desc-components :list="openDesc" title="开放生态" />
  <solution-components />
  <under-components />
</template>
