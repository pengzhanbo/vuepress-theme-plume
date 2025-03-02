import type { Theme } from 'vuepress'
import process from 'node:process'
import { plumeTheme } from 'vuepress-theme-plume'

export const theme: Theme = plumeTheme({
  hostname: process.env.SITE_HOST || 'https://modenc.top',
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
      markmap: true,
    },
    markdownPower: {
      annotation: true,
      abbr: true,
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
      repo: 'modenicheng/discus-data',
      repoId: 'R_kgDOOBfQsg',
      category: 'Announcements',
      categoryId: 'DIC_kwDOOBfQss4CndTU',
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
    search: {
      // more options
    },
  },
})
