import { definePlumeNotesConfig } from 'vuepress-theme-plume'

export const zhNotes = definePlumeNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [
    {
      dir: 'theme/guide',
      link: '/guide/',
      sidebar: [
        {
          text: '快速开始',
          collapsed: false,
          icon: 'carbon:idea',
          items: ['介绍', '安装与使用', '博客', '知识笔记', '部署'],
        },
        {
          text: '写作',
          icon: 'fluent-mdl2:edit-create',
          collapsed: false,
          items: [
            '编写文章',
            '国际化',
            {
              text: 'markdown',
              icon: 'material-symbols:markdown-outline',
              dir: 'markdown',
              items: ['基础', '扩展', '进阶', '试验性'],
            },
            {
              text: '图表',
              icon: 'mdi:chart-line',
              dir: '图表',
              items: ['chart', 'echarts', 'mermaid', 'flowchart'],
            },
          ],
        },
        {
          text: '功能',
          icon: 'lucide:box',
          collapsed: false,
          dir: '功能',
          items: ['代码复制', '内容搜索', '评论', '加密', '组件', '友情链接页', 'seo', 'sitemap'],
        },
        {
          text: '自定义',
          icon: 'material-symbols:dashboard-customize-outline-rounded',
          collapsed: false,
          items: ['自定义首页', '自定义样式'],
        },
        {
          text: 'API',
          icon: 'mdi:api',
          collapsed: false,
          items: ['api-客户端', 'api-node'],
        },
      ],
    },
    {
      dir: 'theme/config',
      link: '/config/',
      sidebar: [
        {
          text: '配置',
          collapsed: false,
          items: [
            '配置说明',
            '多语言配置',
            '主题配置',
            '导航栏配置',
            'notes配置',
          ],
        },
        {
          text: 'frontmatter',
          dir: 'frontmatter',
          collapsed: false,
          items: ['basic', 'home', 'post', 'friend'],
        },
        {
          text: '内置插件',
          dir: 'plugins',
          collapsed: false,
          items: ['', '代码复制', '代码高亮', '搜索', '阅读统计', 'markdown增强', '百度统计'],
        },
      ],
    },
    {
      dir: 'plugins',
      link: '/plugins/',
      sidebar: [
        {
          text: '插件',
          link: '/plugins/',
          items: [
            'caniuse',
            'iconify',
            'shiki',
            'content-updated',
            {
              text: 'plugin-netlify-functions',
              dir: 'netlify-functions',
              link: '/plugins/plugin-netlify-functions/',
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
    },
  ],
})

export const enNotes = definePlumeNotesConfig({
  dir: 'en/notes',
  link: '/',
  notes: [],
})
