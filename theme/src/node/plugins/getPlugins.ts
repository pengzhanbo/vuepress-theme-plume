import type { App, PluginConfig } from 'vuepress/core'
import { activeHeaderLinksPlugin } from '@vuepress/plugin-active-header-links'
import { cachePlugin } from '@vuepress/plugin-cache'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { gitPlugin } from '@vuepress/plugin-git'
import { photoSwipePlugin } from '@vuepress/plugin-photo-swipe'
import { nprogressPlugin } from '@vuepress/plugin-nprogress'
import { shikiPlugin } from '@vuepress-plume/plugin-shikiji'
import { commentPlugin } from '@vuepress/plugin-comment'
import { type MarkdownEnhancePluginOptions, mdEnhancePlugin } from 'vuepress-plugin-md-enhance'
import { readingTimePlugin } from '@vuepress/plugin-reading-time'
import { seoPlugin } from '@vuepress/plugin-seo'
import { sitemapPlugin } from '@vuepress/plugin-sitemap'
import { contentUpdatePlugin } from '@vuepress-plume/plugin-content-update'
import { searchPlugin } from '@vuepress-plume/plugin-search'
import { markdownPowerPlugin } from 'vuepress-plugin-md-power'
import { watermarkPlugin } from '@vuepress/plugin-watermark'
import { fontsPlugin } from '@vuepress-plume/plugin-fonts'
import type { PlumeThemePluginOptions } from '../../shared/index.js'
import {
  resolveDocsearchOptions,
  resolveSearchOptions,
} from '../config/index.js'
import { customContainerPlugins } from './containerPlugins.js'

export interface SetupPluginOptions {
  app: App
  pluginOptions: PlumeThemePluginOptions
  hostname?: string
  cache?: false | 'memory' | 'filesystem'
}

export function getPlugins({
  app,
  pluginOptions,
  hostname,
  cache,
}: SetupPluginOptions): PluginConfig {
  const isProd = !app.env.isDev

  const plugins: PluginConfig = [

    fontsPlugin(),
    contentUpdatePlugin(),
    activeHeaderLinksPlugin({
      headerLinkSelector: 'a.outline-link',
      headerAnchorSelector: '.header-anchor',
      delay: 200,
      offset: 20,
    }),

    ...customContainerPlugins,
  ]

  if (pluginOptions.readingTime !== false) {
    plugins.push(readingTimePlugin({
      locales: {
        '/zh/': {
          word: '$word字',
          less1Minute: '小于1分钟',
          time: '约$time分钟',
        },
      },
      ...pluginOptions.readingTime,
    }))
  }

  if (pluginOptions.nprogress !== false) {
    plugins.push(nprogressPlugin())
  }

  if (pluginOptions.git ?? isProd) {
    plugins.push(gitPlugin({
      createdTime: true,
      updatedTime: true,
      contributors: true,
    }))
  }

  if (pluginOptions.photoSwipe !== false) {
    plugins.push(photoSwipePlugin({
      selector: '.plume-content > img, .plume-content :not(a) > img',
      delay: 300,
    }))
  }

  if (pluginOptions.docsearch) {
    if (pluginOptions.docsearch.appId && pluginOptions.docsearch.apiKey)
      plugins.push(docsearchPlugin(resolveDocsearchOptions(app, pluginOptions.docsearch)))

    else
      console.error('docsearch plugin: appId and apiKey are both required')
  }
  else if (pluginOptions.search !== false) {
    plugins.push(searchPlugin(resolveSearchOptions(app, pluginOptions.search)))
  }

  const shikiOption = pluginOptions.shiki
  let shikiTheme: any = { light: 'vitesse-light', dark: 'vitesse-dark' }
  if (shikiOption !== false) {
    shikiTheme = shikiOption?.theme ?? shikiTheme
    plugins.push(shikiPlugin({
      theme: shikiTheme,
      ...(shikiOption ?? {}),
    }))
  }

  if (pluginOptions.markdownEnhance !== false) {
    plugins.push(mdEnhancePlugin(
      Object.assign(
        {
          hint: true, // info note tip warning danger details
          codetabs: true,
          tabs: true,
          align: true,
          mark: true,
          tasklist: true,
          attrs: true,
          sup: true,
          sub: true,
          alert: true,
          footnote: true,
          katex: true,
        } as MarkdownEnhancePluginOptions,
        pluginOptions.markdownEnhance || {},
      ),
    ))
  }

  if (pluginOptions.markdownPower !== false) {
    plugins.push(markdownPowerPlugin({
      caniuse: pluginOptions.caniuse,
      ...pluginOptions.markdownPower || {},
      repl: pluginOptions.markdownPower?.repl
        ? { theme: shikiTheme, ...pluginOptions.markdownPower?.repl }
        : pluginOptions.markdownPower?.repl,
    }))
  }

  if (pluginOptions.watermark) {
    plugins.push(watermarkPlugin({
      delay: 300,
      enabled: true,
      ...typeof pluginOptions.watermark === 'object' ? pluginOptions.watermark : {},
    }))
  }

  if (pluginOptions.comment) {
    plugins.push(commentPlugin(pluginOptions.comment))
  }

  if (pluginOptions.sitemap !== false && hostname && isProd) {
    plugins.push(sitemapPlugin({ hostname }))
  }

  if (pluginOptions.seo !== false && hostname && isProd) {
    plugins.push(seoPlugin({ hostname }))
  }

  if (cache !== false) {
    plugins.push(cachePlugin({ type: cache || 'filesystem' }))
  }

  return plugins
}
