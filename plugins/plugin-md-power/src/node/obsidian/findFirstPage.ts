import type { App } from 'vuepress'
import { removeLeadingSlash } from '@vuepress/helper'
import { path, tinyglobby } from 'vuepress/utils'

const pagePaths: string[] = []

export function initPagePaths(app: App) {
  pagePaths.length = 0
  pagePaths.push(...tinyglobby.globSync(app.options.pagePatterns, {
    cwd: app.dir.source(),
    ignore: ['**/node_modules/**', '**/.vuepress/**'],
  }))
  sortPagePaths()
}

export function updatePagePaths(filepath: string, type: 'create' | 'delete') {
  if (!filepath)
    return
  if (type === 'create') {
    pagePaths.push(filepath)
  }
  if (type === 'delete' && pagePaths.includes(filepath)) {
    pagePaths.splice(pagePaths.indexOf(filepath), 1)
  }
  sortPagePaths()
}

export function findFirstPage(filename: string, currentPath: string) {
  const dirname = path.dirname(currentPath)
  let filepath = filename[0] === '.' ? path.join(dirname, filename) : removeLeadingSlash(filename)
  filepath = filepath.slice(-1) === '/' ? `${filepath}/README.md` : filepath
  filepath = path.extname(filepath) ? filepath : `${filepath}.md`
  return pagePaths.find(pagePath => pagePath === filepath || pagePath.endsWith(filepath))
}

function sortPagePaths() {
  pagePaths.sort((a, b) => {
    const al = a.split('/').length
    const bl = b.split('/').length
    return al - bl
  })
}
