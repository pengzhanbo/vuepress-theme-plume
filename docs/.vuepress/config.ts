import * as path from 'node:path'
import process from 'node:process'
import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'
import { defineUserConfig } from '@vuepress/cli'
import { theme } from './theme.js'

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',
  title: 'Plume Theme',
  description: '',
  source: path.resolve(__dirname, '../'),
  public: path.resolve(__dirname, 'public'),
  locales: {
    '/': { title: 'Plume主题', description: '', lang: 'zh-CN' },
    '/en/': { title: 'Plume Theme', description: '', lang: 'en' },
  },
  bundler: process.env.DOCS_BUNDLER === 'webpack' ? webpackBundler() : viteBundler(),
  theme,
})
