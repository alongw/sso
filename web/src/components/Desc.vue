<script setup lang="ts">
import { type Component } from 'vue'

defineOptions({
  name: 'DescComponent'
})

defineProps<{
  title: string
  list: {
    title: string
    desc: string
    icon: Component
  }[]
}>()
</script>
<template>
  <div class="desc">
    <h3 class="title">
      {{ title }}
    </h3>
    <ul>
      <li v-for="i in list" :key="i.title">
        <div class="icon">
          <component class="icon-component" strokeWidth="1" :is="i.icon"></component>
        </div>
        <h4>{{ i.title }}</h4>
        <p>{{ i.desc }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.desc {
  background-color: #fcfcfc;
  .title {
    padding-top: 50px;
    margin: 0px 0 15px 0;
    text-align: center;
    font-size: 36px;
    font-weight: 400;
  }

  ul {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 250px;
      height: 300px;
      padding: 17px;
      list-style: none;
      background-color: rgba(204, 204, 204, 0.3);
      border-radius: 14px;
      margin: 35px;

      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: 100px;
        .icon-component {
          font-size: 100px;
        }
      }

      h4 {
        margin-top: 30px;
        font-size: 24px;
        font-weight: 400;
        color: #1f1f1f;
      }

      p {
        margin-top: 6px;
        font-size: 16px;
        font-weight: 400;
        color: #858585;
      }
    }
  }
}
</style>
