import type { SeoPluginOptions } from '@vuepress/plugin-seo'
import type { SitemapPluginOptions } from '@vuepress/plugin-sitemap'
import type { App, PluginConfig } from 'vuepress/core'
import type { LocalSearchOptions, ThemeBuiltinPlugins } from '../../shared/index.js'
import { fontsPlugin } from '@vuepress-plume/plugin-fonts'
import { searchPlugin } from '@vuepress-plume/plugin-search'
import { isPlainObject } from '@vuepress/helper'
import { cachePlugin } from '@vuepress/plugin-cache'
import { commentPlugin } from '@vuepress/plugin-comment'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { nprogressPlugin } from '@vuepress/plugin-nprogress'
import { photoSwipePlugin } from '@vuepress/plugin-photo-swipe'
import { readingTimePlugin } from '@vuepress/plugin-reading-time'
import { seoPlugin } from '@vuepress/plugin-seo'
import { sitemapPlugin } from '@vuepress/plugin-sitemap'
import { watermarkPlugin } from '@vuepress/plugin-watermark'
import { replaceAssetsPlugin } from 'vuepress-plugin-replace-assets'
import { getThemeConfig } from '../loadConfig/index.js'
import { codePlugins } from './code.js'
import { gitPlugin } from './git.js'
import { markdownPlugins } from './markdown.js'

export function setupPlugins(
  app: App,
  pluginOptions: ThemeBuiltinPlugins,
): PluginConfig {
  const isProd = app.env.isBuild
  const options = getThemeConfig()
  const hostname = options.hostname

  const plugins: PluginConfig = [
    fontsPlugin(),
    ...codePlugins(pluginOptions),
    ...markdownPlugins(pluginOptions),
  ]

  // 页面加载进度插件
  if (pluginOptions.nprogress !== false) {
    plugins.push(nprogressPlugin())
  }

  // 阅读时间
  const readingTime = options.readingTime ?? pluginOptions.readingTime
  if (readingTime !== false) {
    plugins.push(readingTimePlugin({
      locales: {
        '/zh/': { word: '$word 字', less1Minute: '小于 1 分钟', time: '约 $time 分钟' },
      },
      ...readingTime,
    }))
  }

  // 图片浏览
  if (pluginOptions.photoSwipe !== false) {
    plugins.push(photoSwipePlugin({
      selector: '.plume-content > img, .plume-content :not(a) > img',
    }))
  }

  /**
   * 内容水印
   */
  const watermark = options.watermark ?? pluginOptions.watermark
  if (watermark) {
    plugins.push(watermarkPlugin({
      enabled: true,
      ...isPlainObject(watermark) ? watermark : {},
    }))
  }

  /**
   * 文章评论
   */
  const comment = options.comment ?? pluginOptions.comment
  if (comment) {
    plugins.push(commentPlugin(comment))
  }

  // 搜索
  if (options.search !== false) {
    const search = (options.search === true
      ? { provider: 'local' } as LocalSearchOptions
      : options.search)
    ?? (pluginOptions.docsearch
      ? { provider: 'algolia', ...pluginOptions.docsearch }
      : { provider: 'local', ...isPlainObject(pluginOptions.search) ? pluginOptions.search : {} })

    const { provider, ...searchOptions } = search
    if (provider === 'algolia') {
      if (search.appId && search.apiKey)
        plugins.push(docsearchPlugin(searchOptions))
      else
        console.error('docsearch plugin: appId and apiKey are both required')
    }
    else {
      plugins.push(searchPlugin(searchOptions))
    }
  }

  /**
   * git 插件配置
   * 1. 最后更新时间
   * 2. 贡献者列表
   * 3. 更新日志
   */
  plugins.push(...gitPlugin(app, pluginOptions))

  /**
   * 资源替换
   */
  const replaceAssets = options.replaceAssets ?? pluginOptions.replaceAssets
  if (replaceAssets) {
    plugins.push(replaceAssetsPlugin(replaceAssets))
  }

  /**
   * 站点地图，仅在生产构建时，且 hostname 存在时生效
   */
  if (pluginOptions.sitemap !== false && isProd) {
    const sitemapOptions = isPlainObject(pluginOptions.sitemap) ? pluginOptions.sitemap : {}
    sitemapOptions.hostname ||= hostname

    if (sitemapOptions.hostname)
      plugins.push(sitemapPlugin(sitemapOptions as SitemapPluginOptions))
  }

  /**
   * SEO，仅在生产构建时，且 hostname 存在时生效
   */
  if (pluginOptions.seo !== false && hostname && isProd) {
    const seoOptions = isPlainObject(pluginOptions.seo) ? pluginOptions.seo : {}
    seoOptions.hostname ||= hostname
    if (seoOptions.hostname)
      plugins.push(seoPlugin(seoOptions as SeoPluginOptions))
  }

  /**
   * 编译缓存，默认使用文件缓存
   */
  if (options.cache !== false) {
    plugins.push(cachePlugin({
      ...isPlainObject(pluginOptions.cache) ? pluginOptions.cache : {},
      type: options.cache || 'filesystem',
    }))
  }

  return plugins
}
