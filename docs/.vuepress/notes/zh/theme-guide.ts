import { defineNoteConfig } from 'vuepress-theme-plume'

export const themeGuide = defineNoteConfig({
  dir: 'theme/guide',
  link: '/guide/',
  sidebar: [
    {
      text: '从这里开始',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'quick-start',
      items: [
        'intro',
        'usage',
        'project-structure',
        'write',
        'blog',
        'document',
        'locales',
        'deployment',
        'optimize-build',
      ],
    },
    {
      text: '写作',
      icon: 'fluent-mdl2:edit-create',
      collapsed: false,
      items: [
        {
          text: 'markdown',
          icon: 'material-symbols:markdown-outline',
          prefix: 'markdown',
          collapsed: true,
          items: [
            'basic',
            'extensions',
            'icons',
            'mark',
            'plot',
            'abbr',
            'annotation',
            'card',
            'steps',
            'file-tree',
            'tabs',
            'timeline',
            'demo-wrapper',
            'collapse',
            'npm-to',
            'caniuse',
            'chat',
            'include',
          ],
        },
        {
          text: '代码块',
          prefix: 'code',
          icon: 'ph:code-bold',
          collapsed: true,
          items: [
            'intro',
            'features',
            'code-tabs',
            'import',
            'twoslash',
          ],
        },
        {
          text: '代码演示',
          prefix: 'repl',
          icon: 'carbon:demo',
          collapsed: true,
          items: [
            'frontend',
            'rust',
            'golang',
            'kotlin',
            'codepen',
            'jsFiddle',
            'codeSandbox',
            'replit',
            { link: 'frontend-deprecated', text: '前端（弃用）' },
          ],
        },
        {
          text: '图表',
          icon: 'mdi:chart-line',
          prefix: 'chart',
          collapsed: true,
          items: [
            'chart',
            'echarts',
            'mermaid',
            'flowchart',
            'markmap',
            'plantuml',
          ],
        },
        {
          text: '资源嵌入',
          icon: 'dashicons:embed-video',
          prefix: 'embed',
          collapsed: true,
          items: [
            'pdf',
            'bilibili',
            'youtube',
            'artplayer',
            'audioReader',
          ],
        },
      ],
    },
    {
      text: '功能',
      icon: 'lucide:box',
      collapsed: false,
      prefix: 'features',
      items: [
        'icon',
        'copy-code',
        'search',
        'comments',
        'bulletin',
        'encryption',
        'contributors',
        'changelog',
        'copyright',
        'watermark',
        'friend-links',
        'seo',
        'sitemap',
      ],
    },
    {
      text: '组件',
      prefix: 'components',
      icon: 'uiw:component',
      collapsed: false,
      items: [
        'badge',
        'icon',
        'plot',
        'card',
        'link-card',
        'image-card',
        'card-grid',
        'card-masonry',
        'home-box',
        'repo-card',
        'npm-badge',
        'swiper',
      ],
    },
    {
      text: '自定义',
      icon: 'material-symbols:dashboard-customize-outline-rounded',
      collapsed: false,
      prefix: 'custom',
      items: [
        'home',
        'style',
        'slots',
        'component-overrides',
      ],
    },
    {
      text: 'API',
      icon: 'mdi:api',
      prefix: 'api',
      collapsed: false,
      items: [
        'client',
        'node',
      ],
    },
  ],
})
