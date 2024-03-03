import * as path from 'node:path'
import { type UserConfig, defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { theme } from './theme.js'

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',
  source: path.resolve(__dirname, '../'),
  public: path.resolve(__dirname, 'public'),
  locales: {
    '/': { title: 'Plume主题', description: '', lang: 'zh-CN' },
    '/en/': { title: 'Plume Theme', description: '', lang: 'en-US' },
  },

  bundler: viteBundler(),

  theme,
}) as UserConfig
