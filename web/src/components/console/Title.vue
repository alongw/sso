<script setup lang="ts">
defineOptions({
  name: 'ConsoleTitleComponent'
})

const prpos = defineProps({
  title: String,
  desc: String
})
</script>

<template>
  <div class="title">
    <h1>{{ prpos.title }}</h1>
    <p>{{ prpos.desc }}</p>
    <div>
      <slot name="more" />
    </div>
  </div>
</template>

<style scoped lang="less">
.title {
  margin: 25px auto;
  text-align: center;
}
</style>
