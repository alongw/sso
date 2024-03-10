<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { CheckOne, CloseOne } from '@icon-park/vue-next'
import validator from 'validator'
import {
  checkUserName as checkUserNameApi,
  setUserName as setUserNameApi,
  getNeedPerfect as getNeedPerfectApi
} from '@/api/perfect'
import ModalBoxComponents from '@/components/ModalBox.vue'

defineOptions({
  name: 'PerfectPage'
})

const route = useRoute()
const router = useRouter()

const checkUsername = () => {
  if (
    validator.isAlphanumeric(value.value) &&
    validator.isLength(value.value, { min: 4, max: 16 })
  ) {
    return true
  }
  tips.value = false
  return false
}

const value = ref('')

const checkButtonLoading = ref(false)

const tips = ref<null | true | false>(null)

const checkAvailable = async () => {
  if (!checkUsername()) return message.error('用户名只能是 4-16 位的字母(可包含数字)')
  checkButtonLoading.value = true
  const res = await checkUserNameApi({
    username: value.value
  })
  checkButtonLoading.value = false
  if (res.data.data.available) {
    tips.value = true
  } else {
    tips.value = false
  }
}

const submit = async () => {
  Modal.confirm({
    title: '你确定要设置这个用户名吗？',
    content: '用户名一旦设置将不能更改，请谨慎设置',
    okText: '是的，我确定',
    cancelText: '再想想',
    async onOk() {
      const result = await setUserNameApi({
        username: value.value
      })

      if (result.data.status !== 200) {
        return message.error(result.data.msg)
      }

      message.success(result.data.msg)
      return router.push({
        path: route.query.client_id ? '/authorize' : '/console',
        query: {
          ...route.query,
          from: 'perfect.setUsername'
        }
      })
    },
    onCancel() {}
  })
}

onMounted(async () => {
  const result = await getNeedPerfectApi()
  if (result.data.data.need === false) {
    Modal.error({
      title: '笨蛋！',
      content: '你已经设置过用户名啦！不能再设置了哦！！',
      onOk() {
        router.go(-1)
      },
      okText: '知道啦'
    })
  }
})
</script>
<template>
  <modal-box-components avatar="logo" max-width="400px" title="完善 Lolinya Account 账号">
    <div class="around-max">
      <a-typography-title :level="5">设置用户名</a-typography-title>
      <div class="input">
        <a-input-search
          v-model:value="value"
          placeholder="请输入用户名"
          enter-button="检查可用性"
          maxlength="16"
          size="large"
          :disabled="checkButtonLoading"
          :loading="checkButtonLoading"
          @search="checkAvailable()"
        />
      </div>
      <div class="check-result">
        <a-typography-text v-if="tips === true" type="success">
          <div style="display: flex; align-items: center; justify-content: right">
            <p style="margin-right: 5px">用户名可用</p>
            <check-one theme="outline" size="14" />
          </div>
        </a-typography-text>
        <a-typography-text v-if="tips === false" type="danger">
          <div style="display: flex; align-items: center; justify-content: right">
            <p style="margin-right: 5px">用户名不可用</p>
            <close-one theme="outline" size="14" />
          </div>
        </a-typography-text>
      </div>
      <div class="under" v-if="tips === true">
        <a-button
          type="primary"
          size="large"
          style="width: 100%"
          :disabled="tips != true"
          @click="submit()"
        >
          保存
        </a-button>
      </div>
    </div>
  </modal-box-components>
</template>

<style scoped lang="less">
.around-max {
  height: 100%;
  .under {
    margin-top: 20px;
    width: 100%;
  }
}
</style>
