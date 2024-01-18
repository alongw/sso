<script setup lang="ts">
import { ref } from 'vue'
import LogoComponent from '@/components/Logo.vue'
import ButtonComponent from '@/components/Button.vue'

import { useScreen } from '@/hook/useScreen'

import { HamburgerButton } from '@icon-park/vue-next'

defineOptions({
  name: 'NavComponent'
})

const { screenWidth } = useScreen()

const menu = [
  {
    name: '首页',
    to: '/'
  },
  {
    name: '解决方案',
    to: '/'
  },
  {
    name: '接入管理',
    to: '/'
  },
  {
    name: '账号中心',
    to: '/'
  },
  {
    name: '获取支持',
    to: '/'
  }
]

const phoneMenu = ref(false)
</script>

<template>
  <nav>
    <logo-component :show-title="screenWidth >= 370" class="logo" />
    <menu>
      <ul>
        <li v-for="i in menu" :key="i.to">
          <router-link :to="i.to">{{ i.name }}</router-link>
        </li>
      </ul>
    </menu>
    <div class="user-info">
      <button-component to="/login">立即登录</button-component>
    </div>
    <div class="phone">
      <a-button type="link" size="large" @click="phoneMenu = !phoneMenu"
        ><hamburger-button
      /></a-button>
    </div>
  </nav>
  <div class="phone-menu">
    <a-drawer
      :width="screenWidth >= 370 ? 370 : screenWidth - 30"
      title="Nya Account"
      placement="right"
      :open="phoneMenu"
      @close="phoneMenu = false"
    >
      <li
        v-for="i in menu"
        :key="i.to"
        style="
          list-style: none;
          padding: 10px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          margin: 10px 0;
        "
      >
        <router-link :to="i.to">{{ i.name }}</router-link>
      </li>
    </a-drawer>
  </div>
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

  .phone {
    display: none;
  }
}

@media (max-width: 1122px) {
  nav {
    menu {
      display: none;
    }
    .phone {
      display: block;
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

@media (max-width: 350px) {
  nav {
    .user-info {
      display: none;
    }
  }
}
</style>
