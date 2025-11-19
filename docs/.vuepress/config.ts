import type { UserConfig } from 'vuepress'
import fs from 'node:fs'
import path from 'node:path'
import { viteBundler } from '@vuepress/bundler-vite'
import { addViteOptimizeDepsInclude, addViteSsrExternal } from '@vuepress/helper'
import { defineUserConfig } from 'vuepress'
import { theme } from './theme.js'

const pnpmWorkspace = fs.readFileSync(path.resolve(__dirname, '../../pnpm-workspace.yaml'), 'utf-8')
const vuepress = pnpmWorkspace.match(/vuepress:\s(2.+)/)?.[1] || ''

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',
  source: path.resolve(__dirname, '../'),
  public: path.resolve(__dirname, 'public'),

  locales: {
    '/': { title: 'Plume 主题', lang: 'zh-CN' },
    '/en/': { title: 'Plume Theme', lang: 'en-US' },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['meta', { name: 'google-site-verification', content: 'AaTP7bapCAcoO9ZGE67ilpy99GL6tYqtD30tRHjO9Ps' }],
  ],

  pagePatterns: ['**/*.md', '!**/*.snippet.md', '!.vuepress', '!node_modules', '!docs/guide/repl/demo/*'],

  extendsBundlerOptions(bundlerOptions, app) {
    addViteOptimizeDepsInclude(bundlerOptions, app, '@simonwep/pickr')
    addViteSsrExternal(bundlerOptions, app, '@simonwep/pickr')
  },

  define: {
    __VUEPRESS_VERSION__: vuepress,
    // debug hydration mismatch
    // __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
  },

  alias: {
    '~/theme': path.resolve(__dirname, './themes'),
    '~/components': path.resolve(__dirname, './themes/components'),
    '~/composables': path.resolve(__dirname, './themes/composables'),
  },

  bundler: viteBundler(),
  shouldPrefetch: false,

  theme,
}) as UserConfig
