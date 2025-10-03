import type { LLMPage, LLMState } from '@vuepress/plugin-llms'
import type { ThemeSidebarItem } from 'vuepress-theme-plume'
import { generateTOCLink as rawGenerateTOCLink } from '@vuepress/plugin-llms'
import { ensureEndingSlash, ensureLeadingSlash } from 'vuepress/shared'
import { zhCollections } from './collections/zh/index.js'

function normalizePath(prefix: string, path = ''): string {
  if (path.startsWith('/'))
    return path

  return `${ensureEndingSlash(prefix)}${path}`
}

export function tocGetter(llmPages: LLMPage[], llmState: LLMState): string {
  let tableOfContent = ''
  const usagePages: LLMPage[] = []

  // Blog
  tableOfContent += `### 博客\n\n`
  const blogList: string[] = []
  llmPages.forEach((page) => {
    if (page.path.startsWith('/article/') || page.path.startsWith('/blog/')) {
      usagePages.push(page)
      blogList.push(rawGenerateTOCLink(page, llmState))
    }
  })
  tableOfContent += `${blogList.filter(Boolean).join('')}\n`

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

  // Notes
  zhCollections.filter(note => note.type === 'doc').forEach(({ dir, title, sidebar = [] }) => {
    tableOfContent += `### ${title}\n\n`
    const prefix = normalizePath(dir)
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
