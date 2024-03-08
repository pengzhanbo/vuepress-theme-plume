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
          items: ['介绍', '安装与使用', '博客', '知识笔记'],
        },
        {
          text: '写作',
          collapsed: false,
          items: [
            '编写文章',
            {
              text: 'markdown',
              items: ['markdown-基础', 'markdown-扩展', 'markdown-进阶', 'markdown-试验性'],
            },
            '国际化',
          ],
        },
        {
          text: '功能',
          collapsed: false,
          items: ['代码复制', '内容搜索', '评论', '加密', '组件', '友情链接页', 'seo', 'sitemap'],
        },
        {
          text: '自定义',
          collapsed: false,
          items: ['自定义首页', '自定义样式'],
        },
        {
          text: 'API',
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
  ],
})

export const enNotes = definePlumeNotesConfig({
  dir: 'en/notes',
  link: '/',
  notes: [],
})
