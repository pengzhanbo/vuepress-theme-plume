import { defineNoteConfig } from 'vuepress-theme-plume'

export const themeConfig = defineNoteConfig({
  dir: 'theme/config',
  link: '/config/',
  sidebar: [
    {
      text: '配置',
      collapsed: false,
      items: [
        '配置说明',
        '主题配置',
        '多语言配置',
        '导航栏配置',
        'notes配置',
        '侧边栏配置',
      ],
    },
    {
      text: 'frontmatter',
      prefix: 'frontmatter',
      collapsed: false,
      items: [
        'basic',
        'home',
        'post',
        'friend',
      ],
    },
    {
      text: '内置插件',
      prefix: 'plugins',
      collapsed: false,
      items: [
        '',
        '代码高亮',
        '搜索',
        '阅读统计',
        'markdown增强',
        'markdownPower',
        'markdownImage',
        'markdownMath',
        'markdownInclude',
        '水印',
      ],
    },
  ],
})
