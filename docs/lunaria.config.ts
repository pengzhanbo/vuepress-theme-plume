import { defineConfig } from '@lunariajs/core/config'
export default defineConfig({
  repository: {
    name: 'pengzhanbo/vuepress-theme-plume',
    rootDir: 'docs',
  },
  files: [
    {
      include: ['{config,guide,tools}/**/*.md'],
      pattern: {
        source: '@path',
        locales: '@lang/@path',
      },
      type: 'universal',
      exclude: ['**/*.snippet.md'],
    },
  ],
  sourceLocale: {
    label: '简体中文',
    lang: 'zh',
  },
  locales: [
    {
      label: 'English',
      lang: 'en',
    },
  ],
  outDir: '.vuepress/dist/_translations',
  tracking: {
    ignoredKeywords: ['lunaria-ignore'],
  },
})
