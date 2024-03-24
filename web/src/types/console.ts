import type { Component } from 'vue'

export interface List {
  title: string
  desc: string
  icon: Component
  action: () => void
  application?: {
    appid: string
    name: string
    description: string
    status: number
    createTime: number
    approve: number
  }
}
