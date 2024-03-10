import type { Component } from 'vue'

export interface List {
  title: string
  desc: string
  icon: Component
  action: () => void
}
