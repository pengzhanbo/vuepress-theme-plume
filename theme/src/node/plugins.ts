import type { App, PluginConfig } from 'vuepress/core'
import { activeHeaderLinksPlugin } from '@vuepress/plugin-active-header-links'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { externalLinkIconPlugin } from '@vuepress/plugin-external-link-icon'
import { gitPlugin } from '@vuepress/plugin-git'
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom'
import { nprogressPlugin } from '@vuepress/plugin-nprogress'
import { palettePlugin } from '@vuepress/plugin-palette'
import { themeDataPlugin } from '@vuepress/plugin-theme-data'
import { autoFrontmatterPlugin } from '@vuepress-plume/plugin-auto-frontmatter'
import { baiduTongjiPlugin } from '@vuepress-plume/plugin-baidu-tongji'
import { blogDataPlugin } from '@vuepress-plume/plugin-blog-data'
import { caniusePlugin } from '@vuepress-plume/plugin-caniuse'
import { copyCodePlugin } from '@vuepress-plume/plugin-copy-code'
import { iconifyPlugin } from '@vuepress-plume/plugin-iconify'
import { notesDataPlugin } from '@vuepress-plume/plugin-notes-data'
import { shikiPlugin } from '@vuepress-plume/plugin-shikiji'
import { commentPlugin } from '@vuepress/plugin-comment'
import { type MarkdownEnhanceOptions, mdEnhancePlugin } from 'vuepress-plugin-md-enhance'
import { readingTimePlugin } from '@vuepress/plugin-reading-time'
import { seoPlugin } from '@vuepress/plugin-seo'
import { sitemapPlugin } from '@vuepress/plugin-sitemap'
import { contentUpdatePlugin } from '@vuepress-plume/plugin-content-update'
import { searchPlugin } from '@vuepress-plume/plugin-search'
import type {
  PlumeThemeEncrypt,
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../shared/index.js'
import autoFrontmatter from './autoFrontmatter.js'
import { resolveLocaleOptions } from './resolveLocaleOptions.js'
import { pathJoin } from './utils.js'
import { resolveNotesList } from './resolveNotesList.js'
import { resolvedDocsearchOption, resolvedSearchOptions } from './searchPluginOptions.js'
import { customContainers } from './container.js'
import { BLOG_TAGS_COLORS_PRESET, generateBlogTagsColors } from './blogTags.js'
import { isEncryptPage } from './resolveEncrypt.js'

export function setupPlugins(
  app: App,
  options: PlumeThemePluginOptions,
  localeOptions: PlumeThemeLocaleOptions,
  encrypt?: PlumeThemeEncrypt,
): PluginConfig {
  const isProd = !app.env.isDev

  const notesList = resolveNotesList(localeOptions)
  const notesDirList = notesList
    .map(notes => notes.dir && pathJoin(notes.dir, '**').replace(/^\//, ''))
    .filter(Boolean)

  const blog = resolveLocaleOptions(localeOptions, 'blog')

  const plugins: PluginConfig = [
    palettePlugin({ preset: 'sass' }),

    themeDataPlugin({ themeData: localeOptions }),

    autoFrontmatterPlugin(autoFrontmatter(app, options, localeOptions)),

    blogDataPlugin({
      include: blog?.include ?? ['**/*.md'],
      exclude: [
        '**/{README,readme,index}.md',
        '.vuepress/',
        'node_modules/',
        ...(blog?.exclude ?? []),
        ...notesDirList,
      ].filter(Boolean),
      sortBy: 'createTime',
      excerpt: true,
      pageFilter: (page: any) => page.frontmatter.article !== undefined
        ? !!page.frontmatter.article
        : true,
      extraBlogData(extra) {
        extra.tagsColorsPreset = BLOG_TAGS_COLORS_PRESET
        extra.tagsColors = {}
      },
      extendBlogData: (page: any, extra) => {
        const tags = page.frontmatter.tags
        generateBlogTagsColors(extra.tagsColors, tags)
        const data: Record<string, any> = {
          categoryList: page.data.categoryList,
          tags,
          sticky: page.frontmatter.sticky,
          createTime: page.data.frontmatter.createTime,
          lang: page.lang,
        }
        isEncryptPage(page, encrypt) && (data.encrypt = true)
        return data
      },
    }),

    notesDataPlugin(notesList),

    iconifyPlugin(),

    contentUpdatePlugin(),

    activeHeaderLinksPlugin({
      headerLinkSelector: 'a.outline-link',
      headerAnchorSelector: '.header-anchor',
      delay: 200,
      offset: 20,
    }),

    ...customContainers,
  ]

  if (options.readingTime !== false) {
    plugins.push(readingTimePlugin({
      locales: {
        '/zh/': {
          word: '$word字',
          less1Minute: '小于1分钟',
          time: '约$time分钟',
        },
      },
      ...options.readingTime,
    }))
  }

  if (options.nprogress !== false)
    plugins.push(nprogressPlugin())

  if (options.git !== false) {
    plugins.push(gitPlugin({
      createdTime: false,
      updatedTime: resolveLocaleOptions(localeOptions, 'lastUpdated') !== false,
      contributors: resolveLocaleOptions(localeOptions, 'contributors') !== false,
    }))
  }

  if (options.mediumZoom !== false) {
    plugins.push(mediumZoomPlugin({
      selector: '.plume-content > img, .plume-content :not(a) > img',
      zoomOptions: { background: 'var(--vp-c-bg)' },
      delay: 300,
    }))
  }

  if (options.caniuse !== false)
    plugins.push(caniusePlugin(options.caniuse || { mode: 'embed' }))

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

  if (options.docsearch) {
    if (options.docsearch.appId && options.docsearch.apiKey)
      plugins.push(docsearchPlugin(resolvedDocsearchOption(app, options.docsearch)))

    else
      console.error('docsearch plugin: appId and apiKey are both required')
  }
  else if (options.search !== false) {
    plugins.push(searchPlugin(resolvedSearchOptions(app, options.search)))
  }

  const shikiOption = options.shiki || options.shikiji
  if (shikiOption !== false) {
    plugins.push(shikiPlugin({
      theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
      ...(shikiOption ?? {}),
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
          attrs: true,
          sup: true,
          sub: true,
          alert: true,
          footnote: true,
          katex: true,
        } as MarkdownEnhanceOptions,
        options.markdownEnhance || {},
      ),
    ))
  }

  if (options.comment)
    plugins.push(commentPlugin(options.comment))

  if (options.baiduTongji !== false && options.baiduTongji?.key)
    plugins.push(baiduTongjiPlugin(options.baiduTongji))

  const hostname = resolveLocaleOptions(localeOptions, 'hostname')
  if (options.sitemap !== false && hostname && isProd)
    plugins.push(sitemapPlugin({ hostname }))

  if (options.seo !== false && hostname && isProd) {
    plugins.push(seoPlugin({
      hostname,
      author: resolveLocaleOptions(localeOptions, 'avatar')?.name,
    }))
  }

  return plugins
}
