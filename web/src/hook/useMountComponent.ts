import { createApp, type Component } from 'vue'
import { sleep } from '@/utils/common'

export function useMountComponent(data: Record<string, any> = {}) {
  let isOpen = false
  const mount = <T>(component: Component) => {
    if (isOpen) return
    isOpen = true
    document.body.style.overflow = 'hidden'
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise<T>((resolve, reject) => {
      const div = document.createElement('div')
      document.body.appendChild(div)
      const app = createApp(component, {
        ...data,
        async destroyComponent(delay = 1000) {
          await sleep(delay)
          app.unmount()
          div.remove()
          document.body.style.overflow = 'default'
          isOpen = false
        },
        emitResult(data: T) {
          document.body.style.overflow = 'default'
          isOpen = false
          resolve(data)
        }
      })

      app.mount(div)
    })
  }

  return {
    mount
  }
}
