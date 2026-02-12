import type { LLMPage, LlmsPluginOptions, LLMState } from '@vuepress/plugin-llms'
import type { App, Page, PluginConfig } from 'vuepress'
import type { ThemePageData, ThemeSidebarItem } from '../../shared/index.js'
import { generateTOCLink as rawGenerateTOCLink, llmsPlugin as rawLlmsPlugin } from '@vuepress/plugin-llms'
import { ensureEndingSlash, ensureLeadingSlash, isPlainObject } from 'vuepress/shared'
import { getThemeConfig } from '../loadConfig/index.js'
import { isEncryptPage } from '../prepare/prepareEncrypt.js'
import { withBase } from '../utils/index.js'

const ENCRYPT_CONTAINER_RE = /(?:^|\n)(?<marker>\s*:{3,})\s*encrypt\b[\s\S]*?\n\k<marker>(?:\n|$)/g

export function llmsPlugin(app: App, userOptions: true | LlmsPluginOptions): PluginConfig {
  if (!app.env.isBuild)
    return []

  const { llmsTxtTemplateGetter, transformMarkdown, ...userLLMsTxt } = isPlainObject(userOptions) ? userOptions : {}

  function tocGetter(llmPages: LLMPage[], llmState: LLMState): string {
    const options = getThemeConfig()
    const { currentLocale } = llmState
    const collections = options.locales?.[currentLocale]?.collections || []

    if (!collections.length)
      return ''

    let tableOfContent = ''
    const usagePages: LLMPage[] = []

    collections
      .filter(item => item.type === 'post')
      .forEach(({ title, linkPrefix, link }) => {
        tableOfContent += `### ${title}\n\n`
        const withLinkPrefix = genStarsWith(linkPrefix, currentLocale)
        const withLink = genStarsWith(link, currentLocale)
        const withFallback = genStarsWith('/article/', currentLocale)
        const list: string[] = []
        llmPages.forEach((page) => {
          if (withLinkPrefix(page.path) || withLink(page.path) || withFallback(page.path)) {
            usagePages.push(page)
            list.push(rawGenerateTOCLink(page, llmState))
          }
        })
        tableOfContent += `${list.filter(Boolean).join('')}\n`
      })

    const generateTOCLink = (path: string): string => {
      const filepath = path.endsWith('/') ? `${path}README.md` : path.endsWith('.md') ? path : `${path || 'README'}.md`
      const link = path.endsWith('/') ? `${path}index.html` : `${path}.html`
      const page = llmPages.find((item) => {
        return ensureLeadingSlash(item.filePathRelative || '') === filepath || link === item.path
      })

      if (page) {
        usagePages.push(page)
        return rawGenerateTOCLink(page, llmState)
      }
      return ''
    }

    const processAutoSidebar = (prefix: string): string[] => {
      const list: string[] = []
      llmPages.forEach((page) => {
        if (ensureLeadingSlash(page.filePathRelative || '').startsWith(prefix)) {
          usagePages.push(page)
          list.push(rawGenerateTOCLink(page, llmState))
        }
      })
      return list.filter(Boolean)
    }

    const processSidebar = (items: (string | ThemeSidebarItem)[], prefix: string): string[] => {
      const result: string[] = []
      items.forEach((item) => {
        if (typeof item === 'string') {
          result.push(generateTOCLink(normalizePath(prefix, item)))
        }
        else {
          if (item.link) {
            result.push(generateTOCLink(normalizePath(prefix, item.link)))
          }
          if (item.items === 'auto') {
            result.push(...processAutoSidebar(normalizePath(prefix, item.prefix)))
          }
          else if (item.items?.length) {
            result.push(...processSidebar(item.items, normalizePath(prefix, item.prefix)))
          }
        }
      })
      return result
    }

    // Collections
    collections
      .filter(collection => collection.type === 'doc')
      .forEach(({ dir, title, sidebar = [] }) => {
        tableOfContent += `### ${title}\n\n`
        const prefix = normalizePath(ensureLeadingSlash(withBase(dir, currentLocale)))
        if (sidebar === 'auto') {
          tableOfContent += `${processAutoSidebar(prefix).join('')}\n`
        }
        else if (sidebar.length) {
          const home = generateTOCLink(ensureEndingSlash(prefix))
          const list = processSidebar(sidebar, prefix)
          if (home && !list.includes(home)) {
            list.unshift(home)
          }
          tableOfContent += `${list.join('')}\n`
        }
      })

    // Others
    const unUsagePages = llmPages.filter(page => !usagePages.includes(page))
    if (unUsagePages.length) {
      tableOfContent += '### Others\n\n'
      tableOfContent += unUsagePages
        .map(page => rawGenerateTOCLink(page, llmState))
        .join('')
    }

    return tableOfContent
  }

  return [rawLlmsPlugin({
    // 启用全站加密、或者页面被加密的情况下不启用
    filter: (page) => {
      const options = getThemeConfig()
      return options.encrypt?.global ? false : !isEncryptPage(page as Page<ThemePageData>, options.encrypt)
    },
    locale: '/',
    ...userLLMsTxt,
    transformMarkdown(markdown, page) {
      markdown = markdown.replaceAll(ENCRYPT_CONTAINER_RE, '')
      return transformMarkdown?.(markdown, page) ?? markdown
    },
    llmsTxtTemplateGetter: {
      toc: tocGetter,
      ...llmsTxtTemplateGetter,
    },
  })]
}

function genStarsWith(stars: string | undefined, locale: string) {
  return (url: string): boolean => {
    if (!stars)
      return false
    return url.startsWith(withBase(stars, locale))
  }
}

function normalizePath(prefix: string, path = ''): string {
  if (path.startsWith('/'))
    return path

  return `${ensureEndingSlash(prefix)}${path}`
}
