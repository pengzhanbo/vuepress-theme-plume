import type { Theme } from 'vuepress'
import process from 'node:process'
import { plumeTheme } from 'vuepress-theme-plume'

export const theme: Theme = plumeTheme({
  hostname: process.env.SITE_HOST || 'https://theme-plume.vuejs.press',

  docsRepo: 'https://github.com/pengzhanbo/vuepress-theme-plume',
  docsDir: 'docs',
  changelog: { maxCount: 10 },
  contributors: { mode: 'block' },

  search: { provider: 'local' },

  codeHighlighter: {
    twoslash: true,
    lineNumbers: 10,
  },

  markdown: {
    chartjs: true,
    echarts: true,
    markmap: true,
    plantuml: true,
    mermaid: true,
    flowchart: true,

    annotation: true,
    abbr: true,
    table: true,
    timeline: true,
    collapse: true,
    chat: true,
    codeTree: true,
    field: true,
    imageSize: 'all',
    mark: 'lazy',
    pdf: true,
    qrcode: true,
    caniuse: true,
    acfun: true,
    bilibili: true,
    youtube: true,
    artPlayer: true,
    audioReader: true,
    codepen: true,
    replit: true,
    codeSandbox: true,
    jsfiddle: true,
    demo: true,
    npmTo: ['pnpm', 'yarn', 'npm'],
    repl: {
      go: true,
      rust: true,
      kotlin: true,
      python: true,
    },
  },

  comment: {
    provider: 'Giscus',
    comment: true,
    repo: 'pengzhanbo/vuepress-theme-plume',
    repoId: 'R_kgDOG_ebNA',
    category: 'docs-comment',
    categoryId: 'DIC_kwDOG_ebNM4Cd0uF',
    mapping: 'pathname',
    reactionsEnabled: true,
    inputPosition: 'top',
    darkTheme: 'dark_protanopia',
    lightTheme: 'light_protanopia',
  },

  watermark: {
    enabled: false,
    watermarkOptions: {
      content: 'vuepress-theme-plume',
    },
  },

  llmstxt: {
    locale: 'all',
    llmsTxtTemplateGetter: {
      description: (_, { currentLocale }) => {
        return currentLocale === '/'
          ? '一个简约易用的，功能丰富的 vuepress 文档&博客 主题'
          : 'An easy-to-use and feature-rich vuepress documentation and blog theme'
      },
      details: '',
    },
  },
})
