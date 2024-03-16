import { reactive, computed, ref } from 'vue'

enum AuthenticationType {
  Email = 'email',
  Password = 'password',
  Null = ''
}

export const useLogin = () => {
  const userInfo = reactive({
    username: '',
    authenticationType: AuthenticationType.Null,
    captcha: false,
    isRegister: false,
    tips: ''
  })

  const showPasswordInput = () => {
    startAnimation.animationPlayState = 'running'
  }

  const startAnimation = reactive({
    animationPlayState: 'paused'
  })

  const title = computed(() => {
    return userInfo.isRegister ? '注册 Lolinya Account 账号' : '通过 Lolinya Account 登录'
  })

  const loading = reactive<{
    user: boolean
    password: boolean
  }>({
    user: false,
    password: false
  })

  const form = reactive({
    user: '',
    password: '',
    keepLogin: false
  })

  const captcha = reactive({
    randstr: '',
    ticket: ''
  })

  const avatarUrl = ref('logo')

  return {
    AuthenticationType,
    userInfo,
    showPasswordInput,
    startAnimation,
    title,
    loading,
    form,
    captcha,
    avatarUrl
  }
}
