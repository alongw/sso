<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

defineOptions({
  name: 'RedirectPage'
})

const route = useRoute()
const router = useRouter()

onMounted(() => {
  router.push({
    path: route.query.path?.toString() || '/'
  })
})
</script>

<template>
  <h1>Please wait...</h1>
</template>
