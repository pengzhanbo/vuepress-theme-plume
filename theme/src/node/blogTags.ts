import { hasOwn, random, toArray } from '@pengzhanbo/utils'
export type BlogTagsColorsItem = readonly [
  string, // normal color
  string, // hover color
  string, // background color
]

export const BLOG_TAGS_COLORS_PRESET: BlogTagsColorsItem[] = [
  ['#6aa1b7', '#5086a1', 'rgba(131, 208, 218, 0.314)'],
  ['#299764', '#18794e', 'rgba(16, 185, 129, 0.14)'],
  ['#946300', '#915930', 'rgba(234, 179, 8, 0.14)'],
  ['#d5393e', '#b8272c', 'rgba(244, 63, 94, 0.14)'],
  ['#7e4cc9', '#6f42c1', 'rgba(159, 122, 234, 0.14)'],
  ['#3a5ccc', '#3451b2', 'rgba(100, 108, 255, 0.14)'],
  ['#f1c40f', '#f39c12', 'rgba(255, 213, 0, 0.14)'],
  ['#cc6699', '#c75191', 'rgba(255, 153, 204, 0.14)'],
]

const len = BLOG_TAGS_COLORS_PRESET.length
let prevIndex: number[] = []

function getRandom() {
  let index: number
  do
    index = random(0, len - 1)
  while (prevIndex.includes(index))
  prevIndex.push(index)
  prevIndex = prevIndex.slice(-5)
  return index
}

export function generateBlogTagsColors(map: Record<string, any>, tags?: string[]) {
  if (!tags || tags.length === 0)
    return

  toArray(tags).forEach((tag) => {
    if (!hasOwn(map, tag))
      map[tag] = getRandom()
  })
}
