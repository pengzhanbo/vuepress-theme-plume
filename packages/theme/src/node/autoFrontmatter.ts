import { createRequire } from 'node:module'
import type { AutoFrontmatterOptions } from '@vuepress-plume/vuepress-plugin-auto-frontmatter'
import type { App } from '@vuepress/core'
import type { PlumeThemeLocaleOptions } from '../shared/index.js'

export default function (
  app: App,
  localeOption: PlumeThemeLocaleOptions
): AutoFrontmatterOptions {
  // const sourceDir = app.dir.source()
  const require = createRequire(process.cwd())
  const pkg = require('./package.json') || {}

  return {
    include: [],
    formatter: [
      {
        include: '**/{readme,README,index}.md',
        formatter: {},
      },
      {
        include: '*',
        formatter: {
          author(author: string) {
            if (author) return author
            return pkg.author || ''
          },
          createTime(formatTime: string, data, { createTime }) {
            if (formatTime) return formatTime
            return createTime
          },
        },
      },
    ],
  }
}
