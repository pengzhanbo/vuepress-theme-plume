import process from 'node:process'
import { plumeTheme } from 'vuepress-theme-plume'
import type { Theme } from 'vuepress'

export const theme: Theme = plumeTheme({
  hostname: process.env.SITE_HOST || 'https://plume.pengzhanbo.cn',
  plugins: {
    frontmatter: { exclude: ['**/*.snippet.*'] },

    shiki: { twoslash: true },

    markdownEnhance: {
      demo: true,
      include: true,
      chart: true,
      echarts: true,
      mermaid: true,
      flowchart: true,
    },
    markdownPower: {
      pdf: true,
      caniuse: true,
      plot: true,
      bilibili: true,
      youtube: true,
      icons: true,
      codepen: true,
      replit: true,
      codeSandbox: true,
      jsfiddle: true,
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
