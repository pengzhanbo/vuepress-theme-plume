import path from 'node:path'
import type { App, PluginConfig } from '@vuepress/core'
import { activeHeaderLinksPlugin } from '@vuepress/plugin-active-header-links'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { externalLinkIconPlugin } from '@vuepress/plugin-external-link-icon'
import { gitPlugin } from '@vuepress/plugin-git'
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom'
import { nprogressPlugin } from '@vuepress/plugin-nprogress'
import { palettePlugin } from '@vuepress/plugin-palette'
import { searchPlugin } from '@vuepress/plugin-search'
import { themeDataPlugin } from '@vuepress/plugin-theme-data'
import { autoFrontmatterPlugin } from '@vuepress-plume/plugin-auto-frontmatter'
import { baiduTongjiPlugin } from '@vuepress-plume/plugin-baidu-tongji'
import { blogDataPlugin } from '@vuepress-plume/plugin-blog-data'
import { caniusePlugin } from '@vuepress-plume/plugin-caniuse'
import { copyCodePlugin } from '@vuepress-plume/plugin-copy-code'
import { iconifyPlugin } from '@vuepress-plume/plugin-iconify'
import { notesDataPlugin } from '@vuepress-plume/plugin-notes-data'
import { shikijiPlugin } from '@vuepress-plume/plugin-shikiji'
import { commentPlugin } from 'vuepress-plugin-comment2'
import { type MarkdownEnhanceOptions, mdEnhancePlugin } from 'vuepress-plugin-md-enhance'
import { readingTimePlugin } from 'vuepress-plugin-reading-time2'
import { seoPlugin } from 'vuepress-plugin-seo2'
import { sitemapPlugin } from 'vuepress-plugin-sitemap2'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../shared/index.js'
import autoFrontmatter from './autoFrontmatter.js'

export function setupPlugins(app: App, options: PlumeThemePluginOptions, localeOptions: PlumeThemeLocaleOptions): PluginConfig {
  const isProd = !app.env.isDev

  const locales = (localeOptions.locales || {}) as PlumeThemeLocaleOptions
  const localeNotesDirs = Object.keys(locales)
    .map((locale) => {
      const dir = locales[locale].notes?.dir || ''
      return dir
        ? path.join(locale, dir, '**').replace(/\\+/g, '/').replace(/^\//, '')
        : ''
    })
    .filter(Boolean)

  const plugins: PluginConfig = [
    palettePlugin({ preset: 'sass' }),

    themeDataPlugin({
      themeData: {
        ...localeOptions,
        notes: localeOptions.notes
          ? { dir: localeOptions.notes.dir, link: localeOptions.notes.link }
          : undefined,
      } as any,
    }),

    autoFrontmatterPlugin(autoFrontmatter(app, options, localeOptions)),

    blogDataPlugin({
      include: localeOptions.blog?.include ?? ['**/*.md'],
      exclude: [
        '**/{README,readme,index}.md',
        '.vuepress/',
        'node_modules/',
        ...(localeOptions.blog?.exclude ?? []),
        ...localeNotesDirs,
      ].filter(Boolean),
      sortBy: 'createTime',
      excerpt: true,
      pageFilter(page: any) {
        if (page.frontmatter.article !== undefined)
          return !!page.frontmatter.article

        return true
      },
      extendBlogData(page: any) {
        return {
          categoryList: page.data.categoryList,
          tags: page.frontmatter.tags,
          sticky: page.frontmatter.sticky,
          createTime: page.data.frontmatter.createTime,
          lang: page.lang,
        }
      },
    }),

    iconifyPlugin(),

    activeHeaderLinksPlugin({
      headerLinkSelector: 'a.outline-link',
      headerAnchorSelector: '.header-anchor',
      delay: 200,
      offset: 20,
    }),
  ]

  if (options.readingTime !== false)
    plugins.push(readingTimePlugin(options.readingTime || {}))

  if (localeOptions.notes)
    plugins.push(notesDataPlugin(localeOptions.notes))

  if (options.nprogress !== false)
    plugins.push(nprogressPlugin())

  if (options.git !== false) {
    plugins.push(gitPlugin({
      createdTime: false,
      updatedTime: localeOptions.lastUpdated !== false,
      contributors: localeOptions.contributors !== false,
    }))
  }

  if (options.mediumZoom !== false) {
    plugins.push(mediumZoomPlugin({
      selector: '.plume-content > img, .plume-content :not(a) > img',
      zoomOptions: {
        background: 'var(--vp-c-bg)',
      },
      delay: 300,
    }))
  }

  if (options.caniuse !== false) {
    plugins.push(caniusePlugin(
      options.caniuse || {
        mode: 'embed',
      },
    ))
  }

  if (options.externalLinkIcon !== false) {
    plugins.push(externalLinkIconPlugin({
      locales: Object.entries(localeOptions.locales || {}).reduce(
        (result: Record<string, any>, [key, value]) => {
          result[key] = {
            openInNewWindow:
              value.openInNewWindow ?? localeOptions.openInNewWindow,
          }
          return result
        },
        {},
      ),
    }))
  }

  if (options.search !== false)
    plugins.push(searchPlugin(options.search))

  if (options.docsearch !== false && !options.search) {
    if (options.docsearch?.appId && options.docsearch?.apiKey) {
      plugins.push(docsearchPlugin(options.docsearch))
    }
    else {
      console.error(
        'docsearch plugin: appId and apiKey are both required',
      )
    }
  }

  if (options.shikiji !== false) {
    plugins.push(shikijiPlugin({
      theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
      ...(options.shikiji ?? {}),
    }))
  }

  if (options.copyCode !== false) {
    plugins.push(copyCodePlugin({
      selector: '.plume-content div[class*="language-"] pre',
      ...options.copyCode,
    }))
  }

  if (options.markdownEnhance !== false) {
    plugins.push(mdEnhancePlugin(
      Object.assign(
        {
          hint: true, // info note tip warning danger details
          codetabs: true,
          tabs: true,
          align: true,
          mark: true,
          tasklist: true,
          demo: true,
          attrs: true,
          sup: true,
          sub: true,
        } as MarkdownEnhanceOptions,
        options.markdownEnhance || {},
      ),
    ))
  }

  if (options.comment !== false)
    plugins.push(commentPlugin(options.comment || {}))

  if (options.baiduTongji !== false && options.baiduTongji?.key)
    plugins.push(baiduTongjiPlugin(options.baiduTongji))

  if (options.sitemap !== false && localeOptions.hostname && isProd) {
    plugins.push(sitemapPlugin({
      hostname: localeOptions.hostname,
    }))
  }

  if (options.seo !== false && localeOptions.hostname && isProd) {
    plugins.push(seoPlugin({
      hostname: localeOptions.hostname || '',
      author: localeOptions.avatar?.name,
    }))
  }

  return plugins
}
