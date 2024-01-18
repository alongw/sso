import { onMounted, onUnmounted, ref } from 'vue'

export function useScreen() {
  const isPhone = ref(window.innerWidth <= 1122)

  const fn = () => {
    isPhone.value = window.innerWidth <= 1122
  }

  onMounted(() => {
    window.addEventListener('resize', fn)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', fn)
  })

  return {
    isPhone,
    screenWidth: window.innerWidth
  }
}
