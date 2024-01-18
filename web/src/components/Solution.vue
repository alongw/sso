<script setup lang="ts">
defineOptions({
  name: 'SolutionComponent'
})
</script>

<template>
  <div class="solution">
    <h3>现成解决方案示例</h3>
    <ul>
      <li>
        <h4>基于 nia-img 使用</h4>
        <p>
          nia - img 是一个简易的多功能图片api，包含后台服务、图片节点、Cloudflare
          Workers、官方网站、进程守护
        </p>
        <button>了解更多</button>
      </li>
      <li>
        <h4>基于 nia-img 使用</h4>
        <p>
          nia - img 是一个简易的多功能图片api，包含后台服务、图片节点、Cloudflare
          Workers、官方网站、进程守护
        </p>
        <button>了解更多</button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.solution {
  padding-top: 50px;
  margin-bottom: 50px;
  font-size: 36px;
  font-weight: 400;
  text-align: center;
  background-color: #fcfcfc;

  h3 {
    margin-bottom: 50px;
  }

  ul {
    display: flex;
    justify-content: space-around;
    align-items: center;

    margin-top: 50px;
    width: 100%;

    li {
      list-style: none;
      width: 100%;
      max-width: 500px;
      height: 300px;
      border-radius: 14px;
      padding: 20px;
      //   background-color: pink;

      &:nth-child(1) {
        background: linear-gradient(223deg, rgb(77, 187, 255) 0%, rgb(60, 180, 255) 100%),
          linear-gradient(rgb(68, 193, 255) 0%, rgb(138, 216, 255) 100%), rgb(255, 255, 255);
      }

      &:nth-child(2) {
        background: linear-gradient(rgb(97, 148, 255) 0%, rgb(48, 123, 255) 71.23%),
          linear-gradient(rgba(237, 244, 255, 0) 0%, rgb(226, 239, 255) 100%), rgb(255, 255, 255);
      }

      h4 {
        margin-top: 50px;
        font-size: 24px;
        font-weight: 400;
        color: #fff;
      }
      p {
        display: block;
        margin-top: 34px;
        font-size: 14px;
        font-weight: 400;
        color: #fff;
      }
      button {
        margin-top: 34px;
        width: 120px;
        height: 45px;
        border-radius: 4px;
        background-color: #fff;
        border: none;
        font-size: 16px;
        font-weight: 400;
        color: #2ca1e5;

        &:hover {
          cursor: pointer;
          background-color: #eff1f3;
        }
      }
    }
  }
}

@media screen and (max-width: 1050px) {
  .solution {
    padding: 15px;
    ul {
      flex-direction: column;
      li {
        margin-top: 25px;
      }
    }
  }
}
</style>
