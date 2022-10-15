import type { Plugin } from '@vuepress/core'
import { gitPlugin } from '@vuepress/plugin-git'
import type { PlumeThemePluginOptions } from '../../shared/index.js'

const isProd = process.env.NODE_ENV === 'production'

export const resolveGit = (plugins: PlumeThemePluginOptions): Plugin => {
  if (plugins.git === false || !isProd) return [] as unknown as Plugin
  return gitPlugin({
    createdTime: true,
    updatedTime: true,
    contributors: false,
  })
}
