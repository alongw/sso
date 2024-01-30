import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Nya - Account Docs',
  description: 'Lolinya Account',
  lang: 'zh-Hans',
  base: '/docs/',
  outDir: '../dist/docs',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'WebSize', link: 'https://account.lolinya.net' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
    footer: {
      message: 'Powered by ALONGW',
      copyright: 'Copyright © 2024 Nya-Account'
    },
    editLink: {
      pattern: 'https://github.com/alongw/sso/edit/main/web/docs/:path',
      text: 'Edit this page on GitHub'
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/alongw/sso' }]
  }
})
