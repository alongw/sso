<script setup lang="ts">
import dayjs from 'dayjs'

defineOptions({
  name: 'UnderComponent'
})
</script>

<template>
  <div class="under">
    <ul>
      <li>
        版权所有 © {{ dayjs().year() }}
        <a href="javascript:;"> Nya Account </a>
        保留所有权利
      </li>
      <li>
        <a href="javascript:;">京ICP备1145141919810号</a>
        友情链接&nbsp;
        <a href="javascript:;">xxx</a>
        &nbsp;
        <a href="javascript:;">xxx</a>
        &nbsp;
        <a href="javascript:;">xxx</a>
      </li>
      <li>
        Email：<a href="javascript:;">110@gov.cn</a>
        &nbsp; 特别鸣谢&nbsp;
        <a href="https://docs.qq.com/" target="_blank">腾讯文档官网</a>&nbsp;
        <a href="https://appleid.apple.com/" target="_blank">AppleID</a>&nbsp;
        <a href="https://mcsmanager.com/" target="_blank">Mcsmanager</a>&nbsp; (本站借鉴)
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.under {
  display: flex;
  align-items: center;
  padding: 10vw;
  width: 100%;
  height: 350px;
  background-color: #333333;

  ul {
    li {
      list-style: none;
      color: #fff;
      font-size: 16px;
      font-weight: 400;

      a {
        color: inherit;
        text-decoration: none;

        &:hover {
          color: inherit;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
