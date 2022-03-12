import type { Page } from '@vuepress/core'

export function pageFilter(page: Page): boolean {
  return !!page.pathInferred && !!page.filePath && !page.frontmatter.home
}
