import type { App } from 'vuepress'
import type { TagColors } from '../features/tag-color.js'
import { toArray } from '@pengzhanbo/utils'
import { getTagClassName, resolveTagColors } from '../features/tag-color.js'
import { genTempCode, perf, writeTemp } from '../utils/index.js'

/**
 * Prepare article tag colors
 *
 * 准备文章标签颜色，收集页面中使用的标签并生成对应的 CSS 和 JS 文件
 */
export async function prepareArticleTagColors(app: App): Promise<void> {
  perf.mark('prepare:tag-colors')
  const { js, css } = genCode(app)

  await writeTemp(app, 'internal/articleTagColors.css', css)
  await writeTemp(app, 'internal/articleTagColors.js', js)

  perf.log('prepare:tag-colors')
}

/**
 * Generate tag color CSS and JS code
 *
 * 生成标签颜色的 CSS 和 JS 代码，遍历所有页面收集标签并生成对应的样式和脚本
 */
export function genCode(app: App): { js: string, css: string } {
  const articleTagColors = new Map<string, string>()
  const tagColors = new Map<string, TagColors>()

  app.pages.forEach((page) => {
    const { frontmatter: { tags } } = page
    if (!tags)
      return

    toArray(tags).forEach((tag) => {
      if (!tag)
        return

      const name = tag as string
      if (articleTagColors.has(name))
        return

      const className = getTagClassName(name)
      articleTagColors.set(name, className)
      // Colors are resolved from the tag text, tags sharing a hash share a class.
      if (!tagColors.has(className))
        tagColors.set(className, resolveTagColors(name))
    })
  })

  const js = genTempCode(app, {
    name: 'articleTagColors',
    content: Object.fromEntries(articleTagColors.entries()),
    before: `import './articleTagColors.css'`,
  })
  const css = [...tagColors]
    .map(([className, colors]) => genTagCSS(className, colors))
    .join('')

  return { js, css }
}

/**
 * Generate the CSS of a tag, including its dark mode colors.
 *
 * 生成单个标签的 CSS，包含其深色模式下的颜色。
 *
 * @param className - Class name suffix / 类名后缀
 * @param colors - Tag colors / 标签配色
 */
function genTagCSS(className: string, colors: TagColors): string {
  const { light, dark } = colors

  return `\
.vp-tag-${className} {
  --vp-tag-color: ${light.color};
  --vp-tag-hover-color: ${light.hoverColor};
  --vp-tag-bg: ${light.backgroundColor};
}

[data-theme="dark"] .vp-tag-${className} {
  --vp-tag-color: ${dark.color};
  --vp-tag-hover-color: ${dark.hoverColor};
  --vp-tag-bg: ${dark.backgroundColor};
}
`
}
