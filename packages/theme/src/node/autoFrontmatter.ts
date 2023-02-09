import { createRequire } from 'node:module'
import type { AutoFrontmatterOptions } from '@vuepress-plume/vuepress-plugin-auto-frontmatter'
import type { App } from '@vuepress/core'
import { format } from 'date-fns'
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
          title(title: string) {
            if (title) return title
            return title
          },
          author(author: string) {
            if (author) return author
            return localeOption.avatar?.name || pkg.author || ''
          },
          createTime(formatTime: string, _, { createTime }) {
            if (formatTime) return formatTime
            return format(new Date(createTime), 'yyyy/MM/dd hh:mm:ss')
          },
          permalink(permalink: string, _, { filepath }) {
            if (permalink) return permalink
            return permalink
          },
        },
      },
    ],
  }
}
