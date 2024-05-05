import requestEvent from '@/event/request'

import { message, Modal, notification } from 'ant-design-vue'

requestEvent.on('Unauthorized', () => {
  message.warning('无效的登录会话，请重新登录')
})

requestEvent.on('NetworkError', (statusResult: string | boolean) => {
  if (!statusResult) {
    Modal.error({
      title: '连接已丢失',
      content: '请确保您已经正确连接互联网'
    })
  }
  if (statusResult === 'browser') {
    Modal.error({
      title: '无法连接至服务器',
      content: '请确保您的网络环境可以正常与中国大陆服务器进行通信'
    })
  }
  if (statusResult === 'service') {
    Modal.error({
      title: '服务器错误',
      content: '服务器暂时发生故障，请稍后再试，若无法解决，请联系技术人员'
    })
  }
})

requestEvent.on('UnknownError', () => {
  notification.error({
    message: '后端服务器出错',
    description: `请刷新页面重试，若无法解决，请联系技术人员`
  })
})

requestEvent.on('Message', (type: 'success' | 'error' | 'warn', msg: string) => {
  if (type == 'success') message.success(msg)
  if (type == 'error') message.error(msg)
  if (type == 'warn') message.warn(msg)
})
