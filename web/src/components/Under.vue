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
        <a href="https://www.alongw.cn/" target="_blank"> Nya Account </a>
        保留所有权利
      </li>
      <li>
        <a href="https://icp.gov.moe/?keyword=20241204" target="_blank">萌ICP备20241204号</a>
        友情链接&nbsp;
        <a href="https://www.alongw.cn/" target="_blank">阿龙的笔记</a>
        &nbsp;
        <a href="https://cloud.alongw.cn/" target="_blank">幻昼云存储</a>
        &nbsp;
        <a href="https://status.alongw.cn/" target="_blank">服务器状态</a>
      </li>
      <li>
        Email：<a href="mailto:admin@lolinya.net">admin@lolinya.net</a>
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

@media screen and (max-width: 550px) {
  .under {
    height: auto;
    ul {
      li {
        font-size: 14px;
        padding: 3px 0;
      }
    }
  }
}
</style>
