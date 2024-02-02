<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import LogoComponent from '@/components/Logo.vue'
import ButtonComponent from '@/components/Button.vue'

import { useScreen } from '@/hook/useScreen'
import { isLogin } from '@/hook/useUser'
import { HamburgerButton } from '@icon-park/vue-next'

defineOptions({
  name: 'NavComponent'
})

const route = useRoute()

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

const isLoginStatus = ref(isLogin())
watch(
  () => route.path,
  () => {
    isLoginStatus.value = isLogin()
  }
)

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
      <div v-if="!isLoginStatus">
        <button-component to="/login">立即登录</button-component>
      </div>
      <div v-else-if="!route.query.path">
        <button-component type="small-sub" to="/user">控制台</button-component>
      </div>
      <div v-else>
        <button-component type="small-sub" to="/loginout">退出登录</button-component>
      </div>
    </div>
    <div class="phone">
      <a-button type="link" size="large" @click="phoneMenu = !phoneMenu">
        <hamburger-button />
      </a-button>
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
          width: 100%;
        "
      >
        <router-link :to="i.to" style="width: 100%; display: block">{{ i.name }}</router-link>
      </li>
    </a-drawer>
  </div>
</template>

<style scoped lang="less">
nav {
  z-index: 10;
  position: fixed;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 2500px;
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

@media (max-width: 1140px) {
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
