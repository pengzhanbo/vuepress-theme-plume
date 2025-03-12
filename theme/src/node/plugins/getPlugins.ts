import type { SeoPluginOptions } from '@vuepress/plugin-seo'
import type { SitemapPluginOptions } from '@vuepress/plugin-sitemap'
import type { ThemeOptions } from 'vuepress-plugin-md-power'
import type { App, PluginConfig } from 'vuepress/core'
import type { PlumeThemePluginOptions } from '../../shared/index.js'
import { uniq } from '@pengzhanbo/utils'
import { fontsPlugin } from '@vuepress-plume/plugin-fonts'
import { searchPlugin } from '@vuepress-plume/plugin-search'
import { isPlainObject } from '@vuepress/helper'
import { cachePlugin } from '@vuepress/plugin-cache'
import { commentPlugin } from '@vuepress/plugin-comment'
import { copyCodePlugin } from '@vuepress/plugin-copy-code'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { gitPlugin } from '@vuepress/plugin-git'
import { markdownHintPlugin } from '@vuepress/plugin-markdown-hint'
import { markdownImagePlugin } from '@vuepress/plugin-markdown-image'
import { markdownIncludePlugin } from '@vuepress/plugin-markdown-include'
import { markdownMathPlugin } from '@vuepress/plugin-markdown-math'
import { nprogressPlugin } from '@vuepress/plugin-nprogress'
import { photoSwipePlugin } from '@vuepress/plugin-photo-swipe'
import { readingTimePlugin } from '@vuepress/plugin-reading-time'
import { seoPlugin } from '@vuepress/plugin-seo'
import { shikiPlugin } from '@vuepress/plugin-shiki'
import { sitemapPlugin } from '@vuepress/plugin-sitemap'
import { watermarkPlugin } from '@vuepress/plugin-watermark'
import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance'
import { createCodeTabIconGetter, markdownPowerPlugin } from 'vuepress-plugin-md-power'
import { getThemeConfig } from '../loadConfig/index.js'

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
  const isProd = app.env.isBuild
  const { localeOptions: options } = getThemeConfig()

  const plugins: PluginConfig = [
    fontsPlugin(),
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
      plugins.push(docsearchPlugin(pluginOptions.docsearch))

    else
      console.error('docsearch plugin: appId and apiKey are both required')
  }
  else if (pluginOptions.search !== false) {
    plugins.push(searchPlugin(pluginOptions.search || {}))
  }

  if (pluginOptions.copyCode !== false) {
    const { ignoreSelector = [], ...copyCodeOptions } = pluginOptions.copyCode || {}
    plugins.push(copyCodePlugin({
      ignoreSelector: uniq(['.vp-copy-ignore', '.diff.remove', ...ignoreSelector]),
      ...copyCodeOptions,
    }))
  }

  const shikiOptions = pluginOptions.shiki

  const shikiTheme = shikiOptions && 'theme' in shikiOptions ? shikiOptions.theme : shikiOptions && 'themes' in shikiOptions ? shikiOptions.themes : { light: 'vitesse-light', dark: 'vitesse-dark' }

  if (shikiOptions !== false) {
    const { twoslash, codeBlockTitle: _, langs = [], ...restShikiOptions } = isPlainObject(shikiOptions) ? shikiOptions : {}
    const twoslashOptions = twoslash === true ? {} : twoslash
    const markdownPower = isPlainObject(pluginOptions.markdownPower) ? pluginOptions.markdownPower : {}
    const getIcon = createCodeTabIconGetter(markdownPower.codeTabs)
    plugins.push(shikiPlugin({
      // enable some default features
      langs: [
        ...twoslash ? ['js', 'ts', 'vue'] : [],
        ...langs,
      ],
      notationDiff: true,
      notationErrorLevel: true,
      notationFocus: true,
      notationHighlight: true,
      notationWordHighlight: true,
      highlightLines: true,
      collapsedLines: false,
      codeBlockTitle: (title, code) => {
        const icon = getIcon(title)
        return `<div class="code-block-title">
  <div class="code-block-title-bar">
    <span class="title">${icon ? `<VPIcon name="${icon}"/>` : ''}${title}</span>
  </div>
  ${code}
</div>`
      },
      twoslash: isPlainObject(twoslashOptions)
        ? {
            ...twoslashOptions,
            // inject markdown class
            floatingVue: { classMarkdown: 'vp-doc', ...twoslashOptions.floatingVue },
          }
        : twoslashOptions,
      ...('theme' in restShikiOptions ? {} : { themes: { light: 'vitesse-light', dark: 'vitesse-dark' } }),
      ...restShikiOptions,
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
      // TODO: repl 代码主题 配置仅支持 主题名，不支持注册自定义主题
      repl: pluginOptions.markdownPower?.repl
        ? { theme: shikiTheme as ThemeOptions, ...pluginOptions.markdownPower?.repl }
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
