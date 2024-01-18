<script setup lang="ts">
import LogoComponent from '@/components/Logo.vue'
import ButtonComponent from '@/components/Button.vue'

defineOptions({
  name: 'NavComponent'
})
</script>

<template>
  <nav>
    <logo-component class="logo" />
    <menu>
      <ul>
        <li>
          <router-link to="/">首页</router-link>
        </li>
        <li>
          <router-link to="/">解决方案</router-link>
        </li>
        <li>
          <router-link to="/">接入管理</router-link>
        </li>
        <li>
          <router-link to="/">账号中心</router-link>
        </li>
        <li>
          <router-link to="/">获取支持</router-link>
        </li>
      </ul>
    </menu>
    <div class="user-info">
      <button-component to="/login">立即登录</button-component>
    </div>
  </nav>
</template>

<style scoped lang="less">
nav {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 70px;
  padding: 0 30px;

  .logo {
    flex: 1;
  }

  menu {
    flex: 1;
    ul {
      display: flex;
      align-items: center;
      justify-content: space-between;
      list-style: none;
      margin-bottom: none !important;

      li {
        margin: 0 3px;
        font-size: 18px;
        font-weight: 400;
        color: #1e1e1e;
        transition: all 0.1s ease-in-out;
        cursor: pointer;

        a {
          color: inherit;
          text-decoration: none;
        }

        &:visited {
          color: inherit;
        }

        &:hover {
          color: #1e6fff;
        }
      }
    }
  }

  .user-info {
    flex: 1;
    text-align: right;
  }
}

@media (max-width: 1122px) {
  nav {
    menu {
      display: none;
    }
  }
}

@media (max-width: 425px) {
  nav {
    padding: 0 15px;
  }
}

@media (max-width: 380px) {
  nav {
    .logo {
      flex: none;
    }
  }
}

@media (max-width: 300px) {
  nav {
    .user-info {
      display: none;
    }
  }
}
</style>
