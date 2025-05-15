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
    oldDemo: true,
    chartjs: true,
    echarts: true,
    markmap: true,
    plantuml: true,
    mermaid: true,
    flowchart: true,

    annotation: true,
    abbr: true,
    timeline: true,
    collapse: true,
    chat: true,
    codeTree: true,
    field: true,
    imageSize: 'all',
    pdf: true,
    caniuse: true,
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
})
