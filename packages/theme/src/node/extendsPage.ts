import type { Page } from '@vuepress/core'
import { path } from '@vuepress/utils'
import type {
  CategoryData,
  PlumeThemeLocaleOptions,
  PlumeThemePageData,
  PlumeThemePostFrontmatter,
} from '../shared'
import { formatDate } from './utils'

function normalizePath(filepath: string): string {
  return filepath.replace(/^\//, '')
}

let uuid = 10000
const cache: Record<string, number> = {}
export const extendsPage = (
  page: Page<PlumeThemePageData>,
  localeOption: PlumeThemeLocaleOptions
): void => {
  const pagePath = page.filePathRelative || ''
  if (page.frontmatter.pageType) return
  const { notes } = localeOption
  const frontmatter = page.frontmatter as PlumeThemePostFrontmatter
  let category: CategoryData = []
  if (notes && notes.dir && pagePath.startsWith(normalizePath(notes.dir))) {
    page.data.isNote = true
    const filepath = path.relative(notes.dir, pagePath)
    if (filepath) {
      const note = filepath.split('/')[0]
      const currentNote = notes.notes.find(({ link }) =>
        normalizePath(link).startsWith(note)
      )
      if (currentNote) {
        !cache[currentNote.text] && (cache[currentNote.text] = uuid++)
        category.push({
          type: cache[currentNote.text],
          name: currentNote.text,
        })
      }
    }
  } else {
    category = pagePath
      .split('/')
      .slice(0, -1)
      .map((category) => {
        const match = category.match(/^(\d+)?(?:\.?)([^]+)$/) || []
        !cache[match[2]] && !match[1] && (cache[match[2]] = uuid++)
        return {
          type: Number(match[1] || cache[match[2]]),
          name: match[2],
        }
      })
  }
  page.data.category = category || []
  page.data.createTime = formatDate(frontmatter.createTime)
  page.data.tags = frontmatter.tags || []
  page.data.path = page.path
  page.data.author = frontmatter.author || ''
}
