import { defineNoteConfig } from 'vuepress-theme-plume'

export const plugins = defineNoteConfig({
  dir: 'plugins',
  link: '/plugins/',
  sidebar: [
    {
      text: '插件',
      link: '/plugins/',
      items: [
        // 'caniuse',
        // 'iconify',
        'shiki',
        'md-power',
        'content-updated',
        {
          text: 'plugin-netlify-functions',
          dir: 'netlify-functions',
          link: '/plugins/plugin-netlify-functions/',
          collapsed: true,
          items: [
            '介绍',
            '使用',
            '功能',
            'api',
            'functions',
          ],
        },
      ],
    },
  ],
})
