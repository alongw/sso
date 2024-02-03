<script setup lang="ts">
// import here ...

defineOptions({
  name: 'HelpPage'
})

// code here ...
</script>

<template>
  <div class="box">
    <h1>获取支持</h1>
    <p>如果您在使用过程中遇到问题，可以通过以下方式联系我们：</p>
    <ul>
      <li>
        Telegram：
        <a href="https://see.loliis.top/t.me/alongw" target="_blank"> @alongw </a>
      </li>
      <li>
        Email
        <a href="mailto:admin@lolinay.net" target="_blank"> admin@lolinay.net </a>
      </li>
      <li>
        Website：
        <a href="https://connect.alongw.cn/" target="_blank"> connect.alongw.cn </a>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.box {
  width: 100%;
  max-width: 1200px;
  margin: 25px auto 0;
  padding: 25px;
  ul {
    margin: 0 auto;
    padding: 25px;
    max-width: 1100px;

    li {
      margin: 15px;

      a {
        color: initial;
        transition: all 0.3s;
        &:visited {
          color: initial;
        }

        &:hover {
          color: #1e6fff;
        }
      }
    }
  }
}
</style>
