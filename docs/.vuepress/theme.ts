import type { Theme } from 'vuepress'
import process from 'node:process'
import { plumeTheme } from 'vuepress-theme-plume'

export const theme: Theme = plumeTheme({
  hostname: process.env.SITE_HOST || 'https://plume.pengzhanbo.cn',
  docsRepo: 'https://github.com/pengzhanbo/vuepress-theme-plume',
  docsDir: 'docs',
  changelog: { maxCount: 10 },
  contributors: { mode: 'block' },

  plugins: {

    shiki: {
      twoslash: true,
      lineNumbers: 10,
      languages: ['sh', 'ts', 'md', 'html', 'js', 'go', 'kotlin', 'rust', 'vue', 'css', 'json', 'scss', 'yaml', 'bash', 'c++', 'java', 'py', 'ruby', 'make', 'objc', 'swift', 'php', 'rs', 'sql', 'xml', 'zig', 'pug', 'http', 'less', 'styl', 'jsx', 'tsx', 'astro', 'svelte', 'wasm', 'vb', 'bat', 'cs', 'cpp', 'mermaid'],
    },

    markdownEnhance: {
      demo: true,
      chartjs: true,
      echarts: true,
      mermaid: true,
      flowchart: true,
    },
    markdownPower: {
      imageSize: 'all',
      pdf: true,
      caniuse: true,
      bilibili: true,
      youtube: true,
      codepen: true,
      replit: true,
      codeSandbox: true,
      jsfiddle: true,
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

  },
})
