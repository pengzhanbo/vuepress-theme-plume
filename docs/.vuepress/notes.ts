import { definePlumeNotesConfig } from '@vuepress-plume/vuepress-theme-plume'

export default definePlumeNotesConfig({
  notes: [
    {
      text: '',
      dir: 'vuepress-theme-plume',
      link: '/vuepress-theme-plume/',
      sidebar: [
        '',
        {
          text: '指南',
          children: ['快速开始', '编写文章'],
        },
        {
          text: '配置',
          children: [
            {
              text: '主题配置',
              link: '主题配置',
              children: ['主题插件配置', 'notes配置'],
            },
            '页面配置',
          ],
        },
        {
          text: '功能',
          children: ['基础功能', 'markdown增强'],
        },
      ],
    },
    {
      dir: 'vuepress-plugin',
      text: '',
      link: '/vuepress-plugin/',
      sidebar: [
        'caniuse/README',
        {
          dir: 'netlify-functions',
          text: 'plugin-netlify-functions',
          link: 'netlify-functions',
          children: ['', '介绍', '使用', '功能', 'API', 'functions开发指南'],
        },
      ],
    },
  ],
})
