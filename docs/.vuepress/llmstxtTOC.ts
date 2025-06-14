import type { LLMPage, LLMState } from '@vuepress/plugin-llms'
import type { ThemeSidebarItem } from 'vuepress-theme-plume'
import { generateTOCLink as rawGenerateTOCLink } from '@vuepress/plugin-llms'
import { ensureEndingSlash, ensureLeadingSlash } from 'vuepress/shared'
import { zhNotes } from './notes/zh/index.js'

const noteNames = {
  '/guide/': '指南',
  '/config/': '配置',
  '/tools/': '工具',
}

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
      if (page.path.startsWith(prefix)) {
        usagePages.push(page)
        list.push(generateTOCLink(page.path))
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
  zhNotes.notes.forEach(({ dir, link, sidebar = [] }) => {
    tableOfContent += `### ${noteNames[link]}\n\n`

    if (sidebar === 'auto') {
      tableOfContent += `${processAutoSidebar(link).join('')}\n`
    }
    else if (sidebar.length) {
      const index = llmPages.findIndex(page => page.path === link)
      if (index !== -1) {
        usagePages.push(llmPages[index])
        tableOfContent += rawGenerateTOCLink(llmPages[index], llmState)
      }
      tableOfContent += `${processSidebar(sidebar, normalizePath('/notes/', dir)).join('')}\n`
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
