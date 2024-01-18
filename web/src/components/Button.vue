<script setup lang="ts">
import { useRouter, type RouteLocationRaw } from 'vue-router'

const router = useRouter()

defineOptions({
  name: 'ButtonComponent'
})

const prop = withDefaults(
  defineProps<{
    type?: 'primary' | 'cancel' | 'verify' | 'main' | 'sub'
    to?: RouteLocationRaw | string
  }>(),
  {
    type: 'primary'
  }
)

const emit = defineEmits({
  click: () => true
})

const handleButtonClick = () => {
  if (prop.to) {
    router.push(prop.to)
  }
  if (emit) {
    emit('click')
  }
}
</script>

<template>
  <button :class="prop.type" type="button" @click="handleButtonClick">
    <slot></slot>
  </button>
</template>

<style scoped lang="less">
button {
  cursor: pointer;
  border: none;
  outline: none;
  border-radius: 4px;
  font-weight: 400;
  transition: all 0.1s ease-in-out;
}

.primary {
  color: #fff;
  font-size: 14px;
  padding: 8px 20px;
  background-color: #1e6fff;
  &:hover {
    background-color: #175ceb;
  }
}

.cancel {
  color: #000;
  font-size: 16px;
  padding: 8px 20px;
  background-color: #ccc;
  &:hover {
    background-color: #c5c5c5;
  }
}

.verify {
  color: #fff;
  font-size: 16px;
  padding: 8px 20px;
  background-color: #1e6fff;
  &:hover {
    background-color: #175ceb;
  }
}

.main {
  color: #fff;
  font-size: 16px;
  padding: 10px 60px;
  background-color: #1e6fff;
  border: 1px solid #1e6fff;

  &:hover {
    background-color: #175ceb;
  }
}

.sub {
  color: #1e6fff;
  font-size: 16px;
  padding: 10px 60px;
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid #1e6fff;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
