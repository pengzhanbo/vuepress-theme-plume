import { createPage } from '@vuepress/core'
import type { App } from 'vuepress'
import { navbarList } from '../shared'

export const createBlogPage = async (app: App): Promise<void> => {
  const pagePromise = navbarList.map((nav) => {
    return createPage(app, {
      path: nav.link,
      frontmatter: {
        title: nav.label,
        ...nav.frontmatter,
      },
      content: '',
    })
  })
  const pageList = await Promise.all(pagePromise)
  pageList.forEach((page) => app.pages.push(page))
}
