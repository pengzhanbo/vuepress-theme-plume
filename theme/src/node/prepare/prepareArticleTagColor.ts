import type { App } from 'vuepress'
import { toArray } from '@pengzhanbo/utils'
import { logger, nanoid, resolveContent, writeTemp } from '../utils/index.js'

export type TagsColorsItem = readonly [
  string, // normal color
  string, // hover color
  string, // background color
]

export const PRESET: TagsColorsItem[] = [
  ['#6aa1b7', '#5086a1', 'rgba(131, 208, 218, 0.314)'],
  ['#299764', '#18794e', 'rgba(16, 185, 129, 0.14)'],
  ['#946300', '#915930', 'rgba(234, 179, 8, 0.14)'],
  ['#d5393e', '#b8272c', 'rgba(244, 63, 94, 0.14)'],
  ['#7e4cc9', '#6f42c1', 'rgba(159, 122, 234, 0.14)'],
  ['#3a5ccc', '#3451b2', 'rgba(100, 108, 255, 0.14)'],
  ['#fab10f', '#f39c12', 'rgba(255, 213, 0, 0.14)'],
  ['#cc6699', '#be3f7f', 'rgba(161, 54, 107, 0.14)'],
  ['#55aaee', '#2391e9', 'rgba(21, 123, 206, 0.1333)'],
  ['#9933cc', '#aa56d5', 'rgba(179, 102, 217, 0.2)'],
  ['#cc3366', '#d55680', 'rgba(217, 102, 140, 0.2)'],
  ['#cc9933', '#be7f3f', 'rgba(161, 107, 54, 0.2)'],
  ['#9966cc', '#7171b8', 'rgba(83, 83, 167, 0.14)'],
  ['#66cccc', '#3fbebe', 'rgba(54, 161, 161, 0.14)'],
  ['#3366cc', '#5680d5', 'rgba(102, 140, 217, 0.14)'],
  ['#339999', '#41c0c0', 'rgba(83, 198, 198, 0.2)'],
  ['#a6623b', '#c17950', 'rgba(199, 134, 97, 0.2411)'],
  ['#8ecaef', '#55afe7', 'rgba(42, 155, 225, 0.147)'],
]

// { index: className }
const cache: Record<number, string> = {}

export async function prepareArticleTagColors(app: App): Promise<void> {
  const start = performance.now()
  const { js, css } = genCode(app)
  await writeTemp(app, 'internal/articleTagColors.css', css)
  await writeTemp(app, 'internal/articleTagColors.js', js)
  if (app.env.isDebug) {
    logger.info(
      `Generate article tag colors: ${(performance.now() - start).toFixed(2)}ms`,
    )
  }
}

export function genCode(app: App): { js: string, css: string } {
  const articleTagColors: Record<string, string> = {}
  const tagList = new Set<string>()

  app.pages.forEach((page) => {
    const { frontmatter: { tags } } = page
    if (tags) {
      toArray(tags).forEach((tag) => {
        if (tag) {
          tagList.add(tag as string)
        }
      })
    }
  })

  tagList.forEach((tag) => {
    const code = getTagCode(tag)
    if (!cache[code]) {
      cache[code] = nanoid(4)
    }
    if (!articleTagColors[tag]) {
      articleTagColors[tag] = cache[code]
    }
  })

  const js = resolveContent(app, {
    name: 'articleTagColors',
    content: articleTagColors,
    before: `import './articleTagColors.css'`,
  })
  const css = genCSS()

  return { js, css }
}

function getTagCode(tag: string): number {
  tag = tag.toLowerCase()
  let code = 0
  for (let i = 0; i < tag.length; i++) {
    code += tag.charCodeAt(i)
  }
  return code % PRESET.length
}

function genCSS(): string {
  let css = ''

  for (const [code, className] of Object.entries(cache)) {
    const index = Number(code)
    const [color, hoverColor, backgroundColor] = PRESET[index]

    css += `\
.vp-tag-${className} {
  --vp-tag-color: ${color};
  --vp-tag-hover-color: ${hoverColor};
  --vp-tag-bg: ${backgroundColor};
}
`
  }

  return css
}
