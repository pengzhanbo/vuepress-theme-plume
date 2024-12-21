import type { App, PluginConfig } from 'vuepress/core'
import type { PlumeThemeLocaleOptions, PlumeThemePluginOptions } from '../../shared/index.js'
import { contentUpdatePlugin } from '@vuepress-plume/plugin-content-update'
import { fontsPlugin } from '@vuepress-plume/plugin-fonts'
import { searchPlugin } from '@vuepress-plume/plugin-search'
import { shikiPlugin } from '@vuepress-plume/plugin-shikiji'
import { isPlainObject } from '@vuepress/helper'
import { cachePlugin } from '@vuepress/plugin-cache'
import { commentPlugin } from '@vuepress/plugin-comment'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { gitPlugin } from '@vuepress/plugin-git'
import { markdownHintPlugin } from '@vuepress/plugin-markdown-hint'
import { markdownImagePlugin } from '@vuepress/plugin-markdown-image'
import { markdownIncludePlugin } from '@vuepress/plugin-markdown-include'
import { markdownMathPlugin } from '@vuepress/plugin-markdown-math'
import { nprogressPlugin } from '@vuepress/plugin-nprogress'
import { photoSwipePlugin } from '@vuepress/plugin-photo-swipe'
import { readingTimePlugin } from '@vuepress/plugin-reading-time'
import { seoPlugin, type SeoPluginOptions } from '@vuepress/plugin-seo'
import { sitemapPlugin, type SitemapPluginOptions } from '@vuepress/plugin-sitemap'
import { watermarkPlugin } from '@vuepress/plugin-watermark'
import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance'
import { markdownPowerPlugin } from 'vuepress-plugin-md-power'
import { resolveDocsearchOptions, resolveSearchOptions } from '../config/index.js'

export interface SetupPluginOptions {
  app: App
  pluginOptions: PlumeThemePluginOptions
  hostname?: string
  cache?: false | 'memory' | 'filesystem'
}

export function getPlugins(
  options: PlumeThemeLocaleOptions,
  {
    app,
    pluginOptions,
    hostname,
    cache,
  }: SetupPluginOptions,
): PluginConfig {
  const isProd = app.env.isBuild

  const plugins: PluginConfig = [
    fontsPlugin(),
    contentUpdatePlugin(),
    markdownHintPlugin({ hint: true, alert: true, injectStyles: false }),
  ]

  if (pluginOptions.readingTime !== false) {
    plugins.push(readingTimePlugin({
      locales: {
        '/zh/': {
          word: '$word 字',
          less1Minute: '小于 1 分钟',
          time: '约 $time 分钟',
        },
      },
      ...pluginOptions.readingTime,
    }))
  }

  if (pluginOptions.nprogress !== false) {
    plugins.push(nprogressPlugin())
  }

  if (pluginOptions.git ?? isProd) {
    const excludes = ['home', 'friends', 'page', 'custom', false]
    const changelogOptions = isPlainObject(options.changelog) ? options.changelog : {}
    plugins.push(gitPlugin({
      createdTime: false,
      updatedTime: options.lastUpdated !== false,
      contributors: isPlainObject(options.contributors) || options.contributors === true
        ? {
            avatar: true,
            ...options.contributors === true ? {} : options.contributors,
          }
        : false,
      changelog: options.changelog && (options.docsRepo || changelogOptions.repoUrl)
        ? { repoUrl: options.docsRepo, ...changelogOptions }
        : false,
      filter(page) {
        if (page.frontmatter.home || excludes.includes(page.frontmatter.pageLayout as string))
          return false
        return true
      },
    }))
  }

  if (pluginOptions.photoSwipe !== false) {
    plugins.push(photoSwipePlugin({
      selector: '.plume-content > img, .plume-content :not(a) > img',
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

  if (pluginOptions.markdownEnhance !== false)
    plugins.push(mdEnhancePlugin(pluginOptions.markdownEnhance))

  if (pluginOptions.markdownPower !== false) {
    plugins.push(markdownPowerPlugin({
      fileTree: true,
      plot: true,
      icons: true,
      ...pluginOptions.markdownPower || {},
      repl: pluginOptions.markdownPower?.repl
        ? { theme: shikiTheme, ...pluginOptions.markdownPower?.repl }
        : pluginOptions.markdownPower?.repl,
    }))
  }

  if (pluginOptions.markdownMath !== false) {
    plugins.push(markdownMathPlugin(pluginOptions.markdownMath ?? { type: 'katex' }))
  }

  if (pluginOptions.markdownImage) {
    plugins.push(markdownImagePlugin(pluginOptions.markdownImage))
  }

  if (pluginOptions.markdownInclude !== false) {
    plugins.push(markdownIncludePlugin(isPlainObject(pluginOptions.markdownInclude) ? pluginOptions.markdownInclude : {}))
  }

  if (pluginOptions.watermark) {
    plugins.push(watermarkPlugin({
      delay: 300,
      enabled: true,
      ...isPlainObject(pluginOptions.watermark) ? pluginOptions.watermark : {},
    }))
  }

  if (pluginOptions.comment) {
    plugins.push(commentPlugin(pluginOptions.comment))
  }

  if (pluginOptions.sitemap !== false && isProd) {
    const sitemapOptions = isPlainObject(pluginOptions.sitemap) ? pluginOptions.sitemap : {}
    sitemapOptions.hostname ||= hostname

    if (sitemapOptions.hostname)
      plugins.push(sitemapPlugin(sitemapOptions as SitemapPluginOptions))
  }

  if (pluginOptions.seo !== false && hostname && isProd) {
    const seoOptions = isPlainObject(pluginOptions.seo) ? pluginOptions.seo : {}
    seoOptions.hostname ||= hostname
    if (seoOptions.hostname)
      plugins.push(seoPlugin(seoOptions as SeoPluginOptions))
  }

  if (cache !== false) {
    plugins.push(cachePlugin({ type: cache || 'filesystem' }))
  }

  return plugins
}
