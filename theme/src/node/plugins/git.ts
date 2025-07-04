import type { App, PluginConfig } from 'vuepress'
import type { ThemeBuiltinPlugins } from '../../shared/index.js'
import { isPlainObject } from '@vuepress/helper'
import { gitPlugin as rawGitPlugin } from '@vuepress/plugin-git'
import { getThemeConfig } from '../loadConfig/index.js'

export function gitPlugin(app: App, pluginOptions: ThemeBuiltinPlugins): PluginConfig {
  const options = getThemeConfig()

  const git = pluginOptions.git ?? app.env.isBuild

  if (!git) {
    // disable all git features
    return [rawGitPlugin({
      createdTime: false,
      updatedTime: false,
      contributors: false,
      changelog: false,
    })]
  }

  const excludes = ['home', 'friends', 'page', 'custom', false]
  const changelogOptions = isPlainObject(options.changelog) ? options.changelog : {}

  return [rawGitPlugin({
    updatedTime: options.lastUpdated !== false,
    contributors: isPlainObject(options.contributors) || options.contributors === true
      ? {
          avatar: true,
          ...options.contributors === true ? {} : options.contributors,
        }
      : false,
    changelog: options.changelog && options.docsRepo
      ? { repoUrl: options.docsRepo, ...changelogOptions }
      : options.changelog,
    filter(page) {
      if (page.frontmatter.home || excludes.includes(page.frontmatter.pageLayout as string))
        return false
      return true
    },
  })]
}
